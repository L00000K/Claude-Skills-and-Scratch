"""
Fookes Geological Conceptual Model — Sizewell C (SZC) Nuclear Power Station
Suffolk, UK. TM 473 627. 52.2143°N, 1.6197°E.

Stage: Conceptual (desk-study and published ground investigation data).
"""

from fookes_framework import (
    FookesModel,
    GeologicalUnit,
    HydroUnit,
    GeologicalStructure,
    ScreenedHazard,
    UncertaintyItem,
    InvestigationRecommendation,
    Confidence,
    HazardStatus,
    ModelStage,
)


def build_szc_model() -> FookesModel:
    model = FookesModel(
        site_name="Sizewell C Nuclear Power Station",
        project_type="Nuclear power station (Generic Design Assessment — GDA)",
        location="Sizewell, Suffolk, UK",
        coordinates="TM 473 627 | 52.2143°N, 1.6197°E",
        stage=ModelStage.CONCEPTUAL,
        author="Geological Conceptual Model — desk study",
        revision="1",
    )

    model.tectonic_setting = (
        "Stable intraplate setting on the East Anglian Platform. Very low seismicity; "
        "no active faults proven at or near site. Regional eastward dip into the North Sea Basin."
    )
    model.regional_geology = (
        "Cretaceous Chalk (regional bedrock) unconformably overlain by Palaeocene Lambeth Group, "
        "then Eocene Thames Group (Harwich Formation and London Clay Formation). An unconformity "
        "separates these Palaeogene rocks from the Pliocene–Early Pleistocene Crag Group, which "
        "is in turn overlain by Quaternary superficial deposits."
    )
    model.geomorphological_setting = (
        "Low-lying Suffolk coast at 1–3 m AOD. Sizewell Gap — a coastal embayment — defines the "
        "immediate site morphology. Active longshore drift (net southward) with beach management "
        "required. Leiston Marshes lie to the north; North Sea offshore to the east."
    )

    # ------------------------------------------------------------------
    # Stratigraphy — surface to depth
    # ------------------------------------------------------------------

    model.add_unit(GeologicalUnit(
        name="Made Ground",
        age="Holocene (anthropogenic)",
        lithology="Reworked Crag sand, granular fill, occasional clay pockets",
        thickness_m=(0.5, 5.0),
        depth_to_top_m=(0.0, 0.0),
        description=(
            "Reworked Crag sand and other materials placed during Sizewell A and B construction. "
            "Present across most of site to elevations of -2 m to -6.65 m AOD."
        ),
        key_properties=[
            "Variable density",
            "Heterogeneous composition",
            "Potential voids",
            "Contains legacy materials",
        ],
        engineering_significance=(
            "Variable compressibility and density; differential settlement risk; may mask natural "
            "ground profile; perched groundwater possible"
        ),
        confidence=Confidence.HIGH,
    ))

    model.add_unit(GeologicalUnit(
        name="Beach and Dune Deposits",
        age="Holocene",
        lithology="Poorly graded fine to medium sand, shell fragments, occasional gravel lenses",
        thickness_m=(0.5, 3.0),
        depth_to_top_m=(0.0, 0.5),
        description=(
            "Active coastal deposits along Sizewell beach frontage and remnant dune system. "
            "Subject to seasonal variation and storm reworking."
        ),
        key_properties=[
            "Loose to medium dense",
            "High permeability",
            "Tidal saturation",
            "Shell content",
        ],
        engineering_significance=(
            "Low bearing capacity; liquefaction susceptible in saturated loose zones; "
            "highly permeable — rapid groundwater response to tides"
        ),
        confidence=Confidence.HIGH,
    ))

    model.add_unit(GeologicalUnit(
        name="Alluvium and Peat",
        age="Holocene",
        lithology="Soft alluvial clay and silt, peat, organic material; infills palaeochannel",
        thickness_m=(0.5, 8.0),
        depth_to_top_m=(0.0, 2.0),
        description=(
            "Soft Holocene deposits occupying the palaeochannel and low-lying ground. Peat "
            "particularly compressible. Extent of palaeochannel not fully constrained."
        ),
        key_properties=[
            "Very soft",
            "High water content",
            "High compressibility",
            "Low shear strength",
            "Gas generation from peat",
        ],
        engineering_significance=(
            "Major settlement risk; very low bearing capacity; piled foundations required; "
            "methane gas risk from peat decomposition"
        ),
        confidence=Confidence.MEDIUM,
    ))

    model.add_unit(GeologicalUnit(
        name="Red Crag Formation",
        age="Pliocene (c. 3.5–2.0 Ma)",
        lithology="Marine shelly sand, medium to coarse, with gravel lenses and clay partings; Sizewell and Thorpeness members",
        thickness_m=(10.0, 25.0),
        depth_to_top_m=(2.0, 8.0),
        description=(
            "Dominant shallow deposit. Principal shallow aquifer. Occupies sharply bounded basin "
            "of probable erosional origin. Unconformably overlies Palaeogene."
        ),
        key_properties=[
            "Moderately dense to dense",
            "Shell content",
            "Variable clay partings",
            "Locally cemented",
        ],
        engineering_significance=(
            "Principal shallow aquifer (tidal influence); liquefaction susceptibility in looser "
            "zones; good SPT/CPT target; key horizon for shallow foundations"
        ),
        confidence=Confidence.HIGH,
    ))

    model.add_unit(GeologicalUnit(
        name="Norwich Crag Formation",
        age="Early Pleistocene (c. 1.8–1.6 Ma)",
        lithology="Fine to medium marine sand, locally clayey; Chillesford Sand Member",
        thickness_m=(0.0, 8.0),
        depth_to_top_m=(15.0, 25.0),
        description=(
            "Patchy upper Crag unit, present in places. Correlates with Chillesford Sand Member. "
            "Distribution controlled by Crag basin geometry."
        ),
        key_properties=[
            "Fine-grained",
            "Locally clayey",
            "Variable distribution",
        ],
        engineering_significance=(
            "Part of Crag aquifer system; variable density; presence/absence affects groundwater model"
        ),
        confidence=Confidence.MEDIUM,
    ))

    model.add_unit(GeologicalUnit(
        name="London Clay Formation",
        age="Eocene (c. 50–45 Ma)",
        lithology="Stiff to very stiff overconsolidated marine clay; grey-blue; occasional thin sand laminae",
        thickness_m=(20.0, 40.0),
        depth_to_top_m=(25.0, 35.0),
        description=(
            "Major aquitard separating shallow Crag aquifer from deeper Harwich Formation. High "
            "overconsolidation ratio. Proven by boreholes and seismic profiling."
        ),
        key_properties=[
            "High OCR",
            "Low permeability",
            "Fissured",
            "Stiff to hard",
        ],
        engineering_significance=(
            "Excellent aquitard; reliable founding horizon for deep structures; fissures may affect "
            "permeability; swelling on stress relief"
        ),
        confidence=Confidence.HIGH,
    ))

    model.add_unit(GeologicalUnit(
        name="Harwich Formation",
        age="Eocene (c. 55–50 Ma)",
        lithology="Sandy, gravelly, glauconitic; locally cemented; basal Thames Group unit",
        thickness_m=(5.0, 15.0),
        depth_to_top_m=(45.0, 55.0),
        description=(
            "Key founding horizon. Diaphragm wall for main civil works keyed into this formation "
            "at ~50 m depth. Part of Thames Group."
        ),
        key_properties=[
            "Dense sand and gravel",
            "Locally cemented",
            "Glauconitic",
            "Groundwater-bearing",
        ],
        engineering_significance=(
            "Target formation for diaphragm wall toe and deep piles; semi-confined aquifer; "
            "requires careful dewatering management"
        ),
        confidence=Confidence.HIGH,
    ))

    model.add_unit(GeologicalUnit(
        name="Lambeth Group",
        age="Palaeocene–Eocene (c. 58–55 Ma)",
        lithology="Mixed: lower clay-dominant (Reading/Woolwich), upper sandy/heterogeneous; complex interbedding",
        thickness_m=(15.0, 25.0),
        depth_to_top_m=(55.0, 70.0),
        description=(
            "Complex heterogeneous sequence. Lower portion predominantly stiff clay forming "
            "effective aquitard. Sandy lenses may be artesian."
        ),
        key_properties=[
            "Heterogeneous",
            "Interbedded clay and sand",
            "Potentially artesian sandy lenses",
        ],
        engineering_significance=(
            "Sand lenses may present artesian risk during deep excavation; lower clays provide "
            "good seal; complex stratigraphy requires careful characterisation"
        ),
        confidence=Confidence.MEDIUM,
    ))

    model.add_unit(GeologicalUnit(
        name="Chalk Group",
        age="Cretaceous (Late Cretaceous, c. 100–66 Ma)",
        lithology="White chalk with flint; Upper Chalk facies; blocky to massive; high matrix porosity",
        thickness_m=(200.0, 400.0),
        depth_to_top_m=(75.0, 100.0),
        description=(
            "Regional bedrock underlying all of Suffolk. Not directly encountered by ground "
            "investigation — depth inferred from regional BGS data and seismic. Major regional aquifer."
        ),
        key_properties=[
            "High matrix porosity",
            "Dual porosity (matrix + fracture)",
            "Regional aquifer",
            "Dissolution features possible",
        ],
        engineering_significance=(
            "Major regional aquifer (not directly relevant to construction); dissolution features "
            "theoretically possible but not evidenced at site; deep anchor horizon"
        ),
        confidence=Confidence.MEDIUM,
    ))

    # ------------------------------------------------------------------
    # Hydrogeological units
    # ------------------------------------------------------------------

    model.add_hydro_unit(HydroUnit(
        name="Crag Superficial Aquifer",
        unit_type="aquifer",
        formation="Red Crag Formation + Beach Deposits",
        gwl_m_aod=(-0.5, 1.0),
        permeability="High (k ~1e-4 to 1e-3 m/s)",
        notes=(
            "Tidally influenced; direct hydraulic connection to North Sea; seasonal variation "
            "~0.5 m; principal dewatering target"
        ),
    ))

    model.add_hydro_unit(HydroUnit(
        name="London Clay Aquitard",
        unit_type="aquitard",
        formation="London Clay Formation",
        gwl_m_aod=None,
        permeability="Very low (k ~1e-10 m/s)",
        notes="Effective seal between shallow and deep aquifers; minor seepage through fissures",
    ))

    model.add_hydro_unit(HydroUnit(
        name="Harwich Formation Semi-Confined Aquifer",
        unit_type="aquifer",
        formation="Harwich Formation",
        gwl_m_aod=(2.0, 5.0),
        permeability="Moderate-high (k ~1e-5 to 1e-4 m/s)",
        notes=(
            "Potentially artesian relative to surface; head higher than Crag aquifer; "
            "must be managed during deep excavation"
        ),
    ))

    model.add_hydro_unit(HydroUnit(
        name="Lambeth Group Sand Lenses",
        unit_type="aquifer",
        formation="Lambeth Group (sandy units)",
        gwl_m_aod=(3.0, 8.0),
        permeability="Variable (k ~1e-6 to 1e-4 m/s)",
        notes=(
            "Isolated artesian lenses; significant risk during deep excavation if not identified; "
            "requires targeted investigation"
        ),
    ))

    model.add_hydro_unit(HydroUnit(
        name="Chalk Principal Aquifer",
        unit_type="aquifer",
        formation="Chalk Group",
        gwl_m_aod=(0.0, 5.0),
        permeability="High (fracture-dominated)",
        notes=(
            "Regional aquifer; too deep for direct construction relevance but hydraulic connection "
            "possible through faults/fractures"
        ),
    ))

    # ------------------------------------------------------------------
    # Geological structures
    # ------------------------------------------------------------------

    model.add_structure(GeologicalStructure(
        name="Crag Erosional Basin",
        structure_type="unconformity",
        orientation="Irregular basin margins",
        extent="Site-scale (~2 km diameter)",
        engineering_significance=(
            "Controls Crag thickness distribution; sharp margins cause abrupt ground condition "
            "changes; not tectonic in origin"
        ),
        confidence=Confidence.HIGH,
    ))

    model.add_structure(GeologicalStructure(
        name="Base-Crag Unconformity",
        structure_type="unconformity",
        orientation="Sub-horizontal, dipping gently east",
        extent="Regional",
        engineering_significance=(
            "Sharp contact between permeable Crag and relatively impermeable Palaeogene; "
            "potential perched water above; major stratigraphic boundary"
        ),
        confidence=Confidence.HIGH,
    ))

    model.add_structure(GeologicalStructure(
        name="London Clay Fissure Sets",
        structure_type="joint set",
        orientation="Sub-horizontal to low-angle; irregular",
        extent="Throughout London Clay",
        engineering_significance=(
            "Fissures increase effective permeability; control strength in excavation faces; "
            "may create preferred failure planes"
        ),
        confidence=Confidence.MEDIUM,
    ))

    # ------------------------------------------------------------------
    # Screened geohazards
    # ------------------------------------------------------------------

    # Present — HIGH confidence
    model.add_hazard(ScreenedHazard(
        condition_id="COF-001",
        name="Active coastal erosion",
        category="Coastal",
        status=HazardStatus.PRESENT,
        rationale=(
            "Active longshore drift along Sizewell coast; net southward sediment transport; beach "
            "management (shingle recharge) ongoing at site; erosion rates documented by Environment Agency"
        ),
        confidence=Confidence.HIGH,
        investigation_needed=False,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="HYD-009",
        name="High groundwater table",
        category="Hydrogeological",
        status=HazardStatus.PRESENT,
        rationale=(
            "GWL near surface (0 to +1 m AOD); tidally influenced Crag aquifer directly connected "
            "to North Sea; confirmed by 1,500+ investigation locations"
        ),
        confidence=Confidence.HIGH,
        investigation_needed=False,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="GTP-001",
        name="Very soft to soft cohesive soils",
        category="Ground type",
        status=HazardStatus.PRESENT,
        rationale=(
            "Holocene alluvium and peat in palaeochannel confirmed by investigation; "
            "Cu values <20 kPa measured in peat zones"
        ),
        confidence=Confidence.HIGH,
        investigation_needed=False,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="STR-001",
        name="Made ground present",
        category="Stratigraphy",
        status=HazardStatus.PRESENT,
        rationale=(
            "Extensive made ground from Sizewell A and B construction; reworked Crag sand to "
            "depths of -6.65 m AOD; confirmed across site"
        ),
        confidence=Confidence.HIGH,
        investigation_needed=False,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="STR-006",
        name="Peat / highly organic soil",
        category="Stratigraphy",
        status=HazardStatus.PRESENT,
        rationale=(
            "Peat confirmed in palaeochannel sequence; compressed under made ground in places; "
            "gas generation risk"
        ),
        confidence=Confidence.HIGH,
        investigation_needed=False,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="GTP-003",
        name="Highly variable ground",
        category="Ground type",
        status=HazardStatus.PRESENT,
        rationale=(
            "Palaeochannel creates abrupt lateral variation; made ground thickness variable; "
            "Crag basin margins cause sharp changes"
        ),
        confidence=Confidence.HIGH,
        investigation_needed=False,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="COF-009",
        name="Sea level rise impact",
        category="Coastal",
        status=HazardStatus.PRESENT,
        rationale=(
            "Site at 1.5–2.5 m AOD; UKCP18 projections show significant sea level rise over plant "
            "lifetime (60+ years); coastal flood risk increases"
        ),
        confidence=Confidence.HIGH,
        investigation_needed=False,
    ))

    # Present — MEDIUM confidence
    model.add_hazard(ScreenedHazard(
        condition_id="SEI-004",
        name="Liquefaction potential",
        category="Seismic",
        status=HazardStatus.PRESENT,
        rationale=(
            "Loose saturated Crag sands and beach deposits present; seismic demand low but cannot "
            "be excluded for nuclear facility; CPT Ic values indicate susceptible zones"
        ),
        confidence=Confidence.MEDIUM,
        investigation_needed=True,
    ))

    # Possible — MEDIUM confidence
    model.add_hazard(ScreenedHazard(
        condition_id="COF-004",
        name="Storm surge inundation",
        category="Coastal",
        status=HazardStatus.POSSIBLE,
        rationale=(
            "East Anglian coast susceptible to North Sea storm surges (1953 event precedent); "
            "site elevation marginal; coastal defences present but long design life of facility"
        ),
        confidence=Confidence.MEDIUM,
        investigation_needed=False,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="HYD-007",
        name="Saline groundwater intrusion",
        category="Hydrogeological",
        status=HazardStatus.POSSIBLE,
        rationale=(
            "Coastal proximity; tidal influence on Crag aquifer; fresh/saline boundary position "
            "not fully characterised under site"
        ),
        confidence=Confidence.MEDIUM,
        investigation_needed=True,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="GRI-002",
        name="Differential settlement",
        category="Ground risk",
        status=HazardStatus.POSSIBLE,
        rationale=(
            "Variable made ground thickness and composition; palaeochannel edges create abrupt "
            "changes in compressibility; heterogeneous Crag"
        ),
        confidence=Confidence.MEDIUM,
        investigation_needed=True,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="HYD-005",
        name="Artesian conditions",
        category="Hydrogeological",
        status=HazardStatus.POSSIBLE,
        rationale=(
            "Harwich Formation and Lambeth Group sand lenses may be artesian relative to ground "
            "surface; confined conditions possible at depth"
        ),
        confidence=Confidence.MEDIUM,
        investigation_needed=True,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="CON-001",
        name="General contamination from legacy works",
        category="Contamination",
        status=HazardStatus.POSSIBLE,
        rationale=(
            "Made ground from Sizewell A/B may contain contaminants; limited data on composition "
            "of legacy fill"
        ),
        confidence=Confidence.MEDIUM,
        investigation_needed=True,
    ))

    # Absent
    model.add_hazard(ScreenedHazard(
        condition_id="GEO-001",
        name="Active fault",
        category="Geological",
        status=HazardStatus.ABSENT,
        rationale=(
            "No active faults proven at site or in surrounding area; low seismicity region; "
            "Crag Group shown to be unfaulted by investigation"
        ),
        confidence=Confidence.HIGH,
        investigation_needed=False,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="MAM-002",
        name="Deep rotational landslide",
        category="Mass movement",
        status=HazardStatus.ABSENT,
        rationale=(
            "Flat coastal site; no topographic relief for deep-seated failure; no slopes present"
        ),
        confidence=Confidence.HIGH,
        investigation_needed=False,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="GRI-004",
        name="Karst / sinkholes",
        category="Ground risk",
        status=HazardStatus.ABSENT,
        rationale=(
            "Chalk at 75–100 m depth; no surface or near-surface dissolution features recorded; "
            "groundwater chemistry does not indicate active dissolution"
        ),
        confidence=Confidence.MEDIUM,
        investigation_needed=False,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="GRI-005",
        name="Mining subsidence",
        category="Ground risk",
        status=HazardStatus.ABSENT,
        rationale="No historic or active mining in the area",
        confidence=Confidence.HIGH,
        investigation_needed=False,
    ))

    model.add_hazard(ScreenedHazard(
        condition_id="SEI-001",
        name="Tectonic fault rupture at surface",
        category="Seismic",
        status=HazardStatus.ABSENT,
        rationale=(
            "Intraplate setting; no mapped active faults; PSHA demonstrates very low hazard"
        ),
        confidence=Confidence.HIGH,
        investigation_needed=False,
    ))

    # ------------------------------------------------------------------
    # Uncertainty register
    # ------------------------------------------------------------------

    model.add_uncertainty(UncertaintyItem(
        element="Palaeochannel geometry",
        description=(
            "Lateral extent, depth and infill composition of Holocene palaeochannel not fully "
            "resolved; affects settlement and piling design"
        ),
        confidence=Confidence.LOW,
        impact="High",
        resolution=(
            "Additional closely-spaced boreholes and CPT profiles across channel margins; "
            "ground-penetrating radar"
        ),
    ))

    model.add_uncertainty(UncertaintyItem(
        element="Liquefaction susceptibility (Crag sand)",
        description=(
            "Zone-specific liquefaction susceptibility not fully quantified; CPT Ic screening "
            "completed but dynamic test data limited"
        ),
        confidence=Confidence.MEDIUM,
        impact="High",
        resolution=(
            "Dynamic triaxial testing on undisturbed Crag samples; Becker penetration testing; "
            "VS measurements"
        ),
    ))

    model.add_uncertainty(UncertaintyItem(
        element="Harwich Formation depth and continuity",
        description=(
            "Top of Harwich Formation varies; continuity between boreholes not fully proven; "
            "artesian head not measured everywhere"
        ),
        confidence=Confidence.MEDIUM,
        impact="Medium",
        resolution=(
            "Additional deep boreholes to Harwich Formation; standpipe piezometers in Harwich Formation"
        ),
    ))

    model.add_uncertainty(UncertaintyItem(
        element="Saline/fresh groundwater boundary",
        description=(
            "Position of saline intrusion front in Crag aquifer not characterised; relevant to "
            "dewatering and concrete durability"
        ),
        confidence=Confidence.LOW,
        impact="Medium",
        resolution=(
            "Groundwater chemistry sampling from Crag piezometers; resistivity profiling"
        ),
    ))

    model.add_uncertainty(UncertaintyItem(
        element="Lambeth Group sand lens artesian head",
        description=(
            "Individual artesian sand lenses in Lambeth Group not fully mapped; risk during "
            "deep excavation"
        ),
        confidence=Confidence.LOW,
        impact="High",
        resolution=(
            "Targeted boreholes with multilevel piezometers through Lambeth Group"
        ),
    ))

    model.add_uncertainty(UncertaintyItem(
        element="Chalk depth and condition",
        description=(
            "Chalk not directly proven by GI; depth from regional seismic and BGS; "
            "dissolution potential unassessed"
        ),
        confidence=Confidence.LOW,
        impact="Low",
        resolution="Single deep rotary borehole to Chalk",
    ))

    # ------------------------------------------------------------------
    # Investigation recommendations
    # ------------------------------------------------------------------

    model.add_recommendation(InvestigationRecommendation(
        method="Additional boreholes targeting palaeochannel margins",
        rationale=(
            "Palaeochannel geometry and infill composition critical for settlement assessment "
            "and pile design"
        ),
        priority="Critical",
        addresses_uncertainty=["Palaeochannel geometry"],
    ))

    model.add_recommendation(InvestigationRecommendation(
        method="CPT campaign with porewater pressure measurement (CPTU)",
        rationale=(
            "Needed to fully characterise liquefaction susceptibility of Crag sands across "
            "site footprint"
        ),
        priority="Critical",
        addresses_uncertainty=["Liquefaction susceptibility (Crag sand)"],
    ))

    model.add_recommendation(InvestigationRecommendation(
        method="Dynamic triaxial testing on Crag sand samples",
        rationale=(
            "Quantify cyclic resistance ratio for liquefaction assessment in compliance with "
            "nuclear facility requirements"
        ),
        priority="Critical",
        addresses_uncertainty=["Liquefaction susceptibility (Crag sand)"],
    ))

    model.add_recommendation(InvestigationRecommendation(
        method="Consolidation and shear strength testing on alluvium/peat",
        rationale=(
            "Quantify settlement magnitude and rate; design input for piled foundations"
        ),
        priority="High",
        addresses_uncertainty=["Palaeochannel geometry"],
    ))

    model.add_recommendation(InvestigationRecommendation(
        method="Multilevel piezometer installation (Crag, London Clay, Harwich Formation, Lambeth Group)",
        rationale=(
            "Define artesian heads and hydraulic gradients across all units; essential for "
            "dewatering design"
        ),
        priority="High",
        addresses_uncertainty=[
            "Harwich Formation depth and continuity",
            "Lambeth Group sand lens artesian head",
        ],
    ))

    model.add_recommendation(InvestigationRecommendation(
        method="Groundwater chemistry sampling programme",
        rationale=(
            "Characterise salinity, sulphate, pH and chloride content relevant to concrete "
            "durability and dewatering design"
        ),
        priority="High",
        addresses_uncertainty=["Saline/fresh groundwater boundary"],
    ))

    model.add_recommendation(InvestigationRecommendation(
        method="Electrical resistivity tomography (ERT) surveys",
        rationale=(
            "Map saline/fresh groundwater boundary and palaeochannel geometry non-invasively"
        ),
        priority="Medium",
        addresses_uncertainty=[
            "Saline/fresh groundwater boundary",
            "Palaeochannel geometry",
        ],
    ))

    model.add_recommendation(InvestigationRecommendation(
        method="Deep rotary borehole to Chalk",
        rationale=(
            "Confirm Chalk depth, condition and hydrogeology; validate regional interpretation"
        ),
        priority="Medium",
        addresses_uncertainty=["Chalk depth and condition"],
    ))

    return model


if __name__ == "__main__":
    model = build_szc_model()

    report = model.generate_report()
    print(report)

    model.save_json("szc_model_output.json")
    print("\nModel saved to szc_model_output.json")
