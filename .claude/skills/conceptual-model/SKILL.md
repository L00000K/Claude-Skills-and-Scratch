---
name: conceptual-model
description: Generate a Conceptual Site Model (CSM) for an environmental, industrial, or infrastructure site. Use when the user asks to produce a conceptual model for a site — covering geology, hydrogeology, ecology, pollution linkages, and risk characterisation. Trigger on phrases like "conceptual model", "CSM", "site model", or "apply conceptual model to <site>".
---

# Conceptual Site Model Skill

Produce a structured Conceptual Site Model (CSM) document for a named site. A CSM synthesises available data into a coherent narrative that defines source–pathway–receptor (SPR) linkages, supporting risk assessment, environmental impact assessment, or regulatory submissions.

## Workflow

Make a todo list for all tasks in this workflow and work through them one at a time.

### 1. Gather Site Information

Research the site using available sources:
- Location, grid reference, and site area
- Operational history and land use
- Planning status and regulatory context
- Developer and key project documents

Key questions to resolve:
- What is the site currently used for?
- What was it used for historically?
- What is proposed (if a development site)?

### 2. Characterise the Environmental Setting

Collect information on:

**Geography & Topography**
- Position within regional landscape
- Elevation, slope, and drainage
- Coastal, fluvial, or inland setting

**Climate**
- Mean annual rainfall
- Prevailing wind direction
- Temperature range (relevant to volatilisation, freeze-thaw)

**Land Use Context**
- Adjacent land uses (industrial, residential, agricultural, nature reserves)
- Distance to nearest sensitive receptors (dwellings, schools, hospitals)

### 3. Define the Geological Setting

Describe stratigraphy from surface to relevant depth:

| Formation | Age | Lithology | Thickness (approx.) |
|-----------|-----|-----------|----------------------|
| Made Ground / Superficial | — | — | — |
| Named Quaternary unit | Quaternary | — | — |
| Named bedrock unit | — | — | — |

Include:
- Structural geology (faults, folds)
- Geohazards (dissolution, subsidence, seismicity)
- Geotechnical properties relevant to foundation or excavation risk

### 4. Define the Hydrogeological Setting

**Superficial aquifers** (unconfined / perched):
- Extent, saturated thickness, water table depth
- Seasonal variation

**Principal aquifer(s)**:
- Designation (Principal / Secondary A / Secondary B / Unproductive)
- Confined or unconfined
- Groundwater flow direction and gradient
- Abstraction uses (public supply, private, agricultural, industrial)

**Surface water**:
- Named watercourses, ditches, ponds, and coastal waters
- Flow regime (perennial / ephemeral)
- Designated status (River Basin Management Plan classification)
- Connectivity with groundwater (gaining / losing reach)

**Groundwater–surface water interaction**:
- Discharge points, springs, seeps

### 5. Identify Ecological & Environmental Receptors

List designated sites and protected features:

| Designation | Name | Distance from Site | Interest Features |
|-------------|------|--------------------|-------------------|
| SSSI | — | — | — |
| SPA / SAC | — | — | — |
| Ramsar | — | — | — |
| AONB / National Park | — | — | — |
| Local Wildlife Site | — | — | — |

Protected species relevant to site:
- Mammals (bats, otters, water voles)
- Birds (Schedule 1, Red List)
- Reptiles, amphibians, invertebrates, plants

### 6. Identify Contamination Sources

For each potential source:
- Source type (point / diffuse / historical)
- Substance(s) of concern (SoC)
- Location on site
- Likelihood and quantity

Sources to consider:
- Current operations (fuel storage, chemicals, waste)
- Historical uses (mapped from desk study)
- Imported materials (made ground, fill)
- Naturally occurring hazardous substances (arsenic, radon, methane)
- Radiological sources (for nuclear or NORM sites)

### 7. Define Pollutant Linkages (Source–Pathway–Receptor)

Complete a pollutant linkage table:

| Ref | Source | Substance of Concern | Pathway | Receptor | Linkage Plausibility |
|-----|--------|----------------------|---------|----------|----------------------|
| PL1 | — | — | — | — | High / Medium / Low |

Pathways to consider:
- Leaching to groundwater → abstraction
- Runoff to surface water
- Volatilisation → inhalation
- Direct contact / ingestion (soil)
- Dust / particulates
- Thermal discharge → aquatic ecology

### 8. Assess Data Confidence and Gaps

| Data Type | Confidence | Gap / Uncertainty |
|-----------|-----------|-------------------|
| Geology | High / Medium / Low | — |
| Hydrogeology | — | — |
| Ecology | — | — |
| Contamination | — | — |
| Seismicity | — | — |

List recommended further investigation to fill gaps.

### 9. Produce the CSM Diagram (Textual)

Render a structured text diagram showing SPR linkages if a visual tool is unavailable:

```
SOURCES          PATHWAYS              RECEPTORS
───────          ────────              ─────────
[Source A]  ──► Leaching/GW ───────► [Receptor 1]
[Source B]  ──► Surface runoff ─────► [Receptor 2]
[Source C]  ──► Air / dust ─────────► [Receptor 3]
```

### 10. Write the CSM Document

Structure the output document as:

1. Introduction
2. Site Description
3. Geological Setting
4. Hydrogeological Setting
5. Ecological and Environmental Features
6. Contamination Sources and History
7. Pollutant Linkage Assessment
8. Conceptual Model Summary
9. Data Gaps and Recommendations
10. References

### 11. Commit and Push

Save the document to the repository, commit with a descriptive message, and push to the feature branch.

## Output Format

- Markdown document saved as `<site-slug>/conceptual-model.md`
- Tables for stratigraphy, receptors, pollutant linkages, and data gaps
- Textual SPR diagram
- Referenced to publicly available data sources where possible

## Wrap Up

Summarise to the user:
- Site covered and document location
- Key SPR linkages identified
- Critical data gaps flagged
- Recommended next steps
