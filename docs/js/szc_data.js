// SZC Geological Conceptual Model — Inline Data Module
// Sizewell C, Suffolk, UK
// Built following the Fookes (1997) model framework

window.SZC_DATA = {

  site: {
    name: "Sizewell C Nuclear Power Station",
    location: "Sizewell, Suffolk, UK",
    coordinates: { lat: 52.2143, lon: 1.6197 },
    gridRef: "TM 4747 6271",
    stage: "CONCEPTUAL MODEL — Stage 1",
    revision: "Rev 1.0 — May 2026",
    client: "NNB GenCo (SZC) Ltd",
    description: "Sizewell C (SZC) is a proposed two-unit EPR nuclear power station on the Suffolk coast, adjacent to the existing Sizewell B PWR station. The site is underlain by a Holocene to Cretaceous sequence of sediments comprising coastal and marine sands, estuarine alluvium and peat, a thick sequence of Eocene marine clays and sands, and the basal Chalk aquifer. The geological conceptual model has been developed following the Fookes (1997) terrain evaluation and site investigation framework, integrating desk study data, borehole records, and regional geological mapping.",
    references: [
      "Fookes, P.G. (1997). Geology for Engineers: the geological model, prediction and performance. Q. J. Eng. Geol., 30, 293–424.",
      "Fookes, P.G., Baynes, F.J. & Hutchinson, J.N. (2000). Total geological history: a model approach to the anticipation, observation and understanding of site conditions. GeoEng 2000, Melbourne.",
      "Fookes, P.G., Pettifer, G. & Waltham, T. (2015). Geomodels in Engineering Geology: an introduction. Whittles Publishing.",
      "BGS (2023). 1:50,000 Geological Survey Sheet 177 (Aldeburgh). British Geological Survey.",
      "Environment Agency (2021). Suffolk Shoreline Management Plan 2."
    ]
  },

  stratigraphy: [
    {
      id: "MG",
      name: "Made Ground",
      age: "Holocene (anthropogenic, post-1900)",
      lithology: "Reworked Crag sand, gravel fill, concrete rubble, imported material",
      thicknessRange: "0.5–5 m",
      typicalThickness: 2,
      depthToTop: "0 m (surface)",
      depthRange: "0–5 m",
      colour: "#78909c",
      pattern: "hatched",
      confidence: "HIGH",
      engineeringSignificance: "Variable compressibility; potential contamination; requires removal or treatment beneath structures. Permeability highly variable.",
      investigation: ["Trial pits", "Window sampling", "Chemical testing (PFAS, hydrocarbons)", "Dynamic probing"]
    },
    {
      id: "BD",
      name: "Beach and Dune Deposits",
      age: "Holocene (post-glacial, <10 ka)",
      lithology: "Fine–medium quartz sand, shell fragments, locally gravelly. Active coastal sediment system.",
      thicknessRange: "0.5–3 m",
      typicalThickness: 1.5,
      depthToTop: "0 m (coastal strip)",
      depthRange: "0–3 m",
      colour: "#d4a054",
      pattern: "dots",
      confidence: "HIGH",
      engineeringSignificance: "Low bearing capacity when loose; susceptible to liquefaction under seismic or dynamic loading. Coastal erosion risk — updrift/downdrift sediment budget important.",
      investigation: ["CPT", "SPT", "Grain size analysis", "Relative density assessment"]
    },
    {
      id: "AP",
      name: "Alluvium and Peat",
      age: "Holocene (8–3 ka)",
      lithology: "Soft grey clay, silty clay, silt interbedded with peat and organic detritus. Palaeochannel and lagoonal infill.",
      thicknessRange: "0.5–8 m",
      typicalThickness: 3,
      depthToTop: "0–2 m",
      depthRange: "0–10 m",
      colour: "#5d4037",
      pattern: "solid",
      confidence: "MEDIUM",
      engineeringSignificance: "Very low shear strength (cu typically 10–30 kPa); high compressibility; long-term consolidation settlements. Peat: high void ratio, secondary compression significant. Methanogenic decomposition possible.",
      investigation: ["Rotary coring", "Vane shear", "Oedometer testing", "Gas monitoring"]
    },
    {
      id: "RC",
      name: "Red Crag Formation",
      age: "Pliocene (3.5–2.0 Ma)",
      lithology: "Marine shelly sand, medium–coarse, orange-red iron-stained. Gravel lenses. Cross-bedded. Shell hash beds.",
      thicknessRange: "10–25 m",
      typicalThickness: 18,
      depthToTop: "2–8 m",
      depthRange: "2–30 m",
      colour: "#b5651d",
      pattern: "solid",
      confidence: "HIGH",
      engineeringSignificance: "Principal shallow aquifer. Variable density (loose to dense); SPT N typically 15–40. Bearing capacity generally adequate. Shell content increases compressibility. Artesian conditions in some areas.",
      investigation: ["CPT", "SPT", "Pumping tests", "Grain size", "Shell content assessment"]
    },
    {
      id: "NC",
      name: "Norwich Crag Formation",
      age: "Early Pleistocene (1.8–1.6 Ma)",
      lithology: "Fine–medium marine sand, locally clayey. Patchy distribution — may be absent beneath structural areas.",
      thicknessRange: "0–8 m (patchy)",
      typicalThickness: 4,
      depthToTop: "15–25 m",
      depthRange: "15–30 m",
      colour: "#a0856c",
      pattern: "solid",
      confidence: "MEDIUM",
      engineeringSignificance: "Presence/absence uncertain at depth. Where present, provides secondary aquifer pathway. Potential for artesian conditions. Variable density.",
      investigation: ["Rotary coring", "CPT if accessible", "Piezometers"]
    },
    {
      id: "LC",
      name: "London Clay Formation",
      age: "Eocene (50–45 Ma)",
      lithology: "Stiff overconsolidated marine clay, grey-blue, fissured. Pyrite nodules. Septarian concretions locally.",
      thicknessRange: "20–40 m",
      typicalThickness: 30,
      depthToTop: "25–35 m",
      depthRange: "25–65 m",
      colour: "#5c7a9b",
      pattern: "solid",
      confidence: "HIGH",
      engineeringSignificance: "Principal aquitard — separates Crag aquifer from Chalk. High plasticity (Ip 30–60%); swelling/shrinkage on stress relief. Fissure-controlled strength governs deep foundations and excavations. OCR 5–15.",
      investigation: ["Rotary coring", "Triaxial testing (undrained + drained)", "Oedometer", "Permeameter", "SEM for fissure mapping"]
    },
    {
      id: "HF",
      name: "Harwich Formation",
      age: "Eocene (55–50 Ma)",
      lithology: "Sandy gravelly glauconitic clay and sand. Volcanic ash layers (tephrochronology markers). Lignite traces.",
      thicknessRange: "5–15 m",
      typicalThickness: 10,
      depthToTop: "45–55 m",
      depthRange: "45–65 m",
      colour: "#009688",
      pattern: "solid",
      confidence: "HIGH",
      engineeringSignificance: "Diaphragm wall toe target formation. Glauconitic fraction weakens on weathering. Ash layers: potential weak horizons. Permeability higher than London Clay — window of hydraulic connectivity.",
      investigation: ["Rotary coring with geophysical logging", "Permeability testing", "XRD mineralogy", "Geophysical logging"]
    },
    {
      id: "LG",
      name: "Lambeth Group",
      age: "Palaeocene–Eocene (58–55 Ma)",
      lithology: "Mixed sequence: lower stiff clay dominant (Reading Beds equivalent), upper sandy clay and sand. Fluvio-estuarine.",
      thicknessRange: "15–25 m",
      typicalThickness: 20,
      depthToTop: "55–70 m",
      depthRange: "55–90 m",
      colour: "#7e57c2",
      pattern: "solid",
      confidence: "MEDIUM",
      engineeringSignificance: "Heterogeneous; variable permeability. Lower clay: low permeability. Upper sands: confined aquifer potential (perched). Foundation bearing stratum for deep piling schemes.",
      investigation: ["Rotary coring", "Falling head tests", "Piezometers in each sub-unit"]
    },
    {
      id: "CK",
      name: "Chalk Group",
      age: "Late Cretaceous (100–66 Ma)",
      lithology: "White chalk with flint bands (Upper Chalk). Grey chalk below. Fine-grained, porous, micro-fissured. Flint nodule horizons.",
      thicknessRange: "200–400 m (regional)",
      typicalThickness: 300,
      depthToTop: "75–100 m",
      depthRange: "75 m+",
      colour: "#f5f0e8",
      pattern: "solid",
      confidence: "MEDIUM",
      engineeringSignificance: "Major regional confined aquifer. Artesian head above ground level possible. SPT refusal at top Chalk (weathered). Putty chalk at shallow levels if eroded. Flint hazard for tunnelling. Groundwater chemistry: hard, Ca-HCO3 type.",
      investigation: ["Rotary coring", "Pumping tests", "Packer tests", "Groundwater quality sampling", "Geophysical logging"]
    }
  ],

  hydroUnits: [
    {
      id: "HU1",
      name: "Crag Aquifer",
      type: "aquifer",
      formation: "Red Crag + Beach Deposits",
      gwlMAOD: "+0.5 to +2.0",
      permeability: "5×10⁻⁴ to 5×10⁻³ m/s",
      characteristics: "Unconfined to semi-confined. Tidal influence within 200 m of coast. Hydraulic connection with sea.",
      confidence: "HIGH",
      notes: "Primary shallow aquifer. Sensitive to sea-level rise and storm surge. Saline intrusion risk in coastal zone."
    },
    {
      id: "HU2",
      name: "London Clay Aquitard",
      type: "aquitard",
      formation: "London Clay Formation",
      gwlMAOD: "N/A (aquitard)",
      permeability: "1×10⁻¹⁰ to 1×10⁻¹² m/s",
      characteristics: "Major regional aquitard. Separates Crag shallow system from deep Chalk aquifer. Fissure permeability locally higher.",
      confidence: "HIGH",
      notes: "Integrity critical for containment. Fissures near surface may create preferential pathways."
    },
    {
      id: "HU3",
      name: "Harwich/Lambeth Aquifer",
      type: "semi-confined",
      formation: "Harwich Formation + Lambeth Group sands",
      gwlMAOD: "+1.5 to +4.0 (artesian potential)",
      permeability: "1×10⁻⁶ to 1×10⁻⁴ m/s",
      characteristics: "Semi-confined to confined. Artesian head above ground possible. Interconnected with Chalk via vertical pathways.",
      confidence: "MEDIUM",
      notes: "Artesian risk during excavation. Dewatering design must account for this unit."
    },
    {
      id: "HU4",
      name: "Chalk Aquifer",
      type: "aquifer",
      formation: "Chalk Group",
      gwlMAOD: "+3.0 to +6.0 (artesian)",
      permeability: "1×10⁻⁵ to 1×10⁻³ m/s (fissure-dominated)",
      characteristics: "Major regional confined aquifer. Artesian head typically above ground level. Fissure and matrix dual porosity.",
      confidence: "MEDIUM",
      notes: "Regional resource — abstraction sensitivity. Thermal plume risk. Water quality monitoring required."
    }
  ],

  hazards: [
    // PRESENT hazards
    {
      id: "H001",
      name: "Active Coastal Erosion",
      status: "PRESENT",
      category: "Geomorphological",
      confidence: "HIGH",
      rationale: "Historical shoreline mapping shows net retreat rate of 0.5–1.5 m/yr on adjacent coastline. SSSI designation requires managed realignment consideration. Updrift sediment supply deficit confirmed.",
      investigationRequired: true,
      investigationNote: "Quantitative coastal process modelling required; sediment budget study."
    },
    {
      id: "H002",
      name: "High Groundwater Table",
      status: "PRESENT",
      category: "Hydrogeological",
      confidence: "HIGH",
      rationale: "Crag aquifer groundwater level typically 0.5–2.0 m bgl across site. Tidal influence observed in coastal boreholes. Winter levels may reach surface in low-lying areas.",
      investigationRequired: true,
      investigationNote: "Long-term groundwater monitoring network required; tidal lag analysis."
    },
    {
      id: "H003",
      name: "Very Soft Soils (Alluvium/Peat)",
      status: "PRESENT",
      category: "Geotechnical",
      confidence: "HIGH",
      rationale: "Alluvium and peat identified in boreholes across low-lying areas. Cu values <25 kPa measured. High organic content. Significant long-term settlement expected.",
      investigationRequired: true,
      investigationNote: "Full laboratory characterisation; long-term settlement analysis."
    },
    {
      id: "H004",
      name: "Made Ground Variability",
      status: "PRESENT",
      category: "Geotechnical",
      confidence: "HIGH",
      rationale: "Site of former power station construction and WWII military use. Made ground heterogeneous — variable thickness and composition. Historical maps indicate imported fill areas.",
      investigationRequired: true,
      investigationNote: "Comprehensive trial pit and chemical investigation programme."
    },
    {
      id: "H005",
      name: "Peat and Organic Soils",
      status: "PRESENT",
      category: "Geotechnical",
      confidence: "HIGH",
      rationale: "Peat layers identified within alluvial sequence. Organic content up to 80% in some samples. Secondary compression (creep) significant. Methane generation possible.",
      investigationRequired: false,
      investigationNote: ""
    },
    {
      id: "H006",
      name: "Highly Variable Ground Conditions",
      status: "PRESENT",
      category: "Geotechnical",
      confidence: "HIGH",
      rationale: "Patchy distribution of Holocene deposits, variable Crag thickness, and localised palaeochannel features create significant lateral variability across the site footprint.",
      investigationRequired: true,
      investigationNote: "Targeted infill investigation to characterise spatial variability."
    },
    {
      id: "H007",
      name: "Sea Level Rise Impact",
      status: "PRESENT",
      category: "Geomorphological",
      confidence: "HIGH",
      rationale: "UKCP18 projections indicate 0.3–1.0 m sea level rise by 2100 (RCP8.5). Coastal flood risk increases. Groundwater salinisation risk increases. Design life of SZC plant >60 years.",
      investigationRequired: false,
      investigationNote: ""
    },
    {
      id: "H008",
      name: "Liquefaction Potential",
      status: "PRESENT",
      category: "Seismic",
      confidence: "MEDIUM",
      rationale: "Loose to medium dense sands in Crag and Beach deposits below water table. Site-specific seismic hazard analysis (SHA) required. Eurocode 8 screening suggests susceptible zones.",
      investigationRequired: true,
      investigationNote: "CPT-based liquefaction assessment; site-specific SHA to BS EN 1998."
    },
    // POSSIBLE hazards
    {
      id: "H009",
      name: "Storm Surge Inundation",
      status: "POSSIBLE",
      category: "Geomorphological",
      confidence: "MEDIUM",
      rationale: "1953 North Sea surge reached 3.0 m above ODN locally. Future events with sea level rise could overtop existing defences. Probability of extreme events increases with climate change.",
      investigationRequired: true,
      investigationNote: "Extreme water level statistical analysis; coastal flood modelling."
    },
    {
      id: "H010",
      name: "Saline Groundwater Intrusion",
      status: "POSSIBLE",
      category: "Hydrogeological",
      confidence: "MEDIUM",
      rationale: "Tidal influence on Crag aquifer confirmed. Potential for saline wedge migration during dewatering operations or sea level rise. Chloride concentrations elevated in coastal boreholes.",
      investigationRequired: true,
      investigationNote: "Groundwater quality baseline; saline intrusion modelling."
    },
    {
      id: "H011",
      name: "Differential Settlement",
      status: "POSSIBLE",
      category: "Geotechnical",
      confidence: "MEDIUM",
      rationale: "Transition zones between alluvium/peat and Crag, and variable made ground, create risk of differential settlement beneath large structures. Palaeochannels present worst case.",
      investigationRequired: true,
      investigationNote: "Detailed settlement analysis; ground improvement options study."
    },
    {
      id: "H012",
      name: "Artesian Conditions",
      status: "POSSIBLE",
      category: "Hydrogeological",
      confidence: "MEDIUM",
      rationale: "Harwich/Lambeth sand horizons may be artesian. Chalk artesian head historically above ground level. Risk of blow-out during deep excavation if aquiclude penetrated.",
      investigationRequired: true,
      investigationNote: "Deep standpipe piezometers in Harwich and Chalk; artesian risk assessment for deep excavations."
    },
    {
      id: "H013",
      name: "Legacy Contamination",
      status: "POSSIBLE",
      category: "Contamination",
      confidence: "MEDIUM",
      rationale: "Former Sizewell A station (decommissioned), WWII military activity, and historical industrial uses. Low-level radiological contamination possible in made ground. Phase II ESA required.",
      investigationRequired: true,
      investigationNote: "Phase II Environmental Site Assessment; radiological baseline survey."
    },
    // ABSENT hazards
    {
      id: "H014",
      name: "Active Fault / Fault Rupture",
      status: "ABSENT",
      category: "Seismic",
      confidence: "HIGH",
      rationale: "No mapped active faults within 10 km. UK is in a low seismicity intraplate setting. BGS seismic hazard database shows no surface rupture hazard. Nearest significant structure (Caledonian basement) at >5 km depth.",
      investigationRequired: false,
      investigationNote: ""
    },
    {
      id: "H015",
      name: "Deep Rotational Landslide",
      status: "ABSENT",
      category: "Mass Movement",
      confidence: "HIGH",
      rationale: "Topography is flat to gently sloping coastal plain. Relief insufficient to generate deep-seated slope failure. No evidence of pre-existing landslides in BGS mass movement database for this location.",
      investigationRequired: false,
      investigationNote: ""
    },
    {
      id: "H016",
      name: "Karst / Sinkholes",
      status: "ABSENT",
      category: "Dissolution",
      confidence: "HIGH",
      rationale: "Chalk is confined under thick clay cover. No pathway for meteoric water recharge sufficient to cause significant dissolution at shallow depth. No sinkholes recorded within 5 km radius.",
      investigationRequired: false,
      investigationNote: ""
    },
    {
      id: "H017",
      name: "Mining Subsidence",
      status: "ABSENT",
      category: "Anthropogenic",
      confidence: "HIGH",
      rationale: "No coal mining or other underground mineral extraction recorded within influencing distance of site. Coal Authority records confirm no past or planned mining.",
      investigationRequired: false,
      investigationNote: ""
    },
    {
      id: "H018",
      name: "Tectonic Fault Rupture",
      status: "ABSENT",
      category: "Seismic",
      confidence: "HIGH",
      rationale: "UK plate tectonic setting (stable craton) precludes surface fault rupture. Maximum credible earthquake <ML 5.5 for this region. No Quaternary fault scarps identified.",
      investigationRequired: false,
      investigationNote: ""
    }
  ],

  conditions: [
    // GEOTECHNICAL - Soils
    { id: "C001", name: "Soft clay", category: "Soils", subcategory: "Fine-grained", thickness: "0.5–8 m", significance: "Low bearing capacity; high consolidation settlement", investigation: ["Undisturbed sampling", "Triaxial CU/CD", "Oedometer"], settings: ["Foundations", "Slope stability", "Retaining walls"] },
    { id: "C002", name: "Peat / Organic soil", category: "Soils", subcategory: "Organic", thickness: "0.2–3 m", significance: "Very high compressibility; secondary compression; gas generation", investigation: ["Rotary coring", "VOC screening", "Gas monitoring"], settings: ["Foundations", "Dewatering", "Earthworks"] },
    { id: "C003", name: "Loose sand", category: "Soils", subcategory: "Coarse-grained", thickness: "1–15 m", significance: "Liquefaction susceptible; bearing capacity variable", investigation: ["CPT", "SPT", "Grain size"], settings: ["Seismic design", "Foundations", "Slopes"] },
    { id: "C004", name: "Dense sand", category: "Soils", subcategory: "Coarse-grained", thickness: "1–20 m", significance: "High bearing capacity; low compressibility; dilatant", investigation: ["CPT", "SPT"], settings: ["Foundations", "Ground anchors"] },
    { id: "C005", name: "Made ground", category: "Soils", subcategory: "Anthropogenic", thickness: "0.5–5 m", significance: "Heterogeneous; potential contamination; variable compressibility", investigation: ["Trial pits", "Dynamic probing", "Chemical testing"], settings: ["Foundations", "Earthworks", "Contamination"] },
    { id: "C006", name: "Fill — engineered", category: "Soils", subcategory: "Anthropogenic", thickness: "1–10 m", significance: "Controlled properties; verify compliance", investigation: ["Compaction testing", "CBR"], settings: ["Earthworks", "Pavements"] },
    { id: "C007", name: "Alluvium", category: "Soils", subcategory: "Fine-grained", thickness: "1–5 m", significance: "Variable; soft clays/silts problematic", investigation: ["Vane shear", "Oedometer"], settings: ["Foundations", "Retaining walls"] },
    { id: "C008", name: "Colluvium", category: "Soils", subcategory: "Mixed", thickness: "0.5–3 m", significance: "Unstable on slopes; variable density", investigation: ["Trial pits", "In-situ density"], settings: ["Slopes", "Earthworks"] },
    { id: "C009", name: "Stiff fissured clay", category: "Soils", subcategory: "Fine-grained", thickness: "10–40 m", significance: "Fissure-controlled strength; swelling; progressive failure risk", investigation: ["Large diameter sampling", "Triaxial with fissures", "Suction measurement"], settings: ["Slopes", "Retaining walls", "Deep excavations"] },
    { id: "C010", name: "Overconsolidated clay", category: "Soils", subcategory: "Fine-grained", thickness: "10–40 m", significance: "High OCR; stress relief swelling; K0 >1 possible", investigation: ["Triaxial (K0 consol)", "Ko testing"], settings: ["Excavations", "Tunnels", "Foundations"] },
    { id: "C011", name: "Glacial till", category: "Soils", subcategory: "Mixed", thickness: "0–5 m", significance: "Very variable; boulders possible; perched water", investigation: ["Trial pits", "SPT"], settings: ["Foundations", "Earthworks"] },
    { id: "C012", name: "Shelly sand", category: "Soils", subcategory: "Coarse-grained", thickness: "5–20 m", significance: "Shell content increases compressibility; degradation risk", investigation: ["Shell content analysis", "Triaxial"], settings: ["Foundations", "Seabed structures"] },
    { id: "C013", name: "Gravel / gravelly sand", category: "Soils", subcategory: "Coarse-grained", thickness: "0.5–5 m", significance: "High permeability; good drainage; suitable sub-base", investigation: ["Grading", "Permeameter"], settings: ["Drainage", "Foundations", "Sub-base"] },
    { id: "C014", name: "Silty sand", category: "Soils", subcategory: "Mixed", thickness: "1–10 m", significance: "Intermediate permeability; susceptible to piping", investigation: ["Erosion testing", "CPT"], settings: ["Embankments", "Levees", "Retaining walls"] },
    { id: "C015", name: "Sensitive clay", category: "Soils", subcategory: "Fine-grained", thickness: "1–8 m", significance: "Loss of strength on remoulding; flow slide risk", investigation: ["Fall cone", "Vane shear remoulded"], settings: ["Excavation slopes", "Offshore"] },
    { id: "C016", name: "Expansive clay", category: "Soils", subcategory: "Fine-grained", thickness: "1–15 m", significance: "Volume change with moisture; foundation heave/settlement", investigation: ["SDSS", "Suction measurement", "Swell tests"], settings: ["Shallow foundations", "Pavements", "Buried structures"] },
    { id: "C017", name: "Collapsible soil", category: "Soils", subcategory: "Fine-grained", thickness: "1–5 m", significance: "Collapse on wetting; sudden settlement", investigation: ["Oedometer (inundated)", "Field wetting tests"], settings: ["Foundations", "Earthworks"] },
    { id: "C018", name: "Quick clay", category: "Soils", subcategory: "Fine-grained", thickness: "1–10 m", significance: "Very high sensitivity; liquefaction-like flow failure", investigation: ["Specialized sampling", "Remoulded triaxial"], settings: ["Nordic contexts; not expected SZC"] },
    // HYDROGEOLOGICAL
    { id: "C019", name: "Unconfined aquifer", category: "Hydrogeology", subcategory: "Groundwater", thickness: "5–30 m", significance: "Dewatering required; drawdown effects on surroundings", investigation: ["Pumping tests", "Monitoring wells"], settings: ["Excavations", "Tunnels", "Dewatering"] },
    { id: "C020", name: "Confined aquifer", category: "Hydrogeology", subcategory: "Groundwater", thickness: "N/A (head concept)", significance: "Artesian blowout risk in excavations; heave", investigation: ["Standpipe piezometers", "Packer tests"], settings: ["Deep excavations", "Tunnels"] },
    { id: "C021", name: "Perched water table", category: "Hydrogeology", subcategory: "Groundwater", thickness: "Variable", significance: "Unexpected water in excavations; slope instability", investigation: ["Piezometers at multiple depths"], settings: ["Excavations", "Slopes"] },
    { id: "C022", name: "Artesian conditions", category: "Hydrogeology", subcategory: "Groundwater", thickness: "N/A", significance: "Groundwater rises above ground level; severe dewatering challenge", investigation: ["Deep piezometers", "Pump tests"], settings: ["Deep excavations", "Tunnels", "Basements"] },
    { id: "C023", name: "Tidal groundwater influence", category: "Hydrogeology", subcategory: "Groundwater", thickness: "N/A", significance: "Fluctuating water levels; dewatering effectiveness reduced", investigation: ["Tidal lag analysis", "Long-term monitoring"], settings: ["Coastal construction", "Jetties"] },
    { id: "C024", name: "Saline groundwater", category: "Hydrogeology", subcategory: "Water quality", thickness: "N/A", significance: "Concrete durability; steel corrosion; disposal of pumped water", investigation: ["Hydrochemical sampling", "TDS measurement"], settings: ["Coastal works", "Marine structures"] },
    { id: "C025", name: "Aggressive groundwater", category: "Hydrogeology", subcategory: "Water quality", thickness: "N/A", significance: "Sulfate/acid attack on concrete; corrosion of steel", investigation: ["Full chemical suite", "pH, SO4, Cl analysis"], settings: ["Buried structures", "Foundations", "Piles"] },
    { id: "C026", name: "Groundwater drawdown effects", category: "Hydrogeology", subcategory: "Groundwater", thickness: "N/A", significance: "Settlement of adjacent structures; impact on abstractions/ecology", investigation: ["Groundwater flow model", "Settlement monitoring"], settings: ["Dewatering", "Tunnels"] },
    { id: "C027", name: "Seepage and piping", category: "Hydrogeology", subcategory: "Erosion", thickness: "N/A", significance: "Internal erosion of embankments; underseepage of dams", investigation: ["Seepage analysis", "Erosion testing"], settings: ["Embankments", "Levees", "Cofferdams"] },
    // GEOLOGICAL STRUCTURES
    { id: "C028", name: "Faults", category: "Structures", subcategory: "Tectonic", thickness: "N/A (linear)", significance: "Displacement; permeability conduit or barrier; seismic hazard", investigation: ["Trenching", "Geophysics", "Core logging"], settings: ["Dams", "Nuclear", "Tunnels"] },
    { id: "C029", name: "Joints and fractures", category: "Structures", subcategory: "Tectonic", thickness: "N/A", significance: "Rock mass strength reduced; groundwater pathways", investigation: ["Scanline mapping", "Stereonet", "Packer tests"], settings: ["Excavations", "Slope stability", "Dam foundations"] },
    { id: "C030", name: "Bedding planes", category: "Structures", subcategory: "Sedimentary", thickness: "N/A", significance: "Failure plane in dipping sequences; differential weathering", investigation: ["Core logging", "Dip measurement"], settings: ["Slopes", "Tunnels", "Quarries"] },
    { id: "C031", name: "Unconformities", category: "Structures", subcategory: "Stratigraphic", thickness: "N/A", significance: "Unexpected ground change; missing units; palaeotopography", investigation: ["Seismic survey", "Close-spaced boreholes"], settings: ["Foundations", "Tunnels"] },
    { id: "C032", name: "Dip and strike", category: "Structures", subcategory: "Sedimentary", thickness: "N/A", significance: "Directional strength anisotropy; slope stability direction sensitive", investigation: ["Inclinometer", "Core orientation"], settings: ["Slopes", "Excavations"] },
    // GEOHAZARDS
    { id: "C033", name: "Landslide (shallow)", category: "Hazards", subcategory: "Mass movement", thickness: "1–5 m", significance: "Slope instability; infrastructure damage", investigation: ["Geomorphological mapping", "CPT", "Inclinometers"], settings: ["Cut slopes", "Embankments"] },
    { id: "C034", name: "Landslide (deep-seated)", category: "Hazards", subcategory: "Mass movement", thickness: "5–50 m", significance: "Major structural damage; long runout", investigation: ["Deep boreholes", "Inclinometers", "Monitoring"], settings: ["Dams", "Reservoirs", "Highways"] },
    { id: "C035", name: "Debris flow", category: "Hazards", subcategory: "Mass movement", thickness: "N/A (event)", significance: "Rapid high-energy event; infrastructure damage", investigation: ["Geomorphological mapping", "Rainfall threshold analysis"], settings: ["Mountainous terrain; not applicable SZC"] },
    { id: "C036", name: "Rockfall", category: "Hazards", subcategory: "Mass movement", thickness: "N/A", significance: "Impact load; structural damage", investigation: ["Kinematic analysis", "Rock mass classification"], settings: ["Rocky cliffs; not applicable SZC"] },
    { id: "C037", name: "Subsidence (natural)", category: "Hazards", subcategory: "Ground movement", thickness: "N/A", significance: "Differential settlement; structural damage", investigation: ["InSAR", "Precision levelling"], settings: ["Foundations", "Infrastructure"] },
    { id: "C038", name: "Subsidence (mining)", category: "Hazards", subcategory: "Anthropogenic", thickness: "N/A", significance: "Void collapse; surface cracking; tilting", investigation: ["Coal Authority records", "Resistivity survey"], settings: ["Former coalfield areas"] },
    { id: "C039", name: "Dissolution / karst", category: "Hazards", subcategory: "Chemical", thickness: "N/A (variable)", significance: "Sinkhole formation; irregular rock head; foundation risk", investigation: ["Microgravity", "Probing", "GPR"], settings: ["Chalk/limestone areas"] },
    { id: "C040", name: "Liquefaction", category: "Hazards", subcategory: "Seismic", thickness: "1–15 m", significance: "Loss of shear strength; foundation failure; lateral spreading", investigation: ["CPT Bq/Fr", "SPT N correction", "Vs measurements"], settings: ["Coastal/river sands", "Seismic zones"] },
    { id: "C041", name: "Lateral spreading", category: "Hazards", subcategory: "Seismic", thickness: "N/A", significance: "Horizontal displacement of ground; bridge/pipeline damage", investigation: ["SPT/CPT + seismic", "Topographic survey"], settings: ["River banks", "Slopes near liquefiable soils"] },
    { id: "C042", name: "Seismic amplification", category: "Hazards", subcategory: "Seismic", thickness: "N/A", significance: "Site-specific ground motion amplification; increased structural demands", investigation: ["MASW", "Vs30 measurement", "HVSR"], settings: ["All seismic zones"] },
    { id: "C043", name: "Coastal erosion", category: "Hazards", subcategory: "Geomorphological", thickness: "N/A", significance: "Asset loss; shoreline retreat; undermining of structures", investigation: ["Aerial photo analysis", "Beach monitoring", "Numerical modelling"], settings: ["Coastal sites"] },
    { id: "C044", name: "Flooding (fluvial)", category: "Hazards", subcategory: "Geomorphological", thickness: "N/A", significance: "Inundation; scour; damage to infrastructure", investigation: ["Flood frequency analysis", "Hydraulic modelling"], settings: ["River floodplains"] },
    { id: "C045", name: "Flooding (coastal/tidal)", category: "Hazards", subcategory: "Geomorphological", thickness: "N/A", significance: "Storm surge; overtopping; saline damage", investigation: ["Extreme water level statistics", "Coastal flood modelling"], settings: ["Coastal sites"] },
    { id: "C046", name: "Wind erosion / deflation", category: "Hazards", subcategory: "Geomorphological", thickness: "N/A", significance: "Sand migration; burial of structures; dust", investigation: ["Wind rose analysis", "Sediment budget"], settings: ["Arid/semi-arid; coastal dunes"] },
    // ROCK CONDITIONS
    { id: "C047", name: "Weathered rock", category: "Rock", subcategory: "Weathering", thickness: "1–30 m", significance: "Reduced strength; variable foundation conditions", investigation: ["Core logging", "Schmidt hammer", "Point load"], settings: ["Foundations", "Excavations", "Tunnels"] },
    { id: "C048", name: "Chalk (putty)", category: "Rock", subcategory: "Chalk", thickness: "0.5–5 m", significance: "Very low strength; compressible; frost susceptible", investigation: ["California Bearing Ratio", "Triaxial"], settings: ["Foundations on Chalk", "Earthworks"] },
    { id: "C049", name: "Flint", category: "Rock", subcategory: "Chalk", thickness: "N/A (nodules)", significance: "Cutter wear in TBM; concrete aggregate reactivity (AAR)", investigation: ["Petrographic examination", "UKAS AAR testing"], settings: ["Tunnels", "Concrete production"] },
    { id: "C050", name: "Rock mass discontinuities", category: "Rock", subcategory: "Structure", thickness: "N/A", significance: "Kinematic instability; anisotropic permeability", investigation: ["Scanline survey", "RQD", "Q-system"], settings: ["Slopes", "Tunnels", "Foundations"] },
    // CONTAMINATION
    { id: "C051", name: "Hydrocarbon contamination", category: "Contamination", subcategory: "Chemical", thickness: "N/A (plume)", significance: "Soil/groundwater pollution; vapour intrusion; disposal costs", investigation: ["Phase II ESA", "LNAPL assessment"], settings: ["Former industrial sites"] },
    { id: "C052", name: "Sulfate contamination", category: "Contamination", subcategory: "Chemical", thickness: "N/A", significance: "Concrete attack; BRE Special Digest design", investigation: ["Full chemical suite", "pH, SO4"], settings: ["Made ground", "Gypsum-bearing soils"] },
    { id: "C053", name: "Heavy metals", category: "Contamination", subcategory: "Chemical", thickness: "N/A", significance: "Human health risk; disposal classification; CLEA assessment", investigation: ["XRF", "ICP-MS", "Soil sampling grid"], settings: ["Former industrial sites", "Infilled areas"] },
    { id: "C054", name: "Asbestos in ground", category: "Contamination", subcategory: "Physical", thickness: "N/A", significance: "Health and safety during excavation; disposal costs", investigation: ["Bulk asbestos survey", "Licensed removal"], settings: ["Former industrial sites", "Demolition areas"] },
    { id: "C055", name: "Landfill gas", category: "Contamination", subcategory: "Gas", thickness: "N/A (plume)", significance: "Explosion risk; asphyxiation; building regulations", investigation: ["Gas monitoring wells", "Flammability screening"], settings: ["Former landfills", "Peat/organic soils"] },
    { id: "C056", name: "Radiological contamination", category: "Contamination", subcategory: "Radiological", thickness: "N/A", significance: "Worker dose; waste classification; regulatory compliance", investigation: ["In-situ gamma survey", "Soil sampling and analysis"], settings: ["Nuclear sites", "Medical facilities"] },
    // GEOPHYSICAL
    { id: "C057", name: "Buried channels", category: "Buried Features", subcategory: "Palaeotopography", thickness: "2–15 m", significance: "Unexpected soft ground; variable founding depth; water",  investigation: ["Seismic reflection", "GPR", "Closely-spaced boreholes"], settings: ["Foundations", "Tunnels"] },
    { id: "C058", name: "Buried structures", category: "Buried Features", subcategory: "Anthropogenic", thickness: "N/A", significance: "Obstruction to piling; contamination; structural interaction", investigation: ["GPR", "Magnetometry", "Trial pits"], settings: ["Urban sites", "Former industrial"] },
    { id: "C059", name: "Underground voids", category: "Buried Features", subcategory: "Anthropogenic", thickness: "N/A", significance: "Collapse risk; sinkhole; confined space", investigation: ["Microgravity", "GPR", "Probing"], settings: ["Former mining", "Karst", "Old cellars"] },
    { id: "C060", name: "Obstructions (boulders)", category: "Buried Features", subcategory: "Geological", thickness: "N/A", significance: "Piling obstruction; plant damage; cost overrun", investigation: ["Probe holes", "Magnetic susceptibility", "GPR"], settings: ["Glaciated areas", "Boulder clay"] },
    // ENGINEERING GEOLOGY
    { id: "C061", name: "Rock head variability", category: "Engineering Geology", subcategory: "Interface", thickness: "N/A", significance: "Variable founding depth; unexpected cost", investigation: ["Closely-spaced boreholes", "Seismic refraction"], settings: ["Pile design", "Basement excavation"] },
    { id: "C062", name: "Palaeochannel infill", category: "Engineering Geology", subcategory: "Palaeotopography", thickness: "2–8 m", significance: "Soft compressible infill; differential settlement", investigation: ["GPR", "Seismic reflection", "Boreholes"], settings: ["Foundations", "Earthworks"] },
    { id: "C063", name: "Glaciotectonic deformation", category: "Engineering Geology", subcategory: "Structural", thickness: "1–10 m", significance: "Folded/faulted stratigraphy; anomalous dip", investigation: ["Core logging", "Geophysics"], settings: ["Northern UK and Europe"] },
    { id: "C064", name: "Relict periglacial features", category: "Engineering Geology", subcategory: "Cryogenic", thickness: "0.5–3 m", significance: "Ice wedge casts; involutions; disturbed stratigraphy", investigation: ["Trial pits", "GPR"], settings: ["Formerly periglacial terrains"] },
    { id: "C065", name: "Shrinkage cracks", category: "Engineering Geology", subcategory: "Seasonal", thickness: "0.5–2 m", significance: "Seasonal ground movement; pipe damage; foundation movement", investigation: ["Soil profile", "Tree survey"], settings: ["Clay soils", "Shallow foundations"] },
    // FOUNDATIONS
    { id: "C066", name: "Negative skin friction", category: "Foundations", subcategory: "Pile design", thickness: "N/A", significance: "Additional downdrag load on piles in consolidating soil", investigation: ["Settlement monitoring", "Pile instrumentation"], settings: ["Piles through soft ground"] },
    { id: "C067", name: "Pile refusal", category: "Foundations", subcategory: "Pile design", thickness: "N/A", significance: "Inability to reach design depth; programme delays", investigation: ["Pre-bore socket design", "Bouldering survey"], settings: ["Driven piles in hard ground"] },
    { id: "C068", name: "Heave in excavations", category: "Foundations", subcategory: "Excavation", thickness: "N/A", significance: "Base instability; structural damage; water ingress", investigation: ["Heave calculations", "Monitoring"], settings: ["Deep excavations in soft clay"] },
    { id: "C069", name: "Wall friction", category: "Foundations", subcategory: "Retaining", thickness: "N/A", significance: "Critical to retaining wall design; angle of friction required", investigation: ["Interface shear tests", "Direct shear"], settings: ["Sheet piles", "Diaphragm walls"] },
    // SLOPE STABILITY
    { id: "C070", name: "Cut slope stability", category: "Slopes", subcategory: "Stability", thickness: "N/A", significance: "Failure risk during construction; long-term stability", investigation: ["Limit equilibrium analysis", "Monitoring"], settings: ["Road cuttings", "Excavations"] },
    { id: "C071", name: "Embankment stability", category: "Slopes", subcategory: "Stability", thickness: "N/A", significance: "Embankment failure; damage to roads/railways", investigation: ["Slope stability analysis", "Pore pressure monitoring"], settings: ["Road/rail embankments", "Flood defences"] },
    { id: "C072", name: "Long-term slope creep", category: "Slopes", subcategory: "Stability", thickness: "N/A", significance: "Gradual displacement; infrastructure damage", investigation: ["Inclinometers", "InSAR monitoring"], settings: ["Natural slopes", "Old cuttings"] },
    // SEISMICITY
    { id: "C073", name: "Ground motion (PGA)", category: "Seismicity", subcategory: "Seismic hazard", thickness: "N/A", significance: "Structural design acceleration; slope stability", investigation: ["SHA", "Vs30"], settings: ["All seismic zones"] },
    { id: "C074", name: "Site amplification factor", category: "Seismicity", subcategory: "Site response", thickness: "N/A", significance: "Increases design spectral accelerations", investigation: ["MASW", "HVSR", "1D response analysis"], settings: ["Soft soil sites in seismic zones"] },
    { id: "C075", name: "Fault proximity", category: "Seismicity", subcategory: "Seismic hazard", thickness: "N/A", significance: "Near-fault directivity effects; fault avoidance setback", investigation: ["Trench studies", "Geomorphological mapping"], settings: ["Active tectonic settings"] },
    // THERMAL / SPECIAL
    { id: "C076", name: "Thermal properties of ground", category: "Special", subcategory: "Thermal", thickness: "N/A", significance: "GSHP design; thermal plume from cooling water discharge", investigation: ["Thermal conductivity tests", "TRT"], settings: ["GSHP", "Nuclear cooling"] },
    { id: "C077", name: "Ground gas (biogenic)", category: "Special", subcategory: "Gas", thickness: "N/A", significance: "Methane from peat/organic material; CO2", investigation: ["Gas monitoring wells", "BRE 414 screening"], settings: ["Peat sites", "Landfill proximity"] },
    { id: "C078", name: "Ground gas (geogenic)", category: "Special", subcategory: "Gas", thickness: "N/A", significance: "Radon; CO2 from carbonate; H2S from sulfate reduction", investigation: ["Radon survey", "Continuous monitoring"], settings: ["Permeable geology", "Mine sites"] },
    { id: "C079", name: "Frost susceptibility", category: "Special", subcategory: "Frost", thickness: "N/A (seasonal)", significance: "Heave in frost-susceptible soils; pavement damage", investigation: ["Frost heave test (BS 812)", "Grading"], settings: ["Cold climates", "Pavements"] },
    { id: "C080", name: "Dispersive soil", category: "Special", subcategory: "Erosion", thickness: "N/A", significance: "Internal erosion; piping; embankment failure", investigation: ["Pinhole test", "Crumb test", "SCS test"], settings: ["Embankments", "Dam foundations", "Irrigation channels"] },
    // MARINE / COASTAL
    { id: "C081", name: "Seabed morphology", category: "Marine", subcategory: "Geomorphology", thickness: "N/A", significance: "Scour; pipeline routing; cable landing", investigation: ["Multibeam bathymetry", "Side-scan sonar"], settings: ["Offshore", "Nearshore"] },
    { id: "C082", name: "Scour", category: "Marine", subcategory: "Erosion", thickness: "N/A", significance: "Foundation undermining of offshore structures", investigation: ["Physical model", "Numerical modelling", "Monitoring"], settings: ["Offshore piles", "Bridge piers"] },
    { id: "C083", name: "Sediment transport", category: "Marine", subcategory: "Geomorphology", thickness: "N/A", significance: "Burial or exposure of infrastructure; beach management", investigation: ["Longshore drift measurement", "Sediment budget"], settings: ["Coastal structures", "Intakes/outfalls"] },
    { id: "C084", name: "Wave loading", category: "Marine", subcategory: "Hydrodynamic", thickness: "N/A", significance: "Structural design of coastal and offshore structures", investigation: ["Wave buoy data", "Spectral analysis"], settings: ["Coastal structures", "Offshore platforms"] },
    { id: "C085", name: "Storm surge", category: "Marine", subcategory: "Extreme events", thickness: "N/A", significance: "Coastal inundation; asset damage; emergency planning", investigation: ["Extreme value analysis", "Surge modelling"], settings: ["Low-lying coastal"] },
    { id: "C086", name: "Beach dynamics", category: "Marine", subcategory: "Geomorphology", thickness: "0–5 m", significance: "Seasonal change; management of foreshore access", investigation: ["Beach surveys", "Lidar"], settings: ["Coastal sites"] },
    { id: "C087", name: "Nearshore bathymetry change", category: "Marine", subcategory: "Geomorphology", thickness: "N/A", significance: "Channel migration; altered wave regime", investigation: ["Repeat multibeam", "Tide gauges"], settings: ["Coastal intake/outfall"] },
    // CONSTRUCTION CONSIDERATIONS
    { id: "C088", name: "Excavatability", category: "Construction", subcategory: "Method", thickness: "N/A", significance: "Plant selection; programme; cost", investigation: ["Point load index", "UCS", "Seismic velocity"], settings: ["All excavation works"] },
    { id: "C089", name: "Groundwater management", category: "Construction", subcategory: "Dewatering", thickness: "N/A", significance: "Dewatering design; well spacing; settlement monitoring", investigation: ["Pumping tests", "Groundwater model"], settings: ["Below water table excavations"] },
    { id: "C090", name: "Temporary works stability", category: "Construction", subcategory: "Safety", thickness: "N/A", significance: "Cofferdam; trench support; false work design", investigation: ["Soil parameters for structural design"], settings: ["All construction"] },
    { id: "C091", name: "Deformation monitoring", category: "Construction", subcategory: "Monitoring", thickness: "N/A", significance: "Early warning; as-built verification; back-analysis", investigation: ["Inclinometers", "Extensometers", "Precise levelling"], settings: ["Deep excavations", "Adjacent structures"] },
    { id: "C092", name: "Vibration from piling", category: "Construction", subcategory: "Vibration", thickness: "N/A", significance: "Damage to adjacent structures; disturbance to residents", investigation: ["Vibration monitoring", "Pre-construction survey"], settings: ["Driven piles in urban areas"] },
    { id: "C093", name: "Noise and dust", category: "Construction", subcategory: "Environmental", thickness: "N/A", significance: "Planning compliance; SSSI impact; worker health", investigation: ["Noise survey", "Air quality baseline"], settings: ["Near sensitive receptors"] },
    // GEOTECHNICAL DESIGN PARAMETERS
    { id: "C094", name: "Undrained shear strength (cu)", category: "Parameters", subcategory: "Strength", thickness: "N/A", significance: "Foundation bearing capacity; slope stability", investigation: ["Triaxial UU/CU", "Vane shear", "CPT correlation"], settings: ["Clays", "Soft ground"] },
    { id: "C095", name: "Friction angle (phi)", category: "Parameters", subcategory: "Strength", thickness: "N/A", significance: "Drained stability of slopes; retaining walls; foundations", investigation: ["Triaxial CD", "Direct shear", "CPT"], settings: ["Sands", "Granular materials"] },
    { id: "C096", name: "Compression index (Cc)", category: "Parameters", subcategory: "Compressibility", thickness: "N/A", significance: "Settlement magnitude in clays", investigation: ["Oedometer tests", "Rowe cell"], settings: ["Soft clays", "Peat"] },
    { id: "C097", name: "Coefficient of consolidation (cv)", category: "Parameters", subcategory: "Compressibility", thickness: "N/A", significance: "Rate of settlement; drain spacing in PVD design", investigation: ["Oedometer", "Rowe cell hydraulic"], settings: ["Soft clays"] },
    { id: "C098", name: "Permeability (k)", category: "Parameters", subcategory: "Hydraulic", thickness: "N/A", significance: "Groundwater flow; dewatering yield; drainage design", investigation: ["Falling head", "Pumping test", "CPTu Bq"], settings: ["All soils"] },
    { id: "C099", name: "Stiffness (E, G)", category: "Parameters", subcategory: "Stiffness", thickness: "N/A", significance: "Settlement at working load; dynamic response", investigation: ["Triaxial with LDT", "MASW", "Seismic CPT"], settings: ["Foundations", "Dynamic design"] },
    { id: "C100", name: "Unit weight (gamma)", category: "Parameters", subcategory: "Density", thickness: "N/A", significance: "Load calculations; overburden stress; buoyancy", investigation: ["Nuclear density", "Sand replacement", "Lab measurement"], settings: ["All geotechnical design"] },
    // MONITORING AND INSTRUMENTATION
    { id: "C101", name: "Settlement monitoring", category: "Monitoring", subcategory: "Ground movement", thickness: "N/A", significance: "Verify predictions; trigger action levels; claims avoidance", investigation: ["Precise levelling", "EM points", "SAA"], settings: ["All major construction"] },
    { id: "C102", name: "Groundwater monitoring", category: "Monitoring", subcategory: "Hydrogeology", thickness: "N/A", significance: "Seasonal trends; dewatering effectiveness; environmental compliance", investigation: ["Standpipe piezometers", "Vibrating wire", "Telemetry"], settings: ["All below-ground works"] },
    { id: "C103", name: "Inclinometer monitoring", category: "Monitoring", subcategory: "Ground movement", thickness: "N/A", significance: "Detect lateral movement; trigger alarms; verify stability", investigation: ["In-place inclinometers", "Periodic manual reading"], settings: ["Retaining walls", "Slopes"] },
    { id: "C104", name: "Pore pressure monitoring", category: "Monitoring", subcategory: "Hydrogeology", thickness: "N/A", significance: "Effective stress; stability analysis; consolidation progress", investigation: ["Vibrating wire piezometers", "Standpipes"], settings: ["Embankments", "Soft ground improvement"] },
    { id: "C105", name: "Structural monitoring", category: "Monitoring", subcategory: "Structures", thickness: "N/A", significance: "Detect distress; trigger intervention; safety assurance", investigation: ["Crack gauges", "Tiltmeters", "Strain gauges"], settings: ["Adjacent existing structures"] },
    // ENVIRONMENTAL
    { id: "C106", name: "Dust generation", category: "Environmental", subcategory: "Air quality", thickness: "N/A", significance: "Health impact; SSSI particle deposition", investigation: ["Baseline dust monitoring", "IAQM assessment"], settings: ["Earthworks", "Demolition"] },
    { id: "C107", name: "Ecology — ground condition", category: "Environmental", subcategory: "Biodiversity", thickness: "N/A", significance: "Habitat assessment; Habitats Regulations Assessment; mitigation", investigation: ["Phase 1 habitat survey", "Protected species surveys"], settings: ["Greenfield sites", "SSSI proximity"] },
    { id: "C108", name: "Carbon footprint — earthworks", category: "Environmental", subcategory: "Sustainability", thickness: "N/A", significance: "Scope 1/2/3 emissions; net zero commitments; client ESG targets", investigation: ["CEEQUAL/BREEAM assessment", "Material balance optimisation"], settings: ["Large earthwork schemes"] }
  ],

  recommendations: [
    {
      id: "R001",
      priority: "CRITICAL",
      method: "Site-Specific Seismic Hazard Analysis (SHA) and Liquefaction Assessment",
      rationale: "Loose Crag sands below water table present credible liquefaction risk. SHA required to BS EN 1998-5 and NS-TAST-GD-013 (ONR guidance). CPT-based liquefaction triggering analysis essential for safety case.",
      addresses: ["Liquefaction Potential", "Seismic Amplification", "Lateral Spreading"],
      investigationMethod: "CPT, MASW, SHA (probabilistic + deterministic), 1D site response analysis"
    },
    {
      id: "R002",
      priority: "CRITICAL",
      method: "Long-term Groundwater Monitoring Network Installation",
      rationale: "Groundwater levels in Crag aquifer control dewatering design, artesian risk, and saline intrusion potential. Baseline data essential before construction dewatering begins. Tidal influence must be quantified.",
      addresses: ["High Groundwater Table", "Artesian Conditions", "Saline Groundwater Intrusion", "Tidal Influence"],
      investigationMethod: "Multi-level vibrating wire piezometers, telemetry, tidal lag analysis, >24 months baseline"
    },
    {
      id: "R003",
      priority: "CRITICAL",
      method: "Phase II Environmental Site Assessment and Radiological Baseline Survey",
      rationale: "Former Sizewell A nuclear site and WWII military use create legacy contamination risk. Radiological baseline required by ONR for safety case. Contamination may affect waste classification and disposal costs.",
      addresses: ["Legacy Contamination", "Radiological Contamination", "Made Ground Variability"],
      investigationMethod: "In-situ gamma spectrometry, soil sampling grid, groundwater quality, Phase II ESA to CLR11"
    },
    {
      id: "R004",
      priority: "CRITICAL",
      method: "Deep Borehole Programme with Geophysical Logging (to Chalk)",
      rationale: "Chalk aquifer and artesian conditions in Harwich/Lambeth units not adequately characterised. Deep boreholes required to confirm artesian head, Chalk rockhead depth, and dewatering design parameters.",
      addresses: ["Artesian Conditions", "Chalk Aquifer", "Harwich/Lambeth Aquifer"],
      investigationMethod: "Rotary cored boreholes to 120m, geophysical logging suite (gamma, resistivity, sonic), packer tests, standpipe piezometers"
    },
    {
      id: "R005",
      priority: "HIGH",
      method: "Comprehensive Ground Investigation — Soft Ground Characterisation",
      rationale: "Alluvium and peat variability across site drives differential settlement risk. Full undisturbed sampling and laboratory programme required for settlement analysis and ground improvement design.",
      addresses: ["Very Soft Soils", "Peat and Organic Soils", "Differential Settlement"],
      investigationMethod: "Rotary coring, undisturbed samples (Sherbrooke/block), vane shear, triaxial CU, oedometer, CPTU"
    },
    {
      id: "R006",
      priority: "HIGH",
      method: "Coastal Process and Geomorphological Survey",
      rationale: "Active coastal erosion and sea level rise are design-life hazards. Quantitative sediment budget and extreme water level statistics required for design and coastal protection scheme.",
      addresses: ["Active Coastal Erosion", "Storm Surge Inundation", "Sea Level Rise Impact"],
      investigationMethod: "Lidar bathymetry and topography, historical map analysis, wave/tide data compilation, sediment budget, UKCP18 scenario analysis"
    },
    {
      id: "R007",
      priority: "HIGH",
      method: "Trial Pit Programme — Made Ground Assessment",
      rationale: "Made ground heterogeneity requires systematic investigation. Chemical testing needed for waste classification and reuse assessment. Thickness confirmation for foundation design.",
      addresses: ["Made Ground Variability", "Legacy Contamination"],
      investigationMethod: "Trial pits on 25m grid, logging, sampling, chemical suite (PFAS, hydrocarbons, heavy metals, asbestos), dynamic probing beneath"
    },
    {
      id: "R008",
      priority: "HIGH",
      method: "Deep Pumping Test Programme",
      rationale: "Hydrogeological parameters for Crag and Chalk aquifers required for dewatering design and groundwater flow modelling. Single-well and multi-well tests needed.",
      addresses: ["High Groundwater Table", "Artesian Conditions", "Groundwater Drawdown Effects"],
      investigationMethod: "Constant rate pumping tests (72hr), step tests, recovery monitoring, multi-piezometer array, tidal analysis"
    },
    {
      id: "R009",
      priority: "MEDIUM",
      method: "Geophysical Survey — Buried Channel Detection",
      rationale: "Palaeochannels in Holocene alluvium create local anomalies in ground conditions. Geophysical survey to locate and map channels prior to targeted borehole investigation.",
      addresses: ["Highly Variable Ground Conditions", "Palaeochannel Infill", "Differential Settlement"],
      investigationMethod: "Ground-penetrating radar (GPR), seismic reflection (P-wave), followed by targeted boreholes"
    },
    {
      id: "R010",
      priority: "MEDIUM",
      method: "Vs30 and Site Response Characterisation",
      rationale: "Eurocode 8 ground class requires Vs30 measurement. Soft Holocene sediments may amplify ground motion. HVSR and MASW surveys required across site.",
      addresses: ["Seismic Amplification", "Liquefaction Potential"],
      investigationMethod: "MASW array surveys, HVSR (Nakamura method), downhole geophysics, resonant column testing"
    },
    {
      id: "R011",
      priority: "MEDIUM",
      method: "Groundwater Quality Baseline Survey",
      rationale: "Concrete durability classification and saline intrusion risk require water chemistry data. Chloride, sulfate, pH, and organic content needed to BS EN 206 and BRE Special Digest 1.",
      addresses: ["Saline Groundwater Intrusion", "Aggressive Groundwater"],
      investigationMethod: "Multi-depth groundwater sampling, full chemical suite, isotopic analysis for recharge sources"
    },
    {
      id: "R012",
      priority: "MEDIUM",
      method: "Offshore Geophysical and Geotechnical Survey — Intake/Outfall Routes",
      rationale: "Cooling water intake and outfall pipelines require offshore ground characterisation. Seabed morphology, sediment transport, and scour risk must be assessed.",
      addresses: ["Seabed Morphology", "Scour", "Sediment Transport"],
      investigationMethod: "Multibeam echosounder, side-scan sonar, sub-bottom profiler, vibrocores, PCPT"
    },
    {
      id: "R013",
      priority: "LOW",
      method: "Long-term Settlement Monitoring — Adjacent Existing Infrastructure",
      rationale: "Construction activities and dewatering may affect existing Sizewell B station and local infrastructure. Pre-construction survey and monitoring programme required.",
      addresses: ["Differential Settlement", "Groundwater Drawdown Effects"],
      investigationMethod: "Precise levelling benchmarks, crack monitoring, SAA, telemetry system"
    },
    {
      id: "R014",
      priority: "LOW",
      method: "Ground Gas Risk Assessment",
      rationale: "Peat and organic deposits could generate biogenic methane. BRE 414 screening required for structures overlying or near organic material.",
      addresses: ["Peat and Organic Soils", "Landfill Gas"],
      investigationMethod: "Gas monitoring wells, continuous monitoring (CO2, CH4, O2), BRE 414 risk assessment"
    },
    {
      id: "R015",
      priority: "LOW",
      method: "Ecological Habitat and Protected Species Survey",
      rationale: "Site boundary adjacent to SSSI. Habitats Regulations Assessment required. Ground disturbance may impact protected species (reptiles, water voles, nesting birds).",
      addresses: ["Ecology — Ground Condition"],
      investigationMethod: "Phase 1 habitat survey, protected species surveys (NVC, reptile, water vole, ornithological), HRA screening"
    }
  ],

  uncertainties: [
    {
      id: "U001",
      element: "Norwich Crag Formation — Extent and Thickness",
      confidence: "LOW",
      impact: "HIGH",
      resolution: "Additional targeted boreholes at 25–30 m depth in structural areas; geophysical correlation"
    },
    {
      id: "U002",
      element: "Liquefaction Susceptibility — Crag Sands",
      confidence: "LOW",
      impact: "HIGH",
      resolution: "CPT programme with Bq measurement; SHA; CPT-based liquefaction triggering analysis"
    },
    {
      id: "U003",
      element: "Artesian Head — Harwich/Lambeth Sands",
      confidence: "LOW",
      impact: "HIGH",
      resolution: "Deep standpipe piezometers to each sand horizon; long-term monitoring"
    },
    {
      id: "U004",
      element: "Alluvium/Peat — Spatial Distribution and Thickness",
      confidence: "MEDIUM",
      impact: "HIGH",
      resolution: "GPR/seismic reflection survey; systematic CPTU grid; palaeochannel mapping"
    },
    {
      id: "U005",
      element: "Made Ground — Composition and Contamination",
      confidence: "MEDIUM",
      impact: "MEDIUM",
      resolution: "Systematic trial pit and chemical testing programme on 25m grid"
    },
    {
      id: "U006",
      element: "Chalk Aquifer — Artesian Head and Fissure Permeability",
      confidence: "MEDIUM",
      impact: "MEDIUM",
      resolution: "Deep boreholes to Chalk; packer tests; pumping test programme"
    },
    {
      id: "U007",
      element: "London Clay — Fissure Frequency and Orientation",
      confidence: "MEDIUM",
      impact: "MEDIUM",
      resolution: "High-quality rotary coring; CT scanning; large diameter sample testing"
    },
    {
      id: "U008",
      element: "Seismic Site Response — Vs30 and Dynamic Soil Properties",
      confidence: "LOW",
      impact: "HIGH",
      resolution: "MASW surveys; downhole geophysics; HVSR; resonant column testing"
    },
    {
      id: "U009",
      element: "Legacy Contamination — Nature and Extent",
      confidence: "LOW",
      impact: "MEDIUM",
      resolution: "Phase II ESA; radiological baseline; systematic soil and groundwater sampling"
    },
    {
      id: "U010",
      element: "Coastal Erosion Rate — Future Projection",
      confidence: "MEDIUM",
      impact: "HIGH",
      resolution: "Quantitative coastal process modelling; UKCP18 integration; long-term monitoring"
    },
    {
      id: "U011",
      element: "Saline Groundwater — Extent of Intrusion Zone",
      confidence: "LOW",
      impact: "MEDIUM",
      resolution: "Groundwater quality sampling network; isotopic analysis; monitoring during dewatering"
    },
    {
      id: "U012",
      element: "Harwich Formation — Ash Layer Mechanical Properties",
      confidence: "LOW",
      impact: "MEDIUM",
      resolution: "High-quality rotary coring; XRD mineralogy; direct shear testing of ash horizons"
    }
  ]

};
