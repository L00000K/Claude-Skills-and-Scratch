/**
 * SWEETProcessor — Geological conceptual model text processor.
 * Matches site description text against geological conditions and SWEET
 * ontology concepts. Exposes window.SWEETProcessor.
 *
 * Depends on:
 *   window.SWEET_CONCEPTS  — ontology concept array (loaded before this file)
 *   window.SZC_DATA        — site data object (optional; extends CONDITIONS)
 */
window.SWEETProcessor = (function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Stop words                                                           */
  /* ------------------------------------------------------------------ */
  const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
    'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are',
    'were', 'be', 'been', 'have', 'has', 'had', 'do', 'did', 'does',
    'not', 'that', 'this', 'it', 'its', 'he', 'she', 'they', 'we',
    'you', 'i', 'me', 'so', 'if', 'then', 'up', 'down', 'out', 'no',
    'well', 'about', 'into', 'over'
  ]);

  /* ------------------------------------------------------------------ */
  /* Hardcoded conditions list (20 geological conditions)                 */
  /* ------------------------------------------------------------------ */
  const BASE_CONDITIONS = [
    {
      id: 'STR-001', category: 'Stratigraphy',
      name: 'Made ground / engineered fill',
      keywords: ['fill', 'made ground', 'imported', 'placed material']
    },
    {
      id: 'STR-002', category: 'Stratigraphy',
      name: 'Alluvium / soft clay',
      keywords: ['alluvium', 'alluvial', 'soft clay', 'clay']
    },
    {
      id: 'STR-003', category: 'Stratigraphy',
      name: 'Peat / organic deposits',
      keywords: ['peat', 'organic', 'bog', 'fen', 'marsh', 'mire']
    },
    {
      id: 'STR-004', category: 'Stratigraphy',
      name: 'Glacial till / boulder clay',
      keywords: ['till', 'boulder clay', 'glacial', 'moraine', 'drift']
    },
    {
      id: 'STR-005', category: 'Stratigraphy',
      name: 'Fluvial sand and gravel',
      keywords: ['sand', 'gravel', 'fluvial', 'river terrace', 'alluvial fan']
    },
    {
      id: 'STR-006', category: 'Stratigraphy',
      name: 'Chalk bedrock',
      keywords: ['chalk', 'cretaceous', 'white chalk', 'flint']
    },
    {
      id: 'STR-007', category: 'Stratigraphy',
      name: 'Limestone bedrock',
      keywords: ['limestone', 'carbonate', 'karstic', 'karst', 'dolomite']
    },
    {
      id: 'STR-008', category: 'Stratigraphy',
      name: 'Sandstone bedrock',
      keywords: ['sandstone', 'arenite', 'red beds', 'triassic', 'permian']
    },
    {
      id: 'HYD-001', category: 'Hydrogeology',
      name: 'Principal aquifer',
      keywords: ['aquifer', 'principal aquifer', 'major aquifer', 'groundwater', 'water table']
    },
    {
      id: 'HYD-002', category: 'Hydrogeology',
      name: 'Secondary aquifer',
      keywords: ['secondary aquifer', 'minor aquifer', 'superficial aquifer', 'perched water']
    },
    {
      id: 'HYD-003', category: 'Hydrogeology',
      name: 'Low-permeability / aquitard',
      keywords: ['aquitard', 'aquiclude', 'impermeable', 'low permeability', 'confining layer']
    },
    {
      id: 'HYD-004', category: 'Hydrogeology',
      name: 'Surface water feature',
      keywords: ['river', 'stream', 'lake', 'pond', 'watercourse', 'ditch', 'culvert']
    },
    {
      id: 'GEO-001', category: 'Geotechnics',
      name: 'Settlement risk — soft ground',
      keywords: ['settlement', 'consolidation', 'compression', 'soft ground', 'compressible']
    },
    {
      id: 'GEO-002', category: 'Geotechnics',
      name: 'Slope instability',
      keywords: ['landslide', 'slope failure', 'instability', 'slip', 'mass movement', 'embankment']
    },
    {
      id: 'GEO-003', category: 'Geotechnics',
      name: 'Shrink-swell clay',
      keywords: ['shrink swell', 'shrinkage', 'swelling', 'expansive clay', 'desiccation', 'montmorillonite']
    },
    {
      id: 'GEO-004', category: 'Geotechnics',
      name: 'Mining / tunnelling legacy',
      keywords: ['mining', 'mine', 'tunnel', 'shaft', 'adit', 'void', 'subsidence', 'colliery']
    },
    {
      id: 'CON-001', category: 'Contamination',
      name: 'Industrial / brownfield contamination',
      keywords: ['contamination', 'contaminant', 'brownfield', 'industrial', 'pollution', 'remediation']
    },
    {
      id: 'CON-002', category: 'Contamination',
      name: 'Landfill / waste deposit',
      keywords: ['landfill', 'waste', 'tip', 'dump', 'refuse', 'leachate', 'gas migration']
    },
    {
      id: 'SWA-001', category: 'Seismicity',
      name: 'Seismic hazard',
      keywords: ['seismic', 'earthquake', 'fault', 'liquefaction', 'ground motion', 'tremor']
    },
    {
      id: 'SWA-002', category: 'Seismicity',
      name: 'Radon / natural ground gas',
      keywords: ['radon', 'methane', 'ground gas', 'natural gas', 'carbon dioxide', 'co2']
    }
  ];

  /* ------------------------------------------------------------------ */
  /* Runtime state                                                        */
  /* ------------------------------------------------------------------ */
  let CONDITIONS = [];
  let kwIndex = new Map();   // keyword string → array of SWEET_CONCEPTS indices
  let _initialised = false;

  /* ------------------------------------------------------------------ */
  /* Levenshtein distance (inline, strings ≤ 20 chars only)              */
  /* ------------------------------------------------------------------ */
  function levenshtein(a, b) {
    if (Math.abs(a.length - b.length) > 3) return 99;
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }

  /* ------------------------------------------------------------------ */
  /* Tokenise                                                             */
  /* ------------------------------------------------------------------ */
  function tokenise(text) {
    const words = (text.toLowerCase().match(/[a-z]+/g) || []);
    const unigrams = words.filter(w => !STOP_WORDS.has(w));

    const bigrams = [];
    for (let i = 0; i < words.length - 1; i++) {
      const a = words[i], b = words[i + 1];
      if (!STOP_WORDS.has(a) || !STOP_WORDS.has(b)) {
        bigrams.push(a + ' ' + b);
      }
    }

    return [...unigrams, ...bigrams];
  }

  /* ------------------------------------------------------------------ */
  /* Build keyword index from SWEET_CONCEPTS                              */
  /* ------------------------------------------------------------------ */
  function buildKwIndex() {
    kwIndex = new Map();
    const concepts = window.SWEET_CONCEPTS || [];
    concepts.forEach(function (c, i) {
      const kws = c.keywords || [];
      kws.forEach(function (kw) {
        const key = kw.toLowerCase();
        if (!kwIndex.has(key)) kwIndex.set(key, []);
        kwIndex.get(key).push(i);
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Build combined CONDITIONS list                                       */
  /* ------------------------------------------------------------------ */
  function buildConditions() {
    CONDITIONS = BASE_CONDITIONS.slice();
    try {
      const extra = window.SZC_DATA && window.SZC_DATA.conditions;
      if (Array.isArray(extra)) {
        extra.forEach(function (c) {
          const exists = CONDITIONS.some(function (bc) { return bc.id === c.id; });
          if (!exists) CONDITIONS.push(c);
        });
      }
    } catch (e) {
      // SZC_DATA not available or malformed — ignore
    }
  }

  /* ------------------------------------------------------------------ */
  /* Initialise (called once)                                             */
  /* ------------------------------------------------------------------ */
  function init() {
    if (_initialised) return;
    buildConditions();
    buildKwIndex();
    _initialised = true;
  }

  /* ------------------------------------------------------------------ */
  /* scoreConceptTokens — match tokens against SWEET_CONCEPTS             */
  /* Returns Map: concept index → raw score                              */
  /* ------------------------------------------------------------------ */
  function scoreConceptTokens(tokens) {
    const concepts = window.SWEET_CONCEPTS || [];
    const rawScores = new Map();   // concept index → { base, freq }
    const kwKeys = Array.from(kwIndex.keys());

    tokens.forEach(function (token) {
      // --- Exact lookup ---
      if (kwIndex.has(token)) {
        kwIndex.get(token).forEach(function (ci) {
          const entry = rawScores.get(ci) || { base: 0, freq: 0 };
          if (entry.base === 0) {
            entry.base += 10;
          } else {
            entry.freq = Math.min(entry.freq + 2, 10);
          }
          rawScores.set(ci, entry);
        });
      }

      // --- Fuzzy lookup (tokens ≥ 5 chars, unigrams only) ---
      if (token.length >= 5 && !token.includes(' ')) {
        kwKeys.forEach(function (kw) {
          if (kw.length > 20 || token.length > 20) return;
          const dist = levenshtein(token, kw);
          if (dist <= 2 && dist > 0) {
            kwIndex.get(kw).forEach(function (ci) {
              // Only add fuzzy score if not already exact-matched for this concept
              if (!rawScores.has(ci)) {
                rawScores.set(ci, { base: 0, freq: 0 });
              }
              const entry = rawScores.get(ci);
              entry.base += 5;
              rawScores.set(ci, entry);
            });
          }
        });
      }
    });

    // Depth bonus + final score computation
    const scored = [];
    rawScores.forEach(function (entry, ci) {
      const concept = concepts[ci];
      if (!concept) return;
      let score = entry.base + entry.freq;
      const depth = concept.depth || 1;
      if (depth === 2) score += 2;
      else if (depth >= 3) score += 3;
      if (score >= 3) {
        scored.push({ ci, score });
      }
    });

    // Normalise to 0–100
    if (scored.length === 0) return new Map();
    const maxRaw = Math.max(...scored.map(function (s) { return s.score; }));
    const norm = maxRaw * 1.2;
    const result = new Map();
    scored.forEach(function (s) {
      result.set(s.ci, Math.floor((s.score / norm) * 100));
    });
    return result;
  }

  /* ------------------------------------------------------------------ */
  /* Build matchedSweetConcepts array                                     */
  /* ------------------------------------------------------------------ */
  function buildMatchedSweetConcepts(conceptScoreMap, tokens) {
    const concepts = window.SWEET_CONCEPTS || [];
    const matched = [];

    conceptScoreMap.forEach(function (score, ci) {
      const c = concepts[ci];
      if (!c) return;

      // Which of this concept's keywords appeared in tokens?
      const cKws = (c.keywords || []).map(function (k) { return k.toLowerCase(); });
      const matchedKws = cKws.filter(function (kw) {
        return tokens.some(function (t) { return t === kw; });
      });

      matched.push({
        label: c.label || c.name || '',
        uri: c.uri || '',
        module: c.module || '',
        category: c.category || '',
        score: score,
        depth: c.depth || 1,
        parentLabel: c.parentLabel || c.parent || '',
        matchedKeywords: matchedKws
      });
    });

    // Sort descending by score
    matched.sort(function (a, b) { return b.score - a.score; });
    return matched;
  }

  /* ------------------------------------------------------------------ */
  /* scoreConditions                                                      */
  /* ------------------------------------------------------------------ */
  function scoreConditions(tokens, sweetCategoryScores) {
    const tokenSet = new Set(tokens);
    const raw = [];

    CONDITIONS.forEach(function (cond) {
      let score = 0;
      const matchedKws = [];

      cond.keywords.forEach(function (kw) {
        const kwLower = kw.toLowerCase();
        // Check direct token set membership (handles bigrams too)
        if (tokenSet.has(kwLower)) {
          score += 10;
          matchedKws.push(kw);
        } else {
          // Check if any token contains this keyword (for multi-word keywords as substrings)
          const found = tokens.some(function (t) { return t === kwLower; });
          if (found) {
            score += 10;
            matchedKws.push(kw);
          }
        }
      });

      // Category bonus from SWEET
      const catScore = sweetCategoryScores[cond.category];
      if (typeof catScore === 'number' && catScore > 30) {
        score += 5;
      }

      if (score >= 5) {
        raw.push({ cond, score, matchedKws });
      }
    });

    if (raw.length === 0) return [];

    // Normalise
    const maxRaw = Math.max(...raw.map(function (r) { return r.score; }));
    const norm = maxRaw * 1.2;

    return raw.map(function (r) {
      return {
        conditionId: r.cond.id,
        conditionName: r.cond.name,
        category: r.cond.category,
        score: Math.floor((r.score / norm) * 100),
        matchedKeywords: r.matchedKws,
        sweetConcepts: []   // filled later by buildSweetLinks
      };
    }).sort(function (a, b) { return b.score - a.score; });
  }

  /* ------------------------------------------------------------------ */
  /* buildSweetLinks — attach SWEET concepts to conditions                */
  /* ------------------------------------------------------------------ */
  function buildSweetLinks(conditionResults, sweetConcepts) {
    conditionResults.forEach(function (cr) {
      const linked = [];
      sweetConcepts.forEach(function (sc) {
        if (sc.category !== cr.category) return;
        // Check for shared keyword
        const shared = sc.matchedKeywords.some(function (kw) {
          return cr.matchedKeywords.some(function (ck) {
            return ck.toLowerCase() === kw.toLowerCase();
          });
        });
        if (shared) {
          linked.push({
            label: sc.label,
            uri: sc.uri,
            module: sc.module,
            score: sc.score
          });
        }
      });
      cr.sweetConcepts = linked;
    });
  }

  /* ------------------------------------------------------------------ */
  /* categoryScores — per-category aggregate                              */
  /* ------------------------------------------------------------------ */
  function buildCategoryScores(conditionResults) {
    const raw = {};
    conditionResults.forEach(function (cr) {
      raw[cr.category] = (raw[cr.category] || 0) + cr.score;
    });

    const vals = Object.values(raw);
    if (vals.length === 0) return {};
    const maxVal = Math.max(...vals);
    const norm = maxVal * 1.2 || 1;
    const out = {};
    Object.keys(raw).forEach(function (cat) {
      out[cat] = Math.floor((raw[cat] / norm) * 100);
    });
    return out;
  }

  /* ------------------------------------------------------------------ */
  /* sweetCategoryScores — built from matchedSweetConcepts               */
  /* ------------------------------------------------------------------ */
  function buildSweetCategoryScores(sweetConcepts) {
    const raw = {};
    sweetConcepts.forEach(function (sc) {
      if (sc.category) {
        raw[sc.category] = Math.max(raw[sc.category] || 0, sc.score);
      }
    });
    return raw;
  }

  /* ------------------------------------------------------------------ */
  /* process(text) — main entry point                                     */
  /* ------------------------------------------------------------------ */
  function process(text) {
    init();

    if (!text || typeof text !== 'string') {
      text = '';
    }

    // Input summary
    const inputSummary = text.length > 120 ? text.slice(0, 120) + '...' : text;

    // Tokenise
    const tokens = tokenise(text);
    const tokenCount = tokens.filter(function (t) { return !t.includes(' '); }).length;

    // Score SWEET concepts
    const conceptScoreMap = scoreConceptTokens(tokens);
    const matchedSweetConcepts = buildMatchedSweetConcepts(conceptScoreMap, tokens);

    // SWEET category scores (used for condition scoring bonus)
    const sweetCategoryScores = buildSweetCategoryScores(matchedSweetConcepts);

    // Score conditions
    const matchedConditions = scoreConditions(tokens, sweetCategoryScores);

    // Attach SWEET links to conditions
    buildSweetLinks(matchedConditions, matchedSweetConcepts);

    // Final category scores (from condition results)
    const categoryScores = buildCategoryScores(matchedConditions);

    return {
      inputSummary: inputSummary,
      tokenCount: tokenCount,
      matchedConditions: matchedConditions,
      matchedSweetConcepts: matchedSweetConcepts,
      categoryScores: categoryScores
    };
  }

  /* ------------------------------------------------------------------ */
  /* Public API                                                           */
  /* ------------------------------------------------------------------ */
  return { process: process };

})();
