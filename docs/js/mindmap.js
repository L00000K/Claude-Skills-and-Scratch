/**
 * MindMap — D3 v7 force-directed mind map for the geological conceptual model.
 * Takes output from SWEETProcessor.process() and renders an interactive graph
 * in #mindmap-svg inside #mindmap-container.
 *
 * Depends on:
 *   window.d3  — D3 v7 loaded from CDN before this file
 *
 * Exposes: window.MindMap = { render, zoomIn, zoomOut, resetView, exportPNG }
 */
window.MindMap = (function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Module-level state                                                   */
  /* ------------------------------------------------------------------ */
  var _simulation = null;   // current force simulation (stopped on re-render)
  var _svg        = null;   // d3 selection for the SVG element
  var _zoom       = null;   // d3 zoom behaviour
  var _resizeObs  = null;   // ResizeObserver instance

  /* ------------------------------------------------------------------ */
  /* Colour helper                                                        */
  /* ------------------------------------------------------------------ */
  function nodeColour(d) {
    if (d.type === 'root')     return '#4a9eff';
    if (d.type === 'category') return '#7c5ce9';
    if (d.type === 'sweet')    return '#6b7280';
    if (d.score >= 60)         return '#2ecc71';
    if (d.score >= 30)         return '#f39c12';
    return '#95a5a6';
  }

  /* ------------------------------------------------------------------ */
  /* Link stroke colour helper                                            */
  /* ------------------------------------------------------------------ */
  function linkColour(d) {
    if (d.type === 'root-cat')  return '#7c5ce9';
    if (d.type === 'cat-cond')  return '#4a9eff';
    return '#6b7280';
  }

  /* ------------------------------------------------------------------ */
  /* Truncate label to max 20 chars                                       */
  /* ------------------------------------------------------------------ */
  function truncate(str, max) {
    max = max || 20;
    if (!str) return '';
    return str.length > max ? str.slice(0, max - 1) + '…' : str;
  }

  /* ------------------------------------------------------------------ */
  /* Build graph data (nodes + links) from processResult                  */
  /* ------------------------------------------------------------------ */
  function buildGraph(result) {
    var nodes = [];
    var links = [];

    /* Root node */
    nodes.push({
      id: 'root',
      type: 'root',
      label: 'Site',
      score: 100,
      r: 28
    });

    /* Unique categories from matched conditions */
    var categories = [];
    result.matchedConditions.forEach(function (c) {
      if (categories.indexOf(c.category) === -1) {
        categories.push(c.category);
      }
    });

    /* Category nodes */
    categories.forEach(function (cat, i) {
      var angle = (2 * Math.PI * i) / categories.length;
      nodes.push({
        id: 'cat-' + cat,
        type: 'category',
        label: cat,
        score: result.categoryScores[cat] || 0,
        r: 20,
        fx: null,
        fy: null,
        _angle: angle
      });
      links.push({ source: 'root', target: 'cat-' + cat, type: 'root-cat' });
    });

    /* Condition nodes */
    result.matchedConditions.forEach(function (cond) {
      var r = Math.max(7, Math.min(18, Math.floor(cond.score / 5)));
      nodes.push({
        id: 'cond-' + cond.conditionId,
        type: 'condition',
        label: cond.conditionName,
        score: cond.score,
        r: r,
        category: cond.category,
        detail: cond
      });
      links.push({
        source: 'cat-' + cond.category,
        target: 'cond-' + cond.conditionId,
        type: 'cat-cond'
      });
    });

    /* SWEET concept nodes — top 30 by score */
    var topConcepts = result.matchedSweetConcepts.slice(0, 30);
    topConcepts.forEach(function (concept) {
      nodes.push({
        id: 'sweet-' + concept.label,
        type: 'sweet',
        label: concept.label,
        score: concept.score,
        r: 6,
        category: concept.category,
        detail: concept
      });

      /* Link to highest-scoring condition in same category that references
         this concept, falling back to the category node */
      var parentCond = null;
      for (var i = 0; i < result.matchedConditions.length; i++) {
        var mc = result.matchedConditions[i];
        if (mc.category === concept.category) {
          var sweetArr = mc.sweetConcepts || [];
          for (var j = 0; j < sweetArr.length; j++) {
            if (sweetArr[j].label === concept.label) {
              parentCond = mc;
              break;
            }
          }
          if (parentCond) break;
        }
      }

      var targetId = parentCond
        ? 'cond-' + parentCond.conditionId
        : 'cat-' + concept.category;

      /* Only add link if the target node exists */
      var targetExists = nodes.some(function (n) { return n.id === targetId; });
      if (targetExists) {
        links.push({
          source: targetId,
          target: 'sweet-' + concept.label,
          type: 'cond-sweet'
        });
      }
    });

    return { nodes: nodes, links: links };
  }

  /* ------------------------------------------------------------------ */
  /* Tooltip content builders                                             */
  /* ------------------------------------------------------------------ */
  function tooltipHTML(d, result) {
    if (d.type === 'root') {
      var siteName = (window.SZC_DATA && window.SZC_DATA.site && window.SZC_DATA.site.name)
        ? window.SZC_DATA.site.name
        : 'Site';
      var total = result ? result.matchedConditions.length : 0;
      return '<div class="mm-tt-title">' + siteName + '</div>'
        + '<div class="mm-tt-row">Matched conditions: <strong>' + total + '</strong></div>';
    }

    if (d.type === 'category') {
      var condCount = result
        ? result.matchedConditions.filter(function (c) { return c.category === d.label; }).length
        : 0;
      return '<div class="mm-tt-title">' + d.label + '</div>'
        + '<div class="mm-tt-row">Score: <strong>' + d.score + '</strong></div>'
        + '<div class="mm-tt-row">Matched conditions: <strong>' + condCount + '</strong></div>';
    }

    if (d.type === 'condition' && d.detail) {
      var det = d.detail;
      var chips = (det.matchedKeywords || []).map(function (k) {
        return '<span class="mm-tt-chip">' + k + '</span>';
      }).join('');
      var sigHTML = det.engineeringSignificance
        ? '<div class="mm-tt-sig">' + det.engineeringSignificance + '</div>'
        : '';
      return '<div class="mm-tt-title">' + det.conditionName + '</div>'
        + '<div class="mm-tt-row">Category: <strong>' + det.category + '</strong></div>'
        + '<div class="mm-tt-row">Score: <strong>' + det.score + '</strong></div>'
        + (chips ? '<div class="mm-tt-chips">' + chips + '</div>' : '')
        + sigHTML;
    }

    if (d.type === 'sweet' && d.detail) {
      var sc = d.detail;
      return '<div class="mm-tt-title">' + sc.label + '</div>'
        + '<div class="mm-tt-row">Module: <strong>' + (sc.module || '—') + '</strong></div>'
        + '<div class="mm-tt-row">Parent: <strong>' + (sc.parentLabel || '—') + '</strong></div>'
        + (sc.uri ? '<div class="mm-tt-uri">' + sc.uri + '</div>' : '');
    }

    return '<div class="mm-tt-title">' + (d.label || d.id) + '</div>';
  }

  /* ------------------------------------------------------------------ */
  /* Inject minimal inline styles needed for tooltip + empty state        */
  /* ------------------------------------------------------------------ */
  function injectStyles() {
    if (document.getElementById('mindmap-inline-css')) return;
    var style = document.createElement('style');
    style.id = 'mindmap-inline-css';
    style.textContent = [
      '#mindmap-container { position:relative; width:100%; height:600px; background:#1a1e2e; border-radius:8px; overflow:hidden; }',
      '#mindmap-svg { display:block; width:100%; height:100%; }',
      '.mindmap-empty-state { display:flex; align-items:center; justify-content:center; height:100%; color:#8892a4; text-align:center; font-size:15px; padding:24px; }',
      '.mindmap-empty-state p { line-height:1.6; }',
      '.mm-tooltip { position:absolute; pointer-events:none; background:#232840; border:1px solid #3a4060; border-radius:6px; padding:10px 14px; font-size:13px; color:#e8eaf0; max-width:280px; box-shadow:0 4px 20px rgba(0,0,0,0.5); display:none; z-index:10; }',
      '.mm-tt-title { font-weight:600; font-size:14px; color:#ffffff; margin-bottom:6px; }',
      '.mm-tt-row { color:#a0abc0; margin-bottom:3px; }',
      '.mm-tt-row strong { color:#e8eaf0; }',
      '.mm-tt-chips { margin-top:6px; display:flex; flex-wrap:wrap; gap:4px; }',
      '.mm-tt-chip { background:#2a3050; border:1px solid #3a4060; border-radius:3px; padding:1px 6px; font-size:11px; color:#a0abc0; }',
      '.mm-tt-sig { margin-top:6px; font-size:12px; color:#8892a4; font-style:italic; }',
      '.mm-tt-uri { margin-top:6px; font-size:10px; color:#6b7280; word-break:break-all; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ------------------------------------------------------------------ */
  /* Cleanup previous simulation + observer                               */
  /* ------------------------------------------------------------------ */
  function cleanup() {
    if (_simulation) {
      _simulation.stop();
      _simulation = null;
    }
    if (_resizeObs) {
      _resizeObs.disconnect();
      _resizeObs = null;
    }
    _svg = null;
    _zoom = null;
  }

  /* ------------------------------------------------------------------ */
  /* render(processResult)                                                */
  /* ------------------------------------------------------------------ */
  function render(processResult) {
    cleanup();
    injectStyles();

    /* ---- Guard: D3 availability ---- */
    if (!window.d3) {
      var cont = document.getElementById('mindmap-container');
      if (cont) {
        cont.innerHTML = '<div class="mindmap-empty-state"><p>D3.js library required for the mind map.<br>Please connect to the internet and reload.</p></div>';
      }
      return;
    }

    var d3 = window.d3;

    /* ---- Container ---- */
    var container = document.getElementById('mindmap-container');
    if (!container) return;

    /* Clear previous content inside the container but keep the tooltip div */
    var tooltip = document.getElementById('mindmap-tooltip');

    /* ---- Empty state ---- */
    if (!processResult || !processResult.matchedConditions || processResult.matchedConditions.length === 0) {
      /* Replace svg contents with empty state */
      var svgEl = document.getElementById('mindmap-svg');
      if (svgEl) {
        /* Use a foreignObject or just put text in the SVG isn't ideal —
           instead, hide the SVG and show a sibling div */
        svgEl.style.display = 'none';
      }
      /* Remove any existing empty-state divs */
      var oldEmpty = container.querySelector('.mindmap-empty-state');
      if (oldEmpty) oldEmpty.parentNode.removeChild(oldEmpty);

      var emptyDiv = document.createElement('div');
      emptyDiv.className = 'mindmap-empty-state';
      emptyDiv.innerHTML = '<p>No data yet — paste a site description in <strong>Site Input</strong> and click Process.</p>';
      container.insertBefore(emptyDiv, container.firstChild);
      return;
    }

    /* Remove any lingering empty state */
    var oldEmpty = container.querySelector('.mindmap-empty-state');
    if (oldEmpty) oldEmpty.parentNode.removeChild(oldEmpty);

    /* ---- Dimensions ---- */
    var width  = container.clientWidth  || 1000;
    var height = container.clientHeight || 600;

    /* ---- SVG setup ---- */
    var svgEl = document.getElementById('mindmap-svg');
    if (!svgEl) return;
    svgEl.style.display = 'block';
    svgEl.setAttribute('width',   width);
    svgEl.setAttribute('height',  height);
    svgEl.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

    _svg = d3.select(svgEl);
    _svg.selectAll('*').remove();   /* clear old content */

    /* ---- Zoom group ---- */
    var g = _svg.append('g').attr('id', 'mm-zoom-group');

    /* ---- Build graph data ---- */
    var graph = buildGraph(processResult);
    var nodes = graph.nodes;
    var links = graph.links;

    /* ---- Link lines ---- */
    var linkGroup = g.append('g').attr('class', 'links');
    var linkSel = linkGroup.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', function (d) { return linkColour(d); })
      .attr('stroke-width', function (d) {
        if (d.type === 'root-cat')  return 2.5;
        if (d.type === 'cat-cond')  return 1.5;
        return 1;
      })
      .attr('stroke-opacity', function (d) {
        return d.type === 'cond-sweet' ? 0.4 : 0.6;
      });

    /* ---- Node groups ---- */
    var nodeGroup = g.append('g').attr('class', 'nodes');
    var nodeSel = nodeGroup.selectAll('g.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    /* Circle */
    nodeSel.append('circle')
      .attr('r', function (d) { return d.r; })
      .attr('fill', function (d) { return nodeColour(d); })
      .attr('stroke', '#1a1e2e')
      .attr('stroke-width', 2);

    /* Label */
    nodeSel.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', function (d) { return d.r + 13; })
      .attr('font-size', function (d) {
        if (d.type === 'root')      return '13px';
        if (d.type === 'category')  return '11px';
        if (d.type === 'condition') return '9px';
        return '8px';  /* sweet */
      })
      .attr('fill', '#e8eaf0')
      .attr('pointer-events', 'none')
      .text(function (d) { return truncate(d.label, 20); });

    /* ---- Force simulation ---- */
    _simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(function (d) { return d.id; })
        .distance(function (d) {
          if (d.type === 'root-cat')  return 140;
          if (d.type === 'cat-cond')  return 90;
          return 55;
        })
        .strength(0.7)
      )
      .force('charge', d3.forceManyBody()
        .strength(function (d) {
          if (d.type === 'root')     return -900;
          if (d.type === 'category') return -400;
          return -150;
        })
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide()
        .radius(function (d) { return d.r + 6; })
        .strength(0.8)
      )
      .alphaDecay(0.04);

    /* ---- Tick handler ---- */
    _simulation.on('tick', function () {
      linkSel
        .attr('x1', function (d) { return d.source.x; })
        .attr('y1', function (d) { return d.source.y; })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) { return d.target.y; });

      nodeSel.attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    });

    /* ---- Zoom / pan ---- */
    _zoom = d3.zoom()
      .scaleExtent([0.15, 5])
      .on('zoom', function (e) {
        g.attr('transform', e.transform);
      });
    _svg.call(_zoom);

    /* ---- Drag behaviour ---- */
    function dragStarted(event, d) {
      if (!event.active) _simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragEnded(event, d) {
      if (!event.active) _simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    nodeSel.call(
      d3.drag()
        .on('start', dragStarted)
        .on('drag',  dragged)
        .on('end',   dragEnded)
    );

    /* ---- Tooltip ---- */
    var tooltipEl = document.getElementById('mindmap-tooltip');

    nodeSel
      .on('mouseenter', function (event, d) {
        if (!tooltipEl) return;
        tooltipEl.innerHTML = tooltipHTML(d, processResult);
        tooltipEl.style.display = 'block';
        /* Position relative to container */
        var rect = container.getBoundingClientRect();
        var x = event.clientX - rect.left + 14;
        var y = event.clientY - rect.top  - 10;
        /* Keep inside container */
        var ttW = 290;
        if (x + ttW > container.clientWidth) x = x - ttW - 28;
        if (x < 0) x = 4;
        if (y < 0) y = 4;
        tooltipEl.style.left = x + 'px';
        tooltipEl.style.top  = y + 'px';
      })
      .on('mousemove', function (event) {
        if (!tooltipEl || tooltipEl.style.display === 'none') return;
        var rect = container.getBoundingClientRect();
        var x = event.clientX - rect.left + 14;
        var y = event.clientY - rect.top  - 10;
        var ttW = 290;
        if (x + ttW > container.clientWidth) x = x - ttW - 28;
        if (x < 0) x = 4;
        if (y < 0) y = 4;
        tooltipEl.style.left = x + 'px';
        tooltipEl.style.top  = y + 'px';
      })
      .on('mouseleave', function () {
        if (tooltipEl) tooltipEl.style.display = 'none';
      });

    /* ---- ResizeObserver ---- */
    if (typeof ResizeObserver !== 'undefined') {
      _resizeObs = new ResizeObserver(function (entries) {
        var entry = entries[0];
        if (!entry) return;
        var newW = Math.floor(entry.contentRect.width);
        var newH = Math.floor(entry.contentRect.height);
        if (newW < 10 || newH < 10) return;
        svgEl.setAttribute('width',   newW);
        svgEl.setAttribute('height',  newH);
        svgEl.setAttribute('viewBox', '0 0 ' + newW + ' ' + newH);
        if (_simulation) {
          _simulation
            .force('center', d3.forceCenter(newW / 2, newH / 2))
            .alpha(0.3)
            .restart();
        }
      });
      _resizeObs.observe(container);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Zoom controls                                                        */
  /* ------------------------------------------------------------------ */
  function zoomIn() {
    if (!_svg || !_zoom) return;
    _svg.transition().duration(300).call(_zoom.scaleBy, 1.4);
  }

  function zoomOut() {
    if (!_svg || !_zoom) return;
    _svg.transition().duration(300).call(_zoom.scaleBy, 0.7);
  }

  function resetView() {
    if (!_svg || !_zoom) return;
    _svg.transition().duration(500).call(_zoom.transform, window.d3.zoomIdentity);
  }

  /* ------------------------------------------------------------------ */
  /* exportPNG                                                            */
  /* ------------------------------------------------------------------ */
  function exportPNG() {
    var svgEl = document.getElementById('mindmap-svg');
    if (!svgEl) return;

    var svgData = new XMLSerializer().serializeToString(svgEl);
    var canvas  = document.createElement('canvas');
    var rect    = svgEl.getBoundingClientRect();
    canvas.width  = rect.width  || 1200;
    canvas.height = rect.height || 800;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1a1e2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      var a = document.createElement('a');
      a.download = 'geological-mind-map.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }

  /* ------------------------------------------------------------------ */
  /* Public API                                                           */
  /* ------------------------------------------------------------------ */
  return {
    render:    render,
    zoomIn:    zoomIn,
    zoomOut:   zoomOut,
    resetView: resetView,
    exportPNG: exportPNG
  };

})();
