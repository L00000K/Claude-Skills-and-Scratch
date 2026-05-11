"""
sweet_importer.py
Downloads SWEET ontology TTL modules, parses OWL classes, and writes:
  - docs/js/sweet_concepts.js   (window.SWEET_CONCEPTS = [...])
  - geological-conceptual-model/sweet_concepts.json  (Python-side cache)
"""

import argparse
import json
import re
import urllib.request
from pathlib import Path

import rdflib
from rdflib.namespace import OWL, RDF, RDFS

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

MODULES = [
    "realmGeol",
    "phenGeol",
    "phenGeolGeomorphology",
    "phenGeolFault",
    "matrRock",
    "matrRockIgneous",
    "matrSediment",
    "realmHydro",
    "phenHydro",
    "realmSoil",
    "realmLandform",
]

BASE_URL = "https://raw.githubusercontent.com/ESIPFed/sweet/master/src/{}.ttl"

MODULE_CATEGORY = {
    "matrSediment":          "Stratigraphy",
    "realmSoil":             "Stratigraphy",
    "realmHydro":            "Hydrogeology",
    "phenHydro":             "Hydrogeology",
    "phenGeolFault":         "Geological Structure",
    "matrRock":              "Stratigraphy",
    "matrRockIgneous":       "Stratigraphy",
    "realmGeol":             "Geological Structure",
    "phenGeol":              "Geohazards",
    "phenGeolGeomorphology": "Geomorphology",
    "realmLandform":         "Coastal & Fluvial",
}

SYNONYMS = {
    "clay":         ["clayey", "clays", "cohesive", "cohesive soil", "fine grained"],
    "sand":         ["sandy", "granular", "loose sand", "coarse grained"],
    "gravel":       ["gravelly", "coarse", "cobbles"],
    "alluvium":     ["alluvial", "alluvial deposit", "river deposit", "fluvial"],
    "peat":         ["peaty", "organic", "highly organic", "boggy"],
    "aquifer":      ["water bearing", "water-bearing", "permeable layer", "groundwater bearing"],
    "aquitard":     ["low permeability", "confining layer", "clay seal", "impermeable"],
    "groundwater":  ["ground water", "water table", "phreatic", "piezometric"],
    "landslide":    ["slope failure", "mass movement", "slope instability", "slippage"],
    "karst":        ["sinkhole", "dissolution", "doline", "cave"],
    "fault":        ["faulting", "fault zone", "fault plane", "fracture zone"],
    "subsidence":   ["settlement", "ground movement", "compaction", "consolidation"],
    "liquefaction": ["liquefied", "liquefiable", "cyclic"],
    "erosion":      ["eroding", "eroded", "coastal erosion", "scour"],
    "bedrock":      ["rock head", "rockhead", "solid geology", "parent rock"],
    "fill":         ["made ground", "engineered fill", "imported material", "placed material"],
    "chalk":        ["white chalk", "upper chalk", "middle chalk", "cretaceous"],
    "mudstone":     ["mudrock", "shale", "argillaceous", "silty clay"],
    "limestone":    ["carbonate", "calcareous"],
    "sandstone":    ["arenite", "arenaceous"],
}

SPARQL_QUERY = """
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?uri ?label ?parent ?comment
WHERE {
  ?uri a owl:Class .
  OPTIONAL { ?uri rdfs:label ?label . FILTER(LANG(?label) = "" || LANG(?label) = "en") }
  OPTIONAL { ?uri rdfs:subClassOf ?parent . FILTER(!isBlank(?parent)) }
  OPTIONAL { ?uri rdfs:comment ?comment . FILTER(LANG(?comment) = "" || LANG(?comment) = "en") }
}
"""

# ---------------------------------------------------------------------------
# Paths (resolved relative to this script so it works from any CWD)
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).parent
CACHE_DIR  = SCRIPT_DIR / "sweet_cache"
JSON_OUT   = SCRIPT_DIR / "sweet_concepts.json"
DOCS_JS    = SCRIPT_DIR.parent / "docs" / "js" / "sweet_concepts.js"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def split_camel(label: str) -> list[str]:
    """Split a CamelCase label into lowercase words and a joined form."""
    parts = re.findall(r"[A-Z][a-z]+|[a-z]+|[A-Z]+(?=[A-Z][a-z]|\d|\b)", label)
    if len(parts) <= 1:
        return []
    lower_parts = [p.lower() for p in parts]
    return lower_parts + [" ".join(lower_parts)]


def build_keywords(label: str) -> list[str]:
    """Return a deduplicated keyword list for a concept label."""
    kws: list[str] = []
    seen: set[str] = set()

    def add(kw: str) -> None:
        kw = kw.strip()
        if kw and kw not in seen:
            seen.add(kw)
            kws.append(kw)

    lower = label.lower()
    add(lower)

    # Morphological variants
    if lower.endswith("e"):
        add(lower[:-1] + "ing")
    add(lower + "s")
    add(lower + "ed")

    # CamelCase split
    for part in split_camel(label):
        add(part)

    # Synonym expansion
    for base, syns in SYNONYMS.items():
        if base in lower:
            for s in syns:
                add(s)

    return kws


