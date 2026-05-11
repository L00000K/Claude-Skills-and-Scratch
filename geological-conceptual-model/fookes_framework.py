"""
Fookes Geological Conceptual Model Framework
Based on: Fookes (1997), Fookes et al. (2000, 2007, 2015)

Implements the three-model progression:
  Conceptual -> Observational -> Analytical
across hierarchical scales from regional to geomaterial.
"""

from __future__ import annotations
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional
import json


class Confidence(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"
    UNKNOWN = "Unknown"


class HazardStatus(str, Enum):
    PRESENT = "Present"
    POSSIBLE = "Possible"
    ABSENT = "Absent"
    UNKNOWN = "Unknown"


class ModelStage(str, Enum):
    CONCEPTUAL = "Conceptual"      # Desk study — a priori
    OBSERVATIONAL = "Observational"  # From investigation data
    ANALYTICAL = "Analytical"       # For engineering design


class GeologicalScale(str, Enum):
    TECTONIC = "Plate Tectonic"
    REGIONAL = "Regional"
    LOCAL = "Local"
    SITE = "Site-Specific"
    GEOMATERIAL = "Geomaterial"


@dataclass
class GeologicalUnit:
    name: str
    age: str
    lithology: str
    thickness_m: Optional[tuple[float, float]] = None   # (min, max)
    depth_to_top_m: Optional[tuple[float, float]] = None
    description: str = ""
    key_properties: list[str] = field(default_factory=list)
    engineering_significance: str = ""
    confidence: Confidence = Confidence.MEDIUM

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "age": self.age,
            "lithology": self.lithology,
            "thickness_m": list(self.thickness_m) if self.thickness_m else None,
            "depth_to_top_m": list(self.depth_to_top_m) if self.depth_to_top_m else None,
            "description": self.description,
            "key_properties": self.key_properties,
            "engineering_significance": self.engineering_significance,
            "confidence": self.confidence.value,
        }

    def summary_row(self) -> str:
        t = f"{self.thickness_m[0]}–{self.thickness_m[1]}m" if self.thickness_m else "unknown"
        d = f"{self.depth_to_top_m[0]}–{self.depth_to_top_m[1]}m" if self.depth_to_top_m else "unknown"
        return f"  {self.name:<40} {self.age:<25} {self.lithology:<35} depth:{d:<20} thick:{t:<15} [{self.confidence.value}]"


@dataclass
class HydroUnit:
    name: str
    unit_type: str          # "aquifer" | "aquitard" | "aquiclude" | "perched"
    formation: str
    gwl_m_aod: Optional[tuple[float, float]] = None  # groundwater level range mAOD
    permeability: str = ""
    notes: str = ""
    confidence: Confidence = Confidence.MEDIUM

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "unit_type": self.unit_type,
            "formation": self.formation,
            "gwl_m_aod": list(self.gwl_m_aod) if self.gwl_m_aod else None,
            "permeability": self.permeability,
            "notes": self.notes,
            "confidence": self.confidence.value,
        }


@dataclass
class GeologicalStructure:
    name: str
    structure_type: str     # fault | fold | unconformity | joint set | shear zone
    orientation: str = ""
    extent: str = ""
    engineering_significance: str = ""
    confidence: Confidence = Confidence.MEDIUM

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "structure_type": self.structure_type,
            "orientation": self.orientation,
            "extent": self.extent,
            "engineering_significance": self.engineering_significance,
            "confidence": self.confidence.value,
        }


@dataclass
class ScreenedHazard:
    condition_id: str
    name: str
    category: str
    status: HazardStatus
    rationale: str
    confidence: Confidence
    investigation_needed: bool = False

    def to_dict(self) -> dict:
        return {
            "condition_id": self.condition_id,
            "name": self.name,
            "category": self.category,
            "status": self.status.value,
            "rationale": self.rationale,
            "confidence": self.confidence.value,
            "investigation_needed": self.investigation_needed,
        }


@dataclass
class UncertaintyItem:
    element: str
    description: str
    confidence: Confidence
    impact: str             # "High" | "Medium" | "Low"
    resolution: str         # recommended action to reduce uncertainty

    def to_dict(self) -> dict:
        return {
            "element": self.element,
            "description": self.description,
            "confidence": self.confidence.value,
            "impact": self.impact,
            "resolution": self.resolution,
        }


@dataclass
class InvestigationRecommendation:
    method: str
    rationale: str
    priority: str           # "Critical" | "High" | "Medium" | "Low"
    addresses_uncertainty: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "method": self.method,
            "rationale": self.rationale,
            "priority": self.priority,
            "addresses_uncertainty": self.addresses_uncertainty,
        }


