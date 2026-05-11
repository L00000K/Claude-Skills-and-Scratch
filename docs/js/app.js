/* Site X Geological Conceptual Model — Application Logic
   Pure vanilla JS, no dependencies, no fetch(), GitHub Pages compatible
*/

(function () {
  'use strict';

  const D = window.SZC_DATA;

  // ── STATE ──────────────────────────────────────────────────────────────────
  const state = {
    activeSection: 'overview',
    hazardFilter: 'ALL',
    hazardSort: { col: 'status', dir: 'asc' },
    conditionSearch: '',
    conditionCategory: 'All',
    selectedStratUnit: null,
    sidebarOpen: false,
    mindMapData: null,
    siteInputText: '',
  };

  // ── BOOT ───────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    buildNav();
    buildOverview();
    buildStratigraphy();
    buildHydro();
    buildHazards();
    buildConditions();
    buildRecommendations();
    buildUncertainties();
    buildSiteInput();
    buildMindMap();
    activateSection('overview');
    initMobileMenu();
  });

  // ── NAVIGATION ────────────────────────────────────────────────────────────
  const navItems = [
    { id: 'overview',     icon: '🌍', label: 'Overview',           count: null },
    { id: 'stratigraphy', icon: '📐', label: 'Stratigraphic Column', count: D.stratigraphy.length },
    { id: 'hydro',        icon: '💧', label: 'Hydrogeology',        count: D.hydroUnits.length },
    { id: 'hazards',      icon: '⚠️',  label: 'Geohazard Screening', count: D.hazards.length },
    { id: 'conditions',   icon: '🗂️',  label: 'Conditions Database', count: D.conditions.length },
    { id: 'recommendations', icon: '🔬', label: 'GI Recommendations', count: D.recommendations.length },
    { id: 'uncertainties', icon: '❓', label: 'Uncertainty Register', count: D.uncertainties.length },
    { id: 'siteinput', icon: '📝', label: 'Site Input',  count: null },
    { id: 'mindmap',   icon: '🗺️',  label: 'Mind Map',   count: null },
  ];

  function buildNav() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.innerHTML = '<div class="nav-section-label">Navigation</div>';

    navItems.forEach(item => {
      const el = document.createElement('div');
      el.className = 'nav-item';
      el.dataset.section = item.id;
      el.innerHTML = `
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
        ${item.count !== null ? `<span class="nav-count">${item.count}</span>` : ''}
      `;
      el.addEventListener('click', () => {
        activateSection(item.id);
        if (state.sidebarOpen) closeSidebar();
      });
      sidebar.appendChild(el);
    });
  }

  function activateSection(id) {
    state.activeSection = id;

    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.section === id);
    });

    document.querySelectorAll('.section').forEach(el => {
      el.classList.toggle('active', el.id === `section-${id}`);
    });
  }

  // ── MOBILE MENU ────────────────────────────────────────────────────────────
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.sidebar-overlay');

    hamburger.addEventListener('click', () => {
      state.sidebarOpen = !state.sidebarOpen;
      hamburger.classList.toggle('open', state.sidebarOpen);
      document.querySelector('.sidebar').classList.toggle('open', state.sidebarOpen);
      overlay.classList.toggle('open', state.sidebarOpen);
    });

    overlay.addEventListener('click', closeSidebar);
  }

  function closeSidebar() {
    state.sidebarOpen = false;
    document.querySelector('.hamburger').classList.remove('open');
    document.querySelector('.sidebar').classList.remove('open');
    document.querySelector('.sidebar-overlay').classList.remove('open');
  }

  // ── OVERVIEW ──────────────────────────────────────────────────────────────
  function buildOverview() {
    const sec = document.getElementById('section-overview');

    const confCounts = countConfidence(D.stratigraphy);
    const hazardCounts = {
      present: D.hazards.filter(h => h.status === 'PRESENT').length,
      possible: D.hazards.filter(h => h.status === 'POSSIBLE').length,
      absent: D.hazards.filter(h => h.status === 'ABSENT').length,
    };
    const criticalRecs = D.recommendations.filter(r => r.priority === 'CRITICAL').length;

    sec.innerHTML = `
      <div class="section-header">
        <h1>Geological Conceptual Model</h1>
        <p>Site X &nbsp;|&nbsp; Fookes Model Framework</p>
      </div>

      <div class="overview-grid mb-24">
        <div class="site-info-card">
          <div class="site-name">${D.site.name}</div>
          <div class="site-location">📍 ${D.site.location}</div>
          <div class="site-info-row"><span class="label">Coordinates</span><span class="value">${D.site.coordinates.lat}°N, ${D.site.coordinates.lon}°E</span></div>
          <div class="site-info-row"><span class="label">Grid Ref</span><span class="value font-mono">${D.site.gridRef}</span></div>
          <div class="site-info-row"><span class="label">Stratigraphy</span><span class="value">Holocene – Late Cretaceous</span></div>
          <div class="site-info-row"><span class="label">Client</span><span class="value">${D.site.client}</span></div>
          <div class="site-info-row"><span class="label">Revision</span><span class="value">${D.site.revision}</span></div>
        </div>

        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="stage-badge">
            <div class="stage-label">Fookes Model Stage</div>
            <div class="stage-name">${D.site.stage}</div>
            <div class="stage-ref">Fookes (1997) &bull; Fookes et al. (2000, 2015)</div>
          </div>

          <div class="card" style="flex:1;">
            <div class="card-header"><h3>Confidence Distribution</h3></div>
            <div class="chart-container">
              <canvas id="confidence-chart" width="120" height="120"></canvas>
              <div class="chart-legend">
                <div class="legend-item"><div class="legend-dot" style="background:#2ecc71"></div><span class="legend-label">High</span><span class="legend-count">${confCounts.HIGH}</span></div>
                <div class="legend-item"><div class="legend-dot" style="background:#f39c12"></div><span class="legend-label">Medium</span><span class="legend-count">${confCounts.MEDIUM}</span></div>
                <div class="legend-item"><div class="legend-dot" style="background:#e74c3c"></div><span class="legend-label">Low</span><span class="legend-count">${confCounts.LOW || 0}</span></div>
                <div class="legend-item"><div class="legend-dot" style="background:#95a5a6"></div><span class="legend-label">Unknown</span><span class="legend-count">${confCounts.UNKNOWN || 0}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-grid mb-24">
        <div class="stat-card"><div class="stat-value">${D.stratigraphy.length}</div><div class="stat-label">Stratigraphic Units</div></div>
        <div class="stat-card"><div class="stat-value">${D.hazards.length}</div><div class="stat-label">Hazards Screened</div></div>
        <div class="stat-card"><div class="stat-value">${D.conditions.length}</div><div class="stat-label">Conditions Catalogued</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--present)">${hazardCounts.present}</div><div class="stat-label">Hazards Present</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--possible)">${hazardCounts.possible}</div><div class="stat-label">Hazards Possible</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--absent)">${criticalRecs}</div><div class="stat-label">Critical GI Actions</div></div>
      </div>

      <div class="description-card mb-20">
        <h3 style="margin-bottom:12px;">Site Description</h3>
        <p>${D.site.description}</p>
      </div>

      <div class="references-card">
        <h3 style="margin-bottom:12px;">Key References</h3>
        <div style="margin-bottom:12px;">
          ${['Fookes 1997', 'Fookes et al. 2000', 'Fookes et al. 2015', 'BGS 2023', 'EA SMP2'].map(r => `<span class="ref-tag">${r}</span>`).join('')}
        </div>
        <ol>
          ${D.site.references.map(r => `<li>${r}</li>`).join('')}
        </ol>
      </div>
    `;

    // Draw donut chart after DOM is ready
    requestAnimationFrame(() => drawDonutChart(confCounts));
  }

  function countConfidence(arr) {
    const c = { HIGH: 0, MEDIUM: 0, LOW: 0, UNKNOWN: 0 };
    arr.forEach(u => { c[u.confidence] = (c[u.confidence] || 0) + 1; });
    return c;
  }

  function drawDonutChart(counts) {
    const canvas = document.getElementById('confidence-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total === 0) return;

    const data = [
      { value: counts.HIGH || 0,    color: '#2ecc71' },
      { value: counts.MEDIUM || 0,  color: '#f39c12' },
      { value: counts.LOW || 0,     color: '#e74c3c' },
      { value: counts.UNKNOWN || 0, color: '#95a5a6' },
    ].filter(d => d.value > 0);

    const cx = 60, cy = 60, r = 48, inner = 28;
    let startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, 120, 120);

    data.forEach(d => {
      const slice = (d.value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      startAngle += slice;
    });

    // Cut out centre
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, 2 * Math.PI);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#242840';
    ctx.fill();

    // Centre label
    ctx.fillStyle = '#e8eaf0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 18px Inter, system-ui, sans-serif';
    ctx.fillText(total, cx, cy - 6);
    ctx.font = '9px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#a0a8c0';
    ctx.fillText('UNITS', cx, cy + 8);
  }

  // ── STRATIGRAPHY ──────────────────────────────────────────────────────────
  function buildStratigraphy() {
    const sec = document.getElementById('section-stratigraphy');

    sec.innerHTML = `
      <div class="section-header">
        <h1>Stratigraphic Column</h1>
        <p>Visual borehole log — click a unit to view details &nbsp;|&nbsp; Top to Base: Holocene to Late Cretaceous</p>
      </div>

      <div class="strat-layout">
        <div class="strat-column-container">
          <div class="strat-column-wrapper">
            <div class="strat-column-header">
              <span>Depth / Unit</span>
              <span>Conf.</span>
            </div>
            <div class="strat-column" id="strat-col"></div>
          </div>
        </div>
        <div id="strat-detail" class="strat-detail-panel">
          <div class="strat-detail-empty">
            <div class="hint-icon">🖱️</div>
            <p>Click a stratigraphic unit<br>to view detailed information</p>
          </div>
        </div>
      </div>
    `;

    const col = document.getElementById('strat-col');
    let cumulativeDepth = 0;

    // Calculate total for proportional heights
    const totalThickness = D.stratigraphy.reduce((s, u) => s + u.typicalThickness, 0);

    D.stratigraphy.forEach((unit, idx) => {
      const heightPx = Math.max(40, Math.round((unit.typicalThickness / totalThickness) * 480));
      const confColour = { HIGH: '#2ecc71', MEDIUM: '#f39c12', LOW: '#e74c3c', UNKNOWN: '#95a5a6' }[unit.confidence] || '#95a5a6';

      const el = document.createElement('div');
      el.className = `strat-unit${unit.pattern === 'hatched' ? ' hatched' : ''}`;
      el.dataset.idx = idx;
      el.style.backgroundColor = unit.colour;
      el.style.minHeight = `${heightPx}px`;

      el.innerHTML = `
        <div class="strat-depth-label">${cumulativeDepth}m</div>
        <div class="strat-unit-bar">
          <div class="strat-unit-name">${unit.name}</div>
          <div class="strat-unit-age">${unit.age.split(' ')[0]}</div>
        </div>
        <div class="strat-unit-badge">
          <div class="strat-conf-dot" style="background:${confColour}" title="${unit.confidence} confidence"></div>
        </div>
      `;

      el.addEventListener('click', () => selectStratUnit(idx));
      col.appendChild(el);

      cumulativeDepth += unit.typicalThickness;
    });

    // Add base depth label
    const baseEl = document.createElement('div');
    baseEl.style.padding = '4px 8px 8px 8px';
    baseEl.style.fontSize = '9px';
    baseEl.style.color = 'rgba(255,255,255,0.4)';
    baseEl.style.fontFamily = 'monospace';
    baseEl.textContent = `${cumulativeDepth}m+`;
    col.appendChild(baseEl);
  }

  function selectStratUnit(idx) {
    const unit = D.stratigraphy[idx];
    state.selectedStratUnit = idx;

    document.querySelectorAll('.strat-unit').forEach((el, i) => {
      el.classList.toggle('selected', i === idx);
    });

    const detail = document.getElementById('strat-detail');
    const confColour = { HIGH: '#2ecc71', MEDIUM: '#f39c12', LOW: '#e74c3c', UNKNOWN: '#95a5a6' }[unit.confidence];
    const confClass = { HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low', UNKNOWN: 'badge-unknown' }[unit.confidence];

    detail.innerHTML = `
      <div class="strat-detail-content">
        <div class="strat-detail-title">
          <div>
            <h2>
              <span class="lithology-swatch" style="background:${unit.colour}"></span>
              ${unit.name}
            </h2>
            <div class="age">${unit.age}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
            <span class="id-badge">${unit.id}</span>
            <span class="badge ${confClass}">${unit.confidence}</span>
          </div>
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <div class="d-label">Thickness Range</div>
            <div class="d-value">${unit.thicknessRange}</div>
          </div>
          <div class="detail-item">
            <div class="d-label">Typical Thickness</div>
            <div class="d-value">${unit.typicalThickness} m</div>
          </div>
          <div class="detail-item">
            <div class="d-label">Depth to Top</div>
            <div class="d-value">${unit.depthToTop}</div>
          </div>
          <div class="detail-item">
            <div class="d-label">Depth Range</div>
            <div class="d-value">${unit.depthRange}</div>
          </div>
        </div>

        <div class="detail-full">
          <div class="d-label">Lithology</div>
          <div class="d-value">${unit.lithology}</div>
        </div>

        <div class="detail-full">
          <div class="d-label">Engineering Significance</div>
          <div class="d-value">${unit.engineeringSignificance}</div>
        </div>

        <div class="detail-full">
          <div class="d-label">Investigation Methods</div>
          <div class="investigation-tags">
            ${unit.investigation.map(m => `<span class="inv-tag">${m}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ── HYDROGEOLOGY ──────────────────────────────────────────────────────────
  function buildHydro() {
    const sec = document.getElementById('section-hydro');

    const schematicLayers = [
      { label: 'Beach/Crag Deposits', depth: '0–30 m', type: 'aquifer', name: 'Crag Aquifer (Unconfined)' },
      { label: 'London Clay', depth: '25–65 m', type: 'aquitard', name: 'Major Aquitard' },
      { label: 'Harwich / Lambeth Sands', depth: '45–90 m', type: 'semi', name: 'Semi-Confined Aquifer' },
      { label: 'Lambeth Clay', depth: '60–90 m', type: 'aquitard', name: 'Lower Aquitard' },
      { label: 'Chalk Group', depth: '75–400 m', type: 'aquifer', name: 'Confined Chalk Aquifer' },
    ];

    sec.innerHTML = `
      <div class="section-header">
        <h1>Hydrogeological Model</h1>
        <p>Aquifer units, hydraulic properties, and groundwater conditions at Site X</p>
      </div>

      <div class="hydro-schematic mb-24">
        <h3>Schematic Cross-Section — Aquifer / Aquitard Stacking</h3>
        <div class="gwl-indicator">
          <span style="font-size:12px;color:#4a9eff;">▼ GWL ~+0.5 to +2.0 mAOD</span>
          <div class="gwl-line"></div>
          <span style="font-size:11px;color:var(--text-muted);">Tidal influence up to 200 m offshore</span>
        </div>
        <div class="schematic-layers" style="margin-top:16px;">
          ${schematicLayers.map(l => `
            <div class="schematic-layer layer-${l.type}">
              <span class="layer-depth">${l.depth}</span>
              <span class="layer-name"><strong>${l.name}</strong> — ${l.label}</span>
              <span class="layer-type-badge">
                <span class="badge badge-${l.type === 'semi' ? 'semi-confined' : l.type}">${l.type === 'semi' ? 'SEMI-CONFINED' : l.type.toUpperCase()}</span>
              </span>
            </div>
          `).join('')}
        </div>
      </div>

      <h2 class="mb-12">Hydrogeological Units</h2>
      <div class="hydro-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Formation</th>
              <th>GWL (mAOD)</th>
              <th>Permeability</th>
              <th>Confidence</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${D.hydroUnits.map(u => {
              const typeBadge = { aquifer: 'badge-aquifer', aquitard: 'badge-aquitard', 'semi-confined': 'badge-semi-confined' }[u.type] || 'badge-primary';
              const confClass = { HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low' }[u.confidence] || 'badge-unknown';
              return `
              <tr>
                <td class="font-mono" style="font-size:11px;color:var(--text-muted);">${u.id}</td>
                <td style="font-weight:600;">${u.name}</td>
                <td><span class="badge ${typeBadge}">${u.type}</span></td>
                <td style="font-size:12px;">${u.formation}</td>
                <td class="td-muted">${u.gwlMAOD}</td>
                <td class="td-muted" style="white-space:nowrap;">${u.permeability}</td>
                <td><span class="badge ${confClass}">${u.confidence}</span></td>
                <td class="td-notes">${u.notes}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="card" style="margin-top:24px;">
        <div class="card-header"><h3>Hydrogeological Characteristics</h3></div>
        ${D.hydroUnits.map(u => `
          <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span style="font-weight:700;">${u.name}</span>
              <span class="badge ${{'aquifer':'badge-aquifer','aquitard':'badge-aquitard','semi-confined':'badge-semi-confined'}[u.type]}">${u.type}</span>
            </div>
            <p style="font-size:13px;color:var(--text-dim);line-height:1.6;">${u.characteristics}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ── HAZARDS ───────────────────────────────────────────────────────────────
  function buildHazards() {
    const sec = document.getElementById('section-hazards');

    sec.innerHTML = `
      <div class="section-header">
        <h1>Geohazard Screening</h1>
        <p>All hazards screened against the site conditions following the Fookes model framework</p>
      </div>

      <div class="filter-bar">
        <button class="filter-btn active-all" data-filter="ALL">ALL</button>
        <button class="filter-btn" data-filter="PRESENT">PRESENT</button>
        <button class="filter-btn" data-filter="POSSIBLE">POSSIBLE</button>
        <button class="filter-btn" data-filter="ABSENT">ABSENT</button>
        <button class="filter-btn" data-filter="UNKNOWN">UNKNOWN</button>
        <span class="filter-count" id="hazard-count"></span>
      </div>

      <div class="hazard-table-wrapper">
        <table id="hazard-table">
          <thead>
            <tr>
              <th>Status</th>
              <th class="sort-header" data-sort="name">Condition Name <span class="sort-arrow">↕</span></th>
              <th class="sort-header" data-sort="category">Category <span class="sort-arrow">↕</span></th>
              <th>Confidence</th>
              <th>Rationale</th>
              <th title="Investigation Required">GI</th>
            </tr>
          </thead>
          <tbody id="hazard-tbody"></tbody>
        </table>
      </div>
    `;

    renderHazardTable();

    // Filter buttons
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.hazardFilter = btn.dataset.filter;
        document.querySelectorAll('.filter-btn[data-filter]').forEach(b => {
          const f = b.dataset.filter.toLowerCase();
          const isActive = b.dataset.filter === state.hazardFilter;
          b.className = 'filter-btn';
          if (isActive) b.classList.add(`active-${f}`);
        });
        renderHazardTable();
      });
    });

    // Sort headers
    document.querySelectorAll('.sort-header[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        if (state.hazardSort.col === th.dataset.sort) {
          state.hazardSort.dir = state.hazardSort.dir === 'asc' ? 'desc' : 'asc';
        } else {
          state.hazardSort.col = th.dataset.sort;
          state.hazardSort.dir = 'asc';
        }
        renderHazardTable();
      });
    });
  }

  function renderHazardTable() {
    let hazards = [...D.hazards];

    if (state.hazardFilter !== 'ALL') {
      hazards = hazards.filter(h => h.status === state.hazardFilter);
    }

    const statusOrder = { PRESENT: 0, POSSIBLE: 1, ABSENT: 2, UNKNOWN: 3 };
    hazards.sort((a, b) => {
      let av, bv;
      if (state.hazardSort.col === 'status') {
        av = statusOrder[a.status]; bv = statusOrder[b.status];
      } else if (state.hazardSort.col === 'name') {
        av = a.name; bv = b.name;
      } else if (state.hazardSort.col === 'category') {
        av = a.category; bv = b.category;
      }
      if (av < bv) return state.hazardSort.dir === 'asc' ? -1 : 1;
      if (av > bv) return state.hazardSort.dir === 'asc' ? 1 : -1;
      return 0;
    });

    const tbody = document.getElementById('hazard-tbody');
    const countEl = document.getElementById('hazard-count');
    if (countEl) countEl.textContent = `Showing ${hazards.length} of ${D.hazards.length}`;

    if (!tbody) return;

    tbody.innerHTML = hazards.map(h => {
      const statusMap = {
        PRESENT: 'badge-present',
        POSSIBLE: 'badge-possible',
        ABSENT: 'badge-absent',
        UNKNOWN: 'badge-unknown'
      };
      const rowClass = `hazard-row-${h.status.toLowerCase()}`;
      const confClass = { HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low', UNKNOWN: 'badge-unknown' }[h.confidence] || 'badge-unknown';
      const nameClass = h.status === 'ABSENT' ? 'hazard-name' : '';

      return `
        <tr class="${rowClass}">
          <td><span class="badge ${statusMap[h.status]}">${h.status}</span></td>
          <td class="${nameClass}" style="font-weight:600;font-size:13px;">${h.name}</td>
          <td style="font-size:12px;color:var(--text-dim);">${h.category}</td>
          <td><span class="badge ${confClass}">${h.confidence}</span></td>
          <td style="font-size:12px;color:var(--text-dim);max-width:320px;line-height:1.5;">${h.rationale}</td>
          <td style="text-align:center;">
            ${h.investigationRequired ? `<span class="warn-icon" title="${h.investigationNote}">⚠️</span>` : '<span style="color:var(--text-muted);font-size:11px;">—</span>'}
          </td>
        </tr>
      `;
    }).join('');
  }

  // ── CONDITIONS DATABASE ───────────────────────────────────────────────────
  function buildConditions() {
    const sec = document.getElementById('section-conditions');
    const categories = ['All', ...new Set(D.conditions.map(c => c.category))];

    sec.innerHTML = `
      <div class="section-header">
        <h1>Conditions Database</h1>
        <p>${D.conditions.length} conditions catalogued — searchable, filterable reference for the geological model</p>
      </div>

      <div class="search-filter-bar">
        <input type="text" class="search-box" id="cond-search" placeholder="Search conditions by name or description…" value="${state.conditionSearch}">
      </div>

      <div class="category-pills" id="cat-pills">
        ${categories.map(cat => `
          <span class="cat-pill${cat === state.conditionCategory ? ' active' : ''}" data-cat="${cat}">${cat}${cat !== 'All' ? ` <span style="opacity:0.6;">(${D.conditions.filter(c=>c.category===cat).length})</span>` : ''}</span>
        `).join('')}
      </div>

      <div class="conditions-grid" id="cond-grid"></div>
    `;

    renderConditionsGrid();

    document.getElementById('cond-search').addEventListener('input', e => {
      state.conditionSearch = e.target.value;
      renderConditionsGrid();
    });

    document.getElementById('cat-pills').addEventListener('click', e => {
      const pill = e.target.closest('.cat-pill');
      if (!pill) return;
      state.conditionCategory = pill.dataset.cat;
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.toggle('active', p.dataset.cat === state.conditionCategory));
      renderConditionsGrid();
    });
  }

  function renderConditionsGrid() {
    const grid = document.getElementById('cond-grid');
    if (!grid) return;

    const search = state.conditionSearch.toLowerCase();
    let filtered = D.conditions;

    if (state.conditionCategory !== 'All') {
      filtered = filtered.filter(c => c.category === state.conditionCategory);
    }

    if (search) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.significance.toLowerCase().includes(search) ||
        c.subcategory.toLowerCase().includes(search)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="no-results">No conditions match your search.</div>';
      return;
    }

    grid.innerHTML = filtered.map(c => `
      <div class="condition-card" data-id="${c.id}">
        <div class="cond-card-header">
          <span class="cond-id-badge">${c.id}</span>
          <span class="cond-name">${c.name}</span>
        </div>
        <div>
          <span class="cond-cat-pill">${c.category} › ${c.subcategory}</span>
        </div>
        <div class="cond-significance">${c.significance}</div>
        <div class="cond-thickness">Thickness: ${c.thickness}</div>

        <div class="cond-expanded-content">
          <div class="cond-detail-row">
            <div class="cond-detail-label">Investigation Methods</div>
            <div class="cond-detail-tags">
              ${c.investigation.map(m => `<span class="cond-tag">${m}</span>`).join('')}
            </div>
          </div>
          <div class="cond-detail-row" style="margin-top:8px;">
            <div class="cond-detail-label">Applicable Settings</div>
            <div class="cond-detail-tags">
              ${c.settings.map(s => `<span class="cond-tag" style="color:var(--primary);">${s}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Click to expand/collapse
    grid.querySelectorAll('.condition-card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('expanded');
      });
    });
  }

  // ── RECOMMENDATIONS ───────────────────────────────────────────────────────
  function buildRecommendations() {
    const sec = document.getElementById('section-recommendations');
    const groups = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const groupLabels = { CRITICAL: 'Critical', HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };
    const groupBadge = { CRITICAL: 'badge-critical', HIGH: 'badge-priority-high', MEDIUM: 'badge-priority-medium', LOW: 'badge-priority-low' };

    sec.innerHTML = `
      <div class="section-header">
        <h1>Ground Investigation Recommendations</h1>
        <p>${D.recommendations.length} recommended investigations prioritised by risk and uncertainty — grouped by priority level</p>
      </div>

      ${groups.map(g => {
        const items = D.recommendations.filter(r => r.priority === g);
        if (items.length === 0) return '';
        return `
          <div class="rec-group">
            <div class="rec-group-header">
              <span class="badge ${groupBadge[g]}">${groupLabels[g]} Priority</span>
              <div class="rec-divider"></div>
              <span style="font-size:12px;color:var(--text-muted);">${items.length} item${items.length > 1 ? 's' : ''}</span>
            </div>
            ${items.map(r => `
              <div class="rec-item rec-${g.toLowerCase()}">
                <div class="rec-item-header">
                  <span class="rec-id">${r.id}</span>
                  <div>
                    <div class="rec-method">${r.method}</div>
                  </div>
                  <span class="badge ${groupBadge[g]}" style="flex-shrink:0;">${g}</span>
                </div>
                <div class="rec-rationale">${r.rationale}</div>
                <div class="rec-footer">
                  <div class="rec-footer-section">
                    <div class="rec-footer-label">Addresses Uncertainties</div>
                    <div class="rec-tags">
                      ${r.addresses.map(a => `<span class="rec-tag">${a}</span>`).join('')}
                    </div>
                  </div>
                  <div class="rec-footer-section">
                    <div class="rec-footer-label">Investigation Method</div>
                    <div style="font-size:12px;color:var(--text-dim);">${r.investigationMethod}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }).join('')}
    `;
  }

  // ── UNCERTAINTIES ─────────────────────────────────────────────────────────
  function buildUncertainties() {
    const sec = document.getElementById('section-uncertainties');

    sec.innerHTML = `
      <div class="section-header">
        <h1>Uncertainty Register</h1>
        <p>${D.uncertainties.length} identified uncertainties in the geological conceptual model — with confidence ratings and resolution actions</p>
      </div>

      <div class="uncertainty-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Element / Uncertainty</th>
              <th>Confidence</th>
              <th>Impact</th>
              <th>Resolution Action</th>
            </tr>
          </thead>
          <tbody>
            ${D.uncertainties.map(u => {
              const confClass = { HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low', UNKNOWN: 'badge-unknown' }[u.confidence] || 'badge-unknown';
              const impactClass = `unc-impact-${u.impact.toLowerCase()}`;
              const rowClass = `uncertainty-row-${u.impact.toLowerCase()}`;
              return `
                <tr class="${rowClass}">
                  <td class="font-mono" style="font-size:11px;color:var(--text-muted);">${u.id}</td>
                  <td style="font-weight:600;font-size:13px;max-width:200px;">${u.element}</td>
                  <td><span class="badge ${confClass}">${u.confidence}</span></td>
                  <td><span class="${impactClass}">${u.impact}</span></td>
                  <td class="resolution-text">${u.resolution}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="card" style="margin-top:24px;">
        <div class="card-header">
          <h3>Uncertainty Summary</h3>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value" style="color:var(--absent);">${D.uncertainties.filter(u => u.confidence === 'LOW').length}</div>
            <div class="stat-label">Low Confidence Items</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--possible);">${D.uncertainties.filter(u => u.confidence === 'MEDIUM').length}</div>
            <div class="stat-label">Medium Confidence Items</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--absent);">${D.uncertainties.filter(u => u.impact === 'HIGH').length}</div>
            <div class="stat-label">High Impact Uncertainties</div>
          </div>
        </div>
      </div>
    `;
  }

  // ── SITE INPUT ────────────────────────────────────────────────────────────
  function buildSiteInput() {
    const el = document.getElementById('section-siteinput');
    if (!el) return;

    const EXAMPLE_LOG = `GROUND INVESTIGATION REPORT — COASTAL SITE
BH01 — Borehole at Grid Ref TM 473 627

0.00–0.80m: MADE GROUND. Dense sandy fill with occasional brick fragments. Likely reworked Crag sand from prior construction. Groundwater not encountered.

0.80–2.50m: ALLUVIUM. Soft to very soft grey silty CLAY with peat laminations and organic odour. Water table encountered at 1.20m depth. Cu estimated 15–25 kPa.

2.50–4.00m: PEAT. Highly organic, dark brown fibrous peat. Very high water content. SPT N = 0.

4.00–22.00m: RED CRAG FORMATION. Loose to medium dense shelly SAND, medium to coarse grained with occasional gravel lenses and shell fragments. Slightly cemented in places. SPT N = 8–28. Groundwater level at 1.20m AOD — tidal fluctuation observed.

22.00–30.00m: LONDON CLAY FORMATION. Stiff to very stiff grey-blue fissured CLAY. Overconsolidated. No free water. Cu = 120–200 kPa.

Notes: Significant palaeochannel feature suspected between 2.50–4.00m. Liquefaction assessment required for Crag sand. Coastal erosion and sea level rise represent long-term geohazards.`;

    el.innerHTML = `
      <div class="section-header">
        <h1>Site Input</h1>
        <p class="section-subtitle">Paste borehole logs, walkover notes, desk study extracts or any site description. The processor will match geological terms against the SWEET ontology and conditions database to generate a mind map of potential conditions.</p>
      </div>
      <div class="siteinput-controls">
        <textarea id="site-text-input" placeholder="Paste borehole logs, field notes, site description..." spellcheck="false"></textarea>
        <div class="siteinput-btn-row">
          <button class="btn-secondary" id="btn-example-log">Example Log</button>
          <button class="btn-secondary" id="btn-clear-input">Clear</button>
          <button class="btn-primary" id="btn-process-input">Process →</button>
        </div>
        <div id="siteinput-status" class="siteinput-status"></div>
      </div>
      <div class="sweet-info-bar">
        <span class="sweet-badge">SWEET Ontology</span>
        <span>Matching against ESIP SWEET geology modules: realmGeol · phenGeol · matrSediment · matrRock · realmHydro · phenHydro · phenGeolFault · realmLandform and more</span>
      </div>
    `;

    document.getElementById('btn-example-log').addEventListener('click', () => {
      document.getElementById('site-text-input').value = EXAMPLE_LOG;
      state.siteInputText = EXAMPLE_LOG;
    });

    document.getElementById('btn-clear-input').addEventListener('click', () => {
      document.getElementById('site-text-input').value = '';
      state.siteInputText = '';
      document.getElementById('siteinput-status').textContent = '';
    });

    document.getElementById('btn-process-input').addEventListener('click', () => {
      const text = document.getElementById('site-text-input').value.trim();
      if (!text) {
        document.getElementById('siteinput-status').textContent = 'Please enter some text first.';
        return;
      }
      const statusEl = document.getElementById('siteinput-status');
      statusEl.textContent = 'Processing…';

      if (typeof window.SWEETProcessor === 'undefined') {
        statusEl.textContent = 'Error: SWEET processor not loaded. Check browser console.';
        return;
      }

      try {
        const result = window.SWEETProcessor.process(text);
        state.mindMapData = result;
        state.siteInputText = text;

        // Update mind map nav badge
        const mmNav = document.querySelector('[data-section="mindmap"] .nav-count');
        if (mmNav) mmNav.textContent = result.matchedConditions.length;

        statusEl.innerHTML = `✓ Found <strong>${result.matchedConditions.length}</strong> matched conditions across <strong>${Object.keys(result.categoryScores).length}</strong> categories — <a href="#" id="go-mindmap-link">view mind map →</a>`;
        document.getElementById('go-mindmap-link').addEventListener('click', e => {
          e.preventDefault();
          if (window.MindMap) window.MindMap.render(result);
          activateSection('mindmap');
        });

        if (window.MindMap) window.MindMap.render(result);
        activateSection('mindmap');
      } catch (err) {
        statusEl.textContent = 'Processing error: ' + err.message;
        console.error(err);
      }
    });
  }

  // ── MIND MAP ──────────────────────────────────────────────────────────────
  function buildMindMap() {
    const el = document.getElementById('section-mindmap');
    if (!el) return;

    el.innerHTML = `
      <div class="section-header">
        <h1>Geological Conditions Mind Map</h1>
        <p class="section-subtitle">Force-directed graph of potential geological conditions matched from your site description via the SWEET ontology.</p>
      </div>
      <div class="mm-toolbar">
        <button class="btn-icon" id="mm-zoom-in" title="Zoom in">＋</button>
        <button class="btn-icon" id="mm-zoom-out" title="Zoom out">－</button>
        <button class="btn-icon" id="mm-reset" title="Reset view">⌂</button>
        <button class="btn-icon" id="mm-export" title="Export PNG">↓ PNG</button>
        <span class="mm-legend">
          <span class="mm-dot" style="background:#003087"></span> Site
          <span class="mm-dot" style="background:#E87722"></span> Category
          <span class="mm-dot" style="background:#1a7340"></span> High match
          <span class="mm-dot" style="background:#b45309"></span> Medium match
          <span class="mm-dot" style="background:#64748b"></span> SWEET concept
        </span>
      </div>
      <div id="mindmap-container">
        <svg id="mindmap-svg"></svg>
        <div id="mindmap-tooltip" class="mm-tooltip"></div>
      </div>
    `;

    document.getElementById('mm-zoom-in').addEventListener('click', () => window.MindMap?.zoomIn());
    document.getElementById('mm-zoom-out').addEventListener('click', () => window.MindMap?.zoomOut());
    document.getElementById('mm-reset').addEventListener('click', () => window.MindMap?.resetView());
    document.getElementById('mm-export').addEventListener('click', () => window.MindMap?.exportPNG());

    // Render with current data if available
    if (state.mindMapData && window.MindMap) {
      window.MindMap.render(state.mindMapData);
    } else if (window.MindMap) {
      window.MindMap.render(null);
    }
  }

})();