def compute_depth(uri: rdflib.URIRef, graph: rdflib.Graph, max_hops: int = 5) -> int:
    """Count subClassOf hops from uri to a root class (no further parent), capped at max_hops."""
    depth = 0
    current = uri
    visited: set = set()
    while depth < max_hops:
        parents = [
            p for p in graph.objects(current, RDFS.subClassOf)
            if not isinstance(p, rdflib.BNode)
        ]
        if not parents:
            break
        next_parent = parents[0]
        if next_parent in visited:
            break
        visited.add(next_parent)
        current = next_parent
        depth += 1
    return depth


def get_label_for_uri(uri, graph: rdflib.Graph) -> str:
    """Return the rdfs:label for a URI, or the local name fragment as fallback."""
    for label_lit in graph.objects(uri, RDFS.label):
        lang = label_lit.language or ""
        if lang in ("", "en"):
            return str(label_lit)
    # Fallback: local name
    frag = str(uri).rsplit("/", 1)[-1].rsplit("#", 1)[-1]
    return frag


# ---------------------------------------------------------------------------
# Core processing
# ---------------------------------------------------------------------------

def fetch_module(module: str, force_refresh: bool = False) -> bytes:
    """Return raw TTL bytes for a module, using cache where possible."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_file = CACHE_DIR / f"{module}.ttl"

    if cache_file.exists() and not force_refresh:
        print(f"  [cache] {module}.ttl")
        return cache_file.read_bytes()

    url = BASE_URL.format(module)
    print(f"  [download] {url}")
    with urllib.request.urlopen(url, timeout=15) as resp:
        data: bytes = resp.read()
    cache_file.write_bytes(data)
    return data


def parse_module(module: str, ttl_bytes: bytes) -> list[dict]:
    """Parse a TTL module and return a list of concept dicts."""
    graph = rdflib.Graph()
    graph.parse(data=ttl_bytes, format="turtle")

    results = graph.query(SPARQL_QUERY)
    category = MODULE_CATEGORY.get(module, "General")
    concepts: list[dict] = []

    for row in results:
        uri     = row.uri
        label   = row.label
        parent  = row.parent
        comment = row.comment

        # Skip blank nodes or missing labels
        if isinstance(uri, rdflib.BNode):
            continue
        if label is None:
            continue

        label_str = str(label).strip()
        if not label_str:
            continue

        parent_label = ""
        if parent and not isinstance(parent, rdflib.BNode):
            parent_label = get_label_for_uri(parent, graph)

        depth = compute_depth(uri, graph)

        concepts.append({
            "uri":          str(uri),
            "label":        label_str.lower(),
            "keywords":     build_keywords(label_str),
            "module":       module,
            "category":     category,
            "parent_label": parent_label.lower() if parent_label else "",
            "depth":        depth,
            "comment":      str(comment).strip() if comment else "",
        })

    return concepts


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main(force_refresh: bool = False) -> None:
    all_concepts: list[dict] = []
    seen_labels: set[str] = set()
    module_counts: dict[str, int] = {}

    for module in MODULES:
        print(f"\nProcessing module: {module}")
        try:
            ttl_bytes = fetch_module(module, force_refresh=force_refresh)
            raw_concepts = parse_module(module, ttl_bytes)
        except Exception as exc:
            print(f"  ERROR: {exc}")
            module_counts[module] = 0
            continue

        added = 0
        for concept in raw_concepts:
            lbl = concept["label"]
            if lbl in seen_labels:
                continue
            seen_labels.add(lbl)
            all_concepts.append(concept)
            added += 1

        module_counts[module] = added
        print(f"  -> {added} concepts added")

    # Sort by category then label
    all_concepts.sort(key=lambda c: (c["category"], c["label"]))

    total = len(all_concepts)

    # ------------------------------------------------------------------
    # Write docs/js/sweet_concepts.js
    # ------------------------------------------------------------------
    DOCS_JS.parent.mkdir(parents=True, exist_ok=True)
    json_array = json.dumps(all_concepts, indent=2, ensure_ascii=False)
    js_content = (
        "// SWEET ontology concepts — auto-generated by sweet_importer.py\n"
        "// Source: https://github.com/ESIPFed/sweet (11 geology modules)\n"
        f"// Concepts: {total}\n"
        f"window.SWEET_CONCEPTS = {json_array};\n"
    )
    DOCS_JS.write_text(js_content, encoding="utf-8")
    js_size = DOCS_JS.stat().st_size

    # ------------------------------------------------------------------
    # Write geological-conceptual-model/sweet_concepts.json
    # ------------------------------------------------------------------
    json_content = {
        "version":  "1.0",
        "concepts": all_concepts,
    }
    JSON_OUT.write_text(
        json.dumps(json_content, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    json_size = JSON_OUT.stat().st_size

    # ------------------------------------------------------------------
    # Summary
    # ------------------------------------------------------------------
    print("\n" + "=" * 60)
    print("SWEET import summary")
    print("=" * 60)
    for module in MODULES:
        print(f"  {module:<30} {module_counts.get(module, 0):>4} concepts")
    print("-" * 60)
    print(f"  {'TOTAL':<30} {total:>4} concepts")
    print(f"\n  {DOCS_JS}  ({js_size:,} bytes)")
    print(f"  {JSON_OUT}  ({json_size:,} bytes)")
    print("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Import SWEET ontology modules and generate sweet_concepts files."
    )
    parser.add_argument(
        "--force-refresh",
        action="store_true",
        help="Ignore cached TTL files and re-download all modules.",
    )
    args = parser.parse_args()
    main(force_refresh=args.force_refresh)
