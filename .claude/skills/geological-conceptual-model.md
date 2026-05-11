# Geological Conceptual Model Skill

Build a geological conceptual model for an engineering or environmental project site following the Fookes model (Fookes, 1997; Fookes et al., 2000, 2007, 2015).

## What is a Fookes Geomodel?

The Fookes model is the standard framework for engineering geology site characterisation. It holds that **ground conditions at any site are the product of total geological and geomorphological history**. The model progresses through three types, built iteratively from regional to site scale:

1. **Conceptual Model** — built from desk study before any fieldwork; identifies what conditions to expect
2. **Observational Model** — built from investigation data; tests and refines the conceptual model
3. **Analytical Model** — built for design; quantifies conditions with engineering properties

The model is hierarchical:
```
Plate Tectonic Scale
  └─ Regional Geological Scale (county/basin)
      └─ Local Geological Scale (project area)
          └─ Site-Specific Scale (footprint)
              └─ Geomaterial Scale (test/sample)
```

## How to Invoke This Skill

When a user asks to build a geological conceptual model, follow these steps:

### Step 1 — Define Site and Scope
Establish:
- Site name, location, coordinates
- Project type (civil, nuclear, infrastructure, etc.)
- Required investigation stage (desk study / conceptual / observational / analytical)
- Relevant regulatory or technical standards

### Step 2 — Regional Geological Framework (Desk Study)
Research and document:
- **Tectonic setting**: regional plate tectonic context, structural provinces
- **Bedrock geology**: principal rock units from oldest to youngest, their ages, lithologies, and regional dip
- **Superficial deposits**: Quaternary sequence including glacial, periglacial, fluvial, coastal and aeolian deposits
- **Geological structure**: faults, folds, unconformities, and their engineering significance
- **Geomorphology**: regional landforms, active/relict processes

### Step 3 — Site-Specific Stratigraphy
Build the stratigraphic column from surface downward:
- Made Ground (if present) — origin, extent, composition
- Recent superficial deposits — alluvium, peat, beach, tidal, colluvium
- Older superficial deposits — glacial till, glaciofluvial, periglacial
- Bedrock formations — in order from shallowest to deepest

For each unit document:
```
Unit name | Age | Lithology | Thickness | Key Properties | Confidence
```

### Step 4 — Hydrogeological Model
Identify:
- Perched water tables
- Principal aquifers and their connectivity
- Aquitards / confining layers
- Groundwater levels and seasonal variation
- Geochemical conditions (pH, sulphates, chlorides)

### Step 5 — Geohazard Assessment
Screen all applicable geohazards from the conditions database against the site:
- Active geomorphological processes (erosion, deposition, flooding)
- Mass movement (landslide, settlement, collapse)
- Seismic hazards (liquefaction, fault rupture, ground shaking)
- Ground instability (dissolution, shrink-swell, compressibility)
- Contamination and made ground
- Coastal / fluvial dynamics

Each hazard is rated: **Present / Possible / Absent / Unknown**

### Step 6 — Uncertainty Register
For each element of the model, assign a confidence level:
- **High** — well constrained by multiple independent sources
- **Medium** — supported by regional data, limited local data
- **Low** — inferred from regional analogues only
- **Unknown** — no data, requires investigation

### Step 7 — Ground Investigation Recommendations
Based on gaps in the conceptual model, recommend:
- Borehole / trial pit programme (location, depth, spacing rationale)
- In-situ testing (SPT, CPT, pressuremeter, packer tests)
- Laboratory testing schedule
- Geophysical surveys
- Monitoring requirements

### Step 8 — Output Formats
Produce:
- Stratigraphic log table
- Geohazard screening table
- Uncertainty register
- Conceptual cross-section description
- Ground investigation scope recommendations
- Model confidence statement

## File Conventions (when building in code)

Use the framework at `geological-conceptual-model/fookes_framework.py` and the conditions database at `geological-conceptual-model/geological_conditions_db.json`.

To build a new site model:
```python
from fookes_framework import FookesModel, GeologicalUnit, Geohazard
from geological_conditions_db import ConditionsDatabase

db = ConditionsDatabase.load()
model = FookesModel(site_name="My Site", project_type="civil")
model.screen_conditions(db)
model.generate_report()
```

## Key References
- Fookes, P.G. (1997). Geology for engineers: the geological model, prediction and performance. *Quarterly Journal of Engineering Geology*, 30, 293–424.
- Fookes, P.G., Baynes, F.J. & Hutchinson, J.N. (2000). Total geological history: a model approach to the anticipation, observation and understanding of site conditions. *Proc. GeoEng 2000*, Melbourne.
- Fookes, P.G., Lee, E.M. & Griffiths, J.S. (2007). *Engineering Geomorphology: Theory and Practice*. Whittles.
- Fookes, P.G., Pettifer, G. & Waltham, T. (2015). *Geomodels in Engineering Geology: An Introduction*. Whittles.
