"""
text_processor.py
Reads free text and matches it against SWEET ontology concepts and a
hardcoded conditions list, producing a scored JSON report.

Usage:
  python3 text_processor.py --text "Clay at 3m..."
  python3 text_processor.py --file log.txt
  python3 text_processor.py                        # reads stdin
  python3 text_processor.py --text "..." --output results.json
"""

import argparse
import difflib
import json
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).parent
SWEET_JSON  = SCRIPT_DIR / "sweet_concepts.json"

# ---------------------------------------------------------------------------
# Hardcoded conditions list
# ---------------------------------------------------------------------------

CONDITIONS = [
    {"id": "STR-001", "category": "Stratigraphy",        "name": "Made ground / engineered fill",    "keywords": ["fill", "made ground", "imported", "placed material"]},
    {"id": "STR-002", "category": "Stratigraphy",        "name": "Alluvium / soft clay",             "keywords": ["alluvium", "alluvial", "soft clay", "clay"]},
    {"id": "STR-003", "category": "Stratigraphy",        "name": "Peat / organic soil",              "keywords": ["peat", "peaty", "organic", "highly organic"]},
    {"id": "STR-004", "category": "Stratigraphy",        "name": "Beach / coastal sand",             "keywords": ["beach", "sand", "coastal", "dune", "aeolian"]},
    {"id": "STR-005", "category": "Stratigraphy",        "name": "Glacial till / boulder clay",      "keywords": ["till", "boulder clay", "glacial", "moraine"]},
    {"id": "STR-006", "category": "Stratigraphy",        "name": "Chalk bedrock",                    "keywords": ["chalk", "white chalk", "cretaceous"]},
    {"id": "STR-007", "category": "Stratigraphy",        "name": "London Clay / stiff clay",         "keywords": ["london clay", "stiff clay", "overconsolidated", "fissured clay"]},
    {"id": "HYD-001", "category": "Hydrogeology",        "name": "High groundwater table",           "keywords": ["groundwater", "water table", "high water", "phreatic"]},
    {"id": "HYD-002", "category": "Hydrogeology",        "name": "Tidal groundwater influence",      "keywords": ["tidal", "tide", "tidal influence", "coastal"]},
    {"id": "HYD-003", "category": "Hydrogeology",        "name": "Artesian / confined aquifer",      "keywords": ["artesian", "confined", "pressurised", "head"]},
    {"id": "HYD-004", "category": "Hydrogeology",        "name": "Perched water table",              "keywords": ["perched", "perched water", "local water table"]},
    {"id": "HYD-005", "category": "Hydrogeology",        "name": "Saline groundwater",               "keywords": ["saline", "saltwater", "brackish", "chloride"]},
    {"id": "GRI-001", "category": "Ground Instability",  "name": "Settlement of soft ground",        "keywords": ["settlement", "consolidation", "compressible", "soft"]},
    {"id": "GRI-002", "category": "Ground Instability",  "name": "Differential settlement",          "keywords": ["differential", "variable", "uneven", "differential settlement"]},
    {"id": "GRI-003", "category": "Ground Instability",  "name": "Karst dissolution / sinkholes",    "keywords": ["karst", "sinkhole", "dissolution", "collapse"]},
    {"id": "SEI-001", "category": "Seismic",             "name": "Liquefaction potential",           "keywords": ["liquefaction", "liquefiable", "loose sand", "saturated sand"]},
    {"id": "COF-001", "category": "Coastal & Fluvial",   "name": "Active coastal erosion",           "keywords": ["erosion", "coastal erosion", "cliff", "shoreline"]},
    {"id": "COF-002", "category": "Coastal & Fluvial",   "name": "Flooding / inundation",            "keywords": ["flood", "flooding", "inundation", "storm surge"]},
    {"id": "CON-001", "category": "Contamination",       "name": "Made ground contamination",        "keywords": ["contamination", "contaminated", "pollutant", "hazardous"]},
    {"id": "GTP-001", "category": "Geotechnical",        "name": "Very soft cohesive soils",         "keywords": ["soft", "very soft", "low strength", "weak"]},
]