class FookesModel:
    """
    A Fookes-compliant geological conceptual model.

    The model is built in three iterative stages following the Fookes framework:
      Stage 1 (Conceptual)    — desk study, a priori assessment
      Stage 2 (Observational) — refined from ground investigation data
      Stage 3 (Analytical)    — quantified for engineering design
    """

    def __init__(
        self,
        site_name: str,
        project_type: str,
        location: str = "",
        coordinates: str = "",
        stage: ModelStage = ModelStage.CONCEPTUAL,
        author: str = "",
        revision: str = "0",
    ):
        self.site_name = site_name
        self.project_type = project_type
        self.location = location
        self.coordinates = coordinates
        self.stage = stage
        self.author = author
        self.revision = revision

        # Regional framework
        self.tectonic_setting: str = ""
        self.regional_geology: str = ""
        self.geomorphological_setting: str = ""

        # Stratigraphic column — ordered surface to depth
        self.stratigraphy: list[GeologicalUnit] = []

        # Hydrogeological model
        self.hydro_units: list[HydroUnit] = []

        # Geological structures
        self.structures: list[GeologicalStructure] = []

        # Screened geohazards
        self.hazards: list[ScreenedHazard] = []

        # Uncertainty register
        self.uncertainties: list[UncertaintyItem] = []

        # Investigation recommendations
        self.recommendations: list[InvestigationRecommendation] = []

        # Free-text notes per Fookes scale
        self.scale_notes: dict[str, str] = {s.value: "" for s in GeologicalScale}

    # ------------------------------------------------------------------ build

    def add_unit(self, unit: GeologicalUnit) -> None:
        self.stratigraphy.append(unit)

    def add_hydro_unit(self, unit: HydroUnit) -> None:
        self.hydro_units.append(unit)

    def add_structure(self, structure: GeologicalStructure) -> None:
        self.structures.append(structure)

    def add_hazard(self, hazard: ScreenedHazard) -> None:
        self.hazards.append(hazard)

    def add_uncertainty(self, item: UncertaintyItem) -> None:
        self.uncertainties.append(item)

    def add_recommendation(self, rec: InvestigationRecommendation) -> None:
        self.recommendations.append(rec)

    # ------------------------------------------------------------------ query

    def units_by_confidence(self, confidence: Confidence) -> list[GeologicalUnit]:
        return [u for u in self.stratigraphy if u.confidence == confidence]

    def hazards_by_status(self, status: HazardStatus) -> list[ScreenedHazard]:
        return [h for h in self.hazards if h.status == status]

    def critical_recommendations(self) -> list[InvestigationRecommendation]:
        return [r for r in self.recommendations if r.priority == "Critical"]

    def overall_confidence(self) -> Confidence:
        """Lowest confidence level present in the model — conservative summary."""
        weights = {Confidence.HIGH: 3, Confidence.MEDIUM: 2,
                   Confidence.LOW: 1, Confidence.UNKNOWN: 0}
        if not self.stratigraphy:
            return Confidence.UNKNOWN
        min_w = min(weights[u.confidence] for u in self.stratigraphy)
        return [c for c, w in weights.items() if w == min_w][0]

    def screen_conditions(self, db: "ConditionsDatabase") -> None:
        """
        Populate the hazards list by screening every condition in the database.
        Conditions already present in self.hazards are skipped.
        Unscreened conditions are added with status UNKNOWN.
        """
        existing_ids = {h.condition_id for h in self.hazards}
        for cond in db.conditions:
            if cond["id"] not in existing_ids:
                self.hazards.append(ScreenedHazard(
                    condition_id=cond["id"],
                    name=cond["name"],
                    category=cond["category"],
                    status=HazardStatus.UNKNOWN,
                    rationale="Not yet assessed — requires screening.",
                    confidence=Confidence.UNKNOWN,
                    investigation_needed=True,
                ))

    # ------------------------------------------------------------------ output

    def generate_report(self) -> str:
        lines = []
        _h1 = lambda t: f"\n{'='*80}\n{t}\n{'='*80}"
        _h2 = lambda t: f"\n{t}\n{'-'*len(t)}"

        lines.append(_h1(f"GEOLOGICAL CONCEPTUAL MODEL — {self.site_name.upper()}"))
        lines.append(f"Project type : {self.project_type}")
        lines.append(f"Location     : {self.location}")
        lines.append(f"Coordinates  : {self.coordinates}")
        lines.append(f"Model stage  : {self.stage.value}")
        lines.append(f"Revision     : {self.revision}")
        lines.append(f"Author       : {self.author}")
        lines.append(f"Overall confidence: {self.overall_confidence().value}")

        # Regional framework
        lines.append(_h2("1. Regional Geological Framework"))
        lines.append(f"Tectonic setting      : {self.tectonic_setting}")
        lines.append(f"Regional geology      : {self.regional_geology}")
        lines.append(f"Geomorphological setting: {self.geomorphological_setting}")

        # Stratigraphy
        lines.append(_h2("2. Stratigraphic Column (surface to depth)"))
        lines.append(f"  {'Unit':<40} {'Age':<25} {'Lithology':<35} {'Depth to top':<20} {'Thickness':<15} [Confidence]")
        lines.append("  " + "-"*140)
        for unit in self.stratigraphy:
            lines.append(unit.summary_row())

        # Geology notes
        if any(u.engineering_significance for u in self.stratigraphy):
            lines.append(_h2("  Engineering significance by unit"))
            for unit in self.stratigraphy:
                if unit.engineering_significance:
                    lines.append(f"  {unit.name}: {unit.engineering_significance}")

        # Hydrogeology
        lines.append(_h2("3. Hydrogeological Model"))
        for h in self.hydro_units:
            gwl = f"{h.gwl_m_aod[0]} to {h.gwl_m_aod[1]} mAOD" if h.gwl_m_aod else "unknown"
            lines.append(f"  {h.name} ({h.unit_type}) — {h.formation} | GWL: {gwl} | {h.permeability} | [{h.confidence.value}]")
            if h.notes:
                lines.append(f"    Note: {h.notes}")

        # Geological structures
        lines.append(_h2("4. Geological Structure"))
        if self.structures:
            for s in self.structures:
                lines.append(f"  {s.name} ({s.structure_type}) — {s.orientation} | Extent: {s.extent} | [{s.confidence.value}]")
                if s.engineering_significance:
                    lines.append(f"    Significance: {s.engineering_significance}")
        else:
            lines.append("  No significant structures identified.")

        # Geohazard screening
        lines.append(_h2("5. Geohazard Screening"))
        for status in HazardStatus:
            group = self.hazards_by_status(status)
            if group:
                lines.append(f"\n  [{status.value.upper()}]")
                for h in group:
                    inv = " *** INVESTIGATION REQUIRED ***" if h.investigation_needed else ""
                    lines.append(f"    {h.name:<50} [{h.confidence.value}]{inv}")
                    lines.append(f"      {h.rationale}")

        # Uncertainty register
        lines.append(_h2("6. Uncertainty Register"))
        lines.append(f"  {'Element':<35} {'Confidence':<12} {'Impact':<10} Resolution")
        lines.append("  " + "-"*110)
        for u in self.uncertainties:
            lines.append(f"  {u.element:<35} {u.confidence.value:<12} {u.impact:<10} {u.resolution}")

        # Investigation recommendations
        lines.append(_h2("7. Ground Investigation Recommendations"))
        for priority in ["Critical", "High", "Medium", "Low"]:
            group = [r for r in self.recommendations if r.priority == priority]
            if group:
                lines.append(f"\n  [{priority}]")
                for r in group:
                    lines.append(f"    {r.method}")
                    lines.append(f"      Rationale: {r.rationale}")

        lines.append("\n" + "="*80)
        lines.append("END OF GEOLOGICAL CONCEPTUAL MODEL REPORT")
        lines.append("="*80)

        return "\n".join(lines)

    def to_dict(self) -> dict:
        return {
            "site_name": self.site_name,
            "project_type": self.project_type,
            "location": self.location,
            "coordinates": self.coordinates,
            "stage": self.stage.value,
            "revision": self.revision,
            "author": self.author,
            "tectonic_setting": self.tectonic_setting,
            "regional_geology": self.regional_geology,
            "geomorphological_setting": self.geomorphological_setting,
            "stratigraphy": [u.to_dict() for u in self.stratigraphy],
            "hydro_units": [h.to_dict() for h in self.hydro_units],
            "structures": [s.to_dict() for s in self.structures],
            "hazards": [h.to_dict() for h in self.hazards],
            "uncertainties": [u.to_dict() for u in self.uncertainties],
            "recommendations": [r.to_dict() for r in self.recommendations],
        }

    def save_json(self, path: str) -> None:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(self.to_dict(), f, indent=2)


class ConditionsDatabase:
    """
    Database of potential geological conditions.
    Conditions are loaded from geological_conditions_db.json and can be
    screened against a FookesModel instance.
    """

    def __init__(self, conditions: list[dict]):
        self.conditions = conditions

    @classmethod
    def load(cls, path: str = "geological_conditions_db.json") -> "ConditionsDatabase":
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return cls(data["conditions"])

    def by_category(self, category: str) -> list[dict]:
        return [c for c in self.conditions if c["category"] == category]

    def categories(self) -> list[str]:
        seen = []
        for c in self.conditions:
            if c["category"] not in seen:
                seen.append(c["category"])
        return seen

    def get(self, condition_id: str) -> Optional[dict]:
        for c in self.conditions:
            if c["id"] == condition_id:
                return c
        return None

    def search(self, keyword: str) -> list[dict]:
        kw = keyword.lower()
        return [
            c for c in self.conditions
            if kw in c["name"].lower() or kw in c.get("description", "").lower()
        ]