# ---------------------------------------------------------------------------
# Stop words
# ---------------------------------------------------------------------------

STOP_WORDS = {
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'did', 'does', 'not',
    'that', 'this', 'it', 'its', 'he', 'she', 'they', 'we', 'you', 'i',
    'me', 'my', 'his', 'her', 'our', 'their', 'your', 'so', 'if', 'then',
    'than', 'up', 'down', 'out', 'no', 'yes', 'well', 'about', 'into',
    'over', 'after', 'before',
}

# ---------------------------------------------------------------------------
# Tokenisation
# ---------------------------------------------------------------------------

def tokenise(text: str) -> tuple[list[str], list[str]]:
    """Return (unigrams, bigrams) after lowercasing and stop-word removal."""
    raw_tokens = re.findall(r"[a-z]+", text.lower())
    unigrams = [t for t in raw_tokens if t not in STOP_WORDS]
    bigrams  = [
        f"{raw_tokens[i]} {raw_tokens[i + 1]}"
        for i in range(len(raw_tokens) - 1)
    ]
    return unigrams, bigrams

# ---------------------------------------------------------------------------
# SWEET concept loading
# ---------------------------------------------------------------------------

def load_sweet_concepts() -> list[dict]:
    """Load concepts from sweet_concepts.json; return empty list if absent."""
    if not SWEET_JSON.exists():
        print(
            f"Warning: {SWEET_JSON} not found. "
            "Run sweet_importer.py first to generate it.",
            file=sys.stderr,
        )
        return []
    with SWEET_JSON.open(encoding="utf-8") as fh:
        data = json.load(fh)
    return data.get("concepts", [])

# ---------------------------------------------------------------------------
# Keyword index
# ---------------------------------------------------------------------------

def build_keyword_index(concepts: list[dict]) -> dict[str, list[int]]:
    """Map each keyword → list of concept indices."""
    index: dict[str, list[int]] = {}
    for idx, concept in enumerate(concepts):
        for kw in concept.get("keywords", []):
            index.setdefault(kw, []).append(idx)
    return index

# ---------------------------------------------------------------------------
# SWEET scoring
# ---------------------------------------------------------------------------

def score_sweet_concepts(
    unigrams: list[str],
    bigrams:  list[str],
    concepts: list[dict],
    kw_index: dict[str, list[int]],
) -> list[dict]:
    """Return scored + filtered concept matches, sorted by descending score."""
    scores:    dict[int, int]        = {}
    matched:   dict[int, list[str]]  = {}
    all_tokens = unigrams + bigrams

    # Exact matches via index
    for token in all_tokens:
        for idx in kw_index.get(token, []):
            if idx not in scores:
                scores[idx]  = 0
                matched[idx] = []
            base = 10
            extra = min(scores[idx] // 10 * 2, 10)   # +2 per repeat, cap +10
            scores[idx] += base + (extra if token in matched[idx] else 0)
            if token not in matched[idx]:
                matched[idx].append(token)

    # Fuzzy matches (unigrams only, length >= 5)
    for token in unigrams:
        if len(token) < 5:
            continue
        for idx, concept in enumerate(concepts):
            for kw in concept.get("keywords", []):
                ratio = difflib.SequenceMatcher(None, token, kw).ratio()
                if ratio > 0.85:
                    scores[idx] = scores.get(idx, 0) + 5
                    matched.setdefault(idx, [])
                    if kw not in matched[idx]:
                        matched[idx].append(kw)

    # Depth bonus
    for idx in list(scores.keys()):
        depth = concepts[idx].get("depth", 0)
        if depth == 2:
            scores[idx] += 2
        elif depth >= 3:
            scores[idx] += 3

    # Filter, format, sort
    results = []
    for idx, raw_score in scores.items():
        if raw_score < 3:
            continue
        c = concepts[idx]
        results.append({
            "label":            c["label"],
            "uri":              c["uri"],
            "module":           c["module"],
            "category":         c["category"],
            "score":            raw_score,
            "depth":            c.get("depth", 0),
            "matched_keywords": matched.get(idx, []),
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results

# ---------------------------------------------------------------------------
# Condition scoring
# ---------------------------------------------------------------------------

def score_conditions(
    unigrams:     list[str],
    bigrams:      list[str],
    sweet_results: list[dict],
) -> list[dict]:
    """Return scored + sorted condition matches."""
    all_tokens = set(unigrams + bigrams)

    # Categories represented in high-scoring SWEET hits
    top_categories: set[str] = set()
    for hit in sweet_results[:10]:
        top_categories.add(hit["category"])

    max_raw = 0
    raw_scores:    dict[str, int]        = {}
    raw_matched:   dict[str, list[str]]  = {}

    for cond in CONDITIONS:
        cid = cond["id"]
        raw_scores[cid]  = 0
        raw_matched[cid] = []
        for kw in cond["keywords"]:
            if kw in all_tokens:
                raw_scores[cid] += 10
                raw_matched[cid].append(kw)
        if cond["category"] in top_categories:
            raw_scores[cid] += 5
        if raw_scores[cid] > max_raw:
            max_raw = raw_scores[cid]

    # Normalise to 0–100
    results = []
    norm_denom = max_raw * 1.2 if max_raw > 0 else 1.0
    for cond in CONDITIONS:
        cid  = cond["id"]
        raw  = raw_scores[cid]
        if raw <= 0:
            continue
        normalised = min(int(round(raw / norm_denom * 100)), 100)
        results.append({
            "condition_id":      cid,
            "condition_name":    cond["name"],
            "category":          cond["category"],
            "score":             normalised,
            "matched_keywords":  raw_matched[cid],
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results

# ---------------------------------------------------------------------------
# Category roll-up
# ---------------------------------------------------------------------------

def category_scores(sweet_results: list[dict]) -> dict[str, int]:
    """Return the maximum SWEET score per category."""
    cat_max: dict[str, int] = {}
    for hit in sweet_results:
        cat = hit["category"]
        if hit["score"] > cat_max.get(cat, 0):
            cat_max[cat] = hit["score"]
    return dict(sorted(cat_max.items(), key=lambda kv: kv[1], reverse=True))

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def process(text: str) -> dict:
    concepts  = load_sweet_concepts()
    kw_index  = build_keyword_index(concepts)
    unigrams, bigrams = tokenise(text)

    sweet_results     = score_sweet_concepts(unigrams, bigrams, concepts, kw_index)
    condition_results = score_conditions(unigrams, bigrams, sweet_results)

    return {
        "input_summary":        text[:100] + ("..." if len(text) > 100 else ""),
        "token_count":          len(unigrams),
        "matched_conditions":   condition_results,
        "matched_sweet_concepts": sweet_results,
        "category_scores":      category_scores(sweet_results),
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Match free text against SWEET concepts and conditions."
    )
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--text", help="Input text string.")
    group.add_argument("--file", help="Path to a plain-text file.")
    parser.add_argument("--output", help="Write JSON output to this file instead of stdout.")
    args = parser.parse_args()

    if args.text:
        text = args.text
    elif args.file:
        text = Path(args.file).read_text(encoding="utf-8")
    else:
        text = sys.stdin.read()

    result     = process(text)
    json_str   = json.dumps(result, indent=2, ensure_ascii=False)

    if args.output:
        Path(args.output).write_text(json_str, encoding="utf-8")
        print(f"Results written to {args.output}", file=sys.stderr)
    else:
        print(json_str)


if __name__ == "__main__":
    main()
