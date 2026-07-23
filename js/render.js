const ICONS = {
  logo: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>',
  plus: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  folder: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  code: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  download: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  file: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  edit: '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',
  save: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
  eye: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
};

let gradesRevealed = false;

const Render = {
  all() {
    this.header();
    this.tabs();
    this.actionBar();
    this.courseContent();
  },

  header() {
    const el = document.getElementById('app-header');
    if (!el) return;
    el.innerHTML = `
      <div class="header-left">
        <span class="header-logo">${ICONS.logo}</span>
        <span class="header-title">Grade Calculator</span>
        <span class="save-indicator" id="save-indicator"></span>
      </div>
      <div class="header-actions">
        <button class="header-icon-btn" id="presets-btn">${ICONS.folder} <span>Presets</span></button>
        <button class="header-icon-btn" id="formula-btn">${ICONS.code} <span>f(x)</span></button>
      </div>
    `;
  },

  tabs() {
    const el = document.getElementById('tabs-bar');
    if (!el) return;
    el.innerHTML = State.courses.map((c, i) => `
      <button class="tab" role="tab" aria-selected="${i === State.activeIndex}" data-index="${i}">
        ${esc(c.name)}
        <span class="tab-actions">
          <span class="tab-action tab-rename" data-index="${i}" title="Rename">${ICONS.edit}</span>
          ${State.courses.length > 1 ? `<span class="tab-action danger tab-remove" data-index="${i}" title="Remove">${ICONS.x}</span>` : ''}
        </span>
      </button>
    `).join('') + `
      <button class="tab-add" id="tab-add" aria-label="Add course">${ICONS.plus}</button>
    `;
  },

  actionBar() {
    const el = document.getElementById('action-bar');
    if (!el) return;
    el.innerHTML = `
      <button class="action-bar-item accent" id="pdf-btn">${ICONS.file} <span>Grade Report</span></button>
      <span class="action-bar-sep"></span>
      <button class="action-bar-item" id="whatif-btn">${ICONS.code} <span>What-If</span></button>
      <span class="action-bar-sep"></span>
      <button class="action-bar-item" id="export-btn">${ICONS.download} <span>Export</span></button>
      <span class="action-bar-sep"></span>
      <label class="action-bar-item" for="import-file" tabindex="0">${ICONS.upload} <span>Import</span></label>
      <input id="import-file" type="file" accept=".json" class="sr-only">
    `;
  },

  courseContent() {
    console.log('[RENDER] courseContent');
    const el = document.getElementById('course-content');
    if (!el) { console.log('[RENDER] no #course-content element'); return; }
    const c = State.course;
    if (!c) { console.log('[RENDER] no course'); el.innerHTML = ''; return; }

    const hasContent = (c.midterm?.components || []).some(g => g.items?.length > 0) || (c.finals?.components || []).some(g => g.items?.length > 0);
    if (!hasContent) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${ICONS.file}</div>
          <div class="empty-state-title">No scores yet</div>
          <div class="empty-state-text">Add components using the buttons above to start calculating your grade.</div>
          <div class="empty-state-steps">
            <div class="empty-state-step"><span class="empty-state-num">1</span> Click <strong>+ Quiz</strong> or <strong>+ Major</strong> to add components to each term</div>
            <div class="empty-state-step"><span class="empty-state-num">2</span> Enter your scores in the <strong>Earned</strong> and <strong>Max</strong> fields</div>
            <div class="empty-state-step"><span class="empty-state-num">3</span> Adjust weights in <strong>Grading Setup</strong> to match your syllabus</div>
            <div class="empty-state-step"><span class="empty-state-num">4</span> Click the <strong>eye</strong> to reveal your final grade</div>
          </div>
        </div>
      `;
      return;
    }

    const cw = c.compWeights || {};
    const { midterm, finals } = Calc.courseAverages(c);
    const fg = Calc.roundWhole(Calc.finalGrade(midterm, finals, c.termWeights));
    const tw = c.termWeights || { midterm: 50, finals: 50 };

    const warns = weightWarnings(c);
    el.innerHTML = `
      ${this._gradingSetup(c)}
      ${warns.length ? `<div class="weight-warn">${warns.map(w => `<span>${ICONS.x} ${esc(w)}</span>`).join('')}</div>` : ''}
      <div class="term-grid">
        <div class="term-section">
          <div class="term-label">
            <span>Midterm <input type="number" class="term-weight-input" value="${tw.midterm}" data-termweight="midterm" min="0" max="100" step="1">%</span>
            <div class="term-actions">
              <button class="term-add-comp" data-term="midterm" data-type="quiz" aria-label="Add quiz">${ICONS.plus} Quiz</button>
              <button class="term-add-comp" data-term="midterm" data-type="major" aria-label="Add major">${ICONS.plus} Major</button>
            </div>
            <span class="term-score ${scoreColor(midterm)}" id="midterm-score">${fmtPct(midterm)}%</span>
          </div>
          ${Render._termContent(c.midterm?.components || [], 'midterm')}
        </div>
        <div class="term-section">
          <div class="term-label">
            <span>Finals <input type="number" class="term-weight-input" value="${tw.finals}" data-termweight="finals" min="0" max="100" step="1">%</span>
            <div class="term-actions">
              <button class="term-add-comp" data-term="finals" data-type="quiz" aria-label="Add quiz">${ICONS.plus} Quiz</button>
              <button class="term-add-comp" data-term="finals" data-type="major" aria-label="Add major">${ICONS.plus} Major</button>
            </div>
            <span class="term-score ${scoreColor(finals)}" id="finals-score">${fmtPct(finals)}%</span>
          </div>
          ${Render._termContent(c.finals?.components || [], 'finals')}
        </div>
      </div>
      <div class="final-grade-row" id="final-grade-row">
          <button class="eye-btn" id="eye-btn" aria-label="Reveal grades">${gradesRevealed ? ICONS.eye : ICONS.eyeOff}</button>
        <div class="final-grade-box">
          <span class="final-grade-label">Final Grade</span>
          <span class="final-grade-value ${gradesRevealed ? scoreColor(fg) : ''}" id="final-grade-val">${gradesRevealed ? fg + '%' : '•••'}</span>
        </div>
      </div>
      <div class="calc-section" id="calc-section" aria-expanded="${c._calcExpanded !== false}">
        <div class="calc-header">
          <span class="calc-header-title">${ICONS.code} Solution</span>
          <span class="calc-header-toggle" id="calc-toggle" aria-label="Toggle solution">${ICONS.chevronDown}</span>
        </div>
        <div class="calc-body" id="calc-body">
          ${this._calcContent(c)}
        </div>
      </div>
    `;
    clearTimeout(window.contentRenderTimer);
    window.contentRenderTimer = setTimeout(() => { if (typeof renderKatex === 'function') renderKatex(); }, 100);
  },

  _gradingSetup(c) {
    const cw = c.compWeights || {};
    const sys = c.system || 'transmuted';
    const q = parseFloat(cw.quiz) || 0;
    const m = parseFloat(cw.major) || 0;
    const o = Math.max(0, 100 - q - m);
    return `
      <div class="card">
        <div class="card-title">Grading Setup</div>
        <div class="card-row" style="margin-bottom:10px;">
          <div class="system-choice">
            <div class="system-option ${sys === 'transmuted' ? 'selected' : ''}" data-system="transmuted" id="system-transmuted" role="button" tabindex="0">
              <div class="system-option-label">Transmuted</div>
              <div class="system-option-desc">Chalkboard formula with passing target</div>
            </div>
            <div class="system-option ${sys === 'zero' ? 'selected' : ''}" data-system="zero" id="system-zero" role="button" tabindex="0">
              <div class="system-option-label">Zero-Based</div>
              <div class="system-option-desc">Passing-scaled, no offset</div>
            </div>
          </div>
          <div class="field" style="flex-shrink:0;">
            <label for="passing-target">Passing %</label>
            <input type="number" id="passing-target" min="0" max="100" step="1" value="${c.passingTarget || 50}" style="width:70px;">
          </div>
        </div>
        <div class="card-row">
          <div class="field">
            <label>Quiz Weight</label>
            <input type="number" class="comp-weight-input" data-weight="quiz" min="0" max="100" step="1" value="${q}">
          </div>
          <div class="field">
            <label>Exam Weight</label>
            <input type="number" class="comp-weight-input" data-weight="major" min="0" max="100" step="1" value="${m}">
          </div>
        </div>
        <div class="weight-bar-wrap">
          <div class="weight-bar">
            <div class="weight-bar-seg weight-bar-quiz" style="width:${q}%">${q > 10 ? q + '%' : ''}</div>
            <div class="weight-bar-seg weight-bar-major" style="width:${m}%">${m > 10 ? m + '%' : ''}</div>
            <div class="weight-bar-seg weight-bar-other" style="width:${o}%">${o > 10 ? o + '%' : ''}</div>
          </div>
          <div class="weight-bar-legend">
            <span><i style="background:var(--pass)"></i> Quiz ${q}%</span>
            <span><i style="background:var(--caution)"></i> Major ${m}%</span>
            <span><i style="background:var(--ink-soft)"></i> Other ${o}%</span>
          </div>
        </div>
      </div>
    `;
  },

  _compGroup(comp, ci, term, cw) {
    const expanded = comp._expanded !== false;
    const items = comp.items || [];
    const isMajor = comp.type === 'major';
    const isOther = comp.type === 'other';
    const pctLabel = isOther ? `${items[0]?.weight || 0}%` : `${cw?.[comp.type] || 0}%`;
    const scored = items.filter(it => parseFloat(it.earned) > 0 && parseFloat(it.max) > 0);
    const avg = scored.length > 0 ? scored.reduce((s, it) => s + parseFloat(it.earned) / parseFloat(it.max) * 100, 0) / scored.length : null;
    return `
      <section class="comp-group" aria-expanded="${expanded}" data-type="${comp.type}" data-term="${term}" data-ci="${ci}">
        <header class="comp-header" data-term="${term}" data-ci="${ci}">
          <div class="comp-header-left">
            <span class="comp-title">${esc(comp.label)}</span>
            <span class="comp-badge">${pctLabel}</span>
            ${isMajor ? '' : `<span class="comp-badge">${items.length}</span>`}
            ${avg !== null ? `<span class="comp-score ${scoreColor(avg)}">${fmtPct(avg)}</span>` : ''}
          </div>
          <div class="comp-header-right">
            ${isMajor ? '' : `<button class="comp-header-btn add-item-btn" data-term="${term}" data-ci="${ci}" aria-label="Add item">${ICONS.plus}</button>`}
            ${isMajor ? '' : `<button class="comp-header-btn comp-remove" data-term="${term}" data-ci="${ci}" aria-label="Remove last">${ICONS.x}</button>`}
            <button class="comp-header-btn comp-chevron" data-term="${term}" data-ci="${ci}" aria-label="Toggle">${ICONS.chevronDown}</button>
          </div>
        </header>
        <div class="comp-body">
          ${items.length === 0 ? '<div class="comp-empty">No items yet.</div>' : `
            <div class="comp-rows">
              ${items.map((item, ii) => this._row(comp, term, ci, ii, item)).join('')}
            </div>
          `}
        </div>
      </section>
    `;
  },

  _row(comp, term, ci, ii, item) {
    const uid = `r_${term}_${ci}_${ii}`;
    const displayLabel = item.label || `Item ${ii + 1}`;
    const isOther = comp.type === 'other';
    const isMajor = comp.type === 'major';
    return `
      <div class="comp-row row-enter" data-uid="${uid}" data-term="${term}" data-ci="${ci}" data-ii="${ii}">
        <div class="field">
          <label>Name</label>
          <input type="text" placeholder="${comp.type === 'quiz' ? 'e.g. Quiz 1' : comp.type === 'major' ? 'e.g. Exam' : 'e.g. Assignment'}" value="${esc(item.label || displayLabel)}" data-uid="${uid}" data-val="label" data-term="${term}" data-ci="${ci}" data-ii="${ii}">
        </div>
        <div class="field">
          <label>Earned</label>
          <input type="number" inputmode="decimal" step="any" min="0" placeholder="0" value="${item.earned !== '' ? item.earned : ''}" data-uid="${uid}" data-val="earned" data-term="${term}" data-ci="${ci}" data-ii="${ii}" aria-describedby="err-${uid}-earned">
          <span class="field-error" id="err-${uid}-earned" role="alert"></span>
        </div>
        <div class="field">
          <label>Max</label>
          <input type="number" inputmode="decimal" step="any" min="1" placeholder="100" value="${item.max !== '' ? item.max : ''}" data-uid="${uid}" data-val="max" data-term="${term}" data-ci="${ci}" data-ii="${ii}" aria-describedby="err-${uid}-max">
          <span class="field-error" id="err-${uid}-max" role="alert"></span>
        </div>
        ${isOther ? `
        <div class="field field-sm">
          <label>Weight %</label>
          <input type="number" class="item-weight-input" step="any" min="0" max="100" placeholder="10" value="${item.weight !== undefined ? item.weight : ''}" data-uid="${uid}" data-val="weight" data-term="${term}" data-ci="${ci}" data-ii="${ii}">
        </div>
        ` : !isMajor ? `
        <div class="field field-sm">
          <label>Pass %</label>
          <input type="number" inputmode="decimal" step="any" min="0" max="100" placeholder="50" value="${item.passing !== '' && item.passing !== undefined ? item.passing : ''}" data-uid="${uid}" data-val="passing" data-term="${term}" data-ci="${ci}" data-ii="${ii}">
        </div>
        ` : ''}
      </div>
    `;
  },

  _termContent(components, term) {
    const others = components.filter(g => g.type === 'other');
    const nonOthers = components.filter(g => g.type !== 'other');
    let html = nonOthers.map(comp => this._compGroup(comp, components.indexOf(comp), term, State.course?.compWeights || {})).join('');
    html += this._otherGroup(others, components, term);
    return html;
  },

  _otherGroup(others, allComponents, term) {
    const termObj = (term === 'midterm' ? State.course?.midterm : State.course?.finals);
    const expanded = termObj?._otherExpanded !== false;
    const scoredItems = others.flatMap(g => g.items || []).filter(it => parseFloat(it.earned) > 0 && parseFloat(it.max) > 0);
    const avg = scoredItems.length > 0 ? scoredItems.reduce((s, it) => s + parseFloat(it.earned) / parseFloat(it.max) * 100, 0) / scoredItems.length : null;
    return `
      <section class="comp-group comp-group-other" aria-expanded="${expanded}" data-term="${term}">
        <header class="comp-header" data-term="${term}">
          <div class="comp-header-left">
            <span class="comp-title">Other Components</span>
            <span class="comp-badge">${others.length}</span>
            ${avg !== null ? `<span class="comp-score ${scoreColor(avg)}">${fmtPct(avg)}</span>` : ''}
          </div>
          <div class="comp-header-right">
            <button class="comp-header-btn add-other-btn" data-term="${term}" aria-label="Add other">${ICONS.plus}</button>
            <button class="comp-header-btn remove-other-btn" data-term="${term}" aria-label="Remove other">${ICONS.x}</button>
            <button class="comp-header-btn comp-chevron" data-term="${term}" aria-label="Toggle">${ICONS.chevronDown}</button>
          </div>
        </header>
        <div class="comp-body">
          ${others.length === 0 ? '<div class="comp-empty">No other components.</div>' : `
            <div class="comp-rows">
              ${others.map(comp => this._otherRow(comp, term, allComponents.indexOf(comp))).join('')}
            </div>
          `}
        </div>
      </section>
    `;
  },

  _otherRow(comp, term, ci) {
    const item = comp.items?.[0] || {};
    const uid = `other_${term}_${ci}`;
    return `
      <div class="comp-row" data-uid="${uid}" data-term="${term}" data-ci="${ci}" data-ii="0">
        <div class="field">
          <label>Name</label>
          <input type="text" placeholder="e.g. Assignment" value="${esc(item.label || '')}" data-uid="${uid}" data-val="label" data-term="${term}" data-ci="${ci}" data-ii="0">
        </div>
        <div class="field">
          <label>Earned</label>
          <input type="number" inputmode="decimal" step="any" min="0" placeholder="0" value="${item.earned !== '' ? item.earned : ''}" data-uid="${uid}" data-val="earned" data-term="${term}" data-ci="${ci}" data-ii="0">
        </div>
        <div class="field">
          <label>Max</label>
          <input type="number" inputmode="decimal" step="any" min="1" placeholder="100" value="${item.max !== '' ? item.max : ''}" data-uid="${uid}" data-val="max" data-term="${term}" data-ci="${ci}" data-ii="0">
        </div>
        <div class="field field-sm">
          <label>Weight %</label>
          <input type="number" class="item-weight-input" step="any" min="0" max="100" placeholder="10" value="${item.weight !== undefined ? item.weight : ''}" data-uid="${uid}" data-val="weight" data-term="${term}" data-ci="${ci}" data-ii="0">
        </div>
      </div>
    `;
  },

  _calcContent(c) {
    const cw = c.compWeights || {};
    const { midterm, finals } = Calc.courseAverages(c);
    const fg = Calc.roundWhole(Calc.finalGrade(midterm, finals, c.termWeights));
    const tw = c.termWeights || { midterm: 50, finals: 50 };
    let html = '<div class="calc-body-inner">';
    html += '<div class="calc-section-title">GRADE COMPUTATION</div>';
    html += Calc.termSteps(c.midterm?.components, cw, c.system, c.passingTarget, 'MIDTERM');
    html += Calc.termSteps(c.finals?.components, cw, c.system, c.passingTarget, 'FINALS');
    html += '<div class="calc-term-label">FINAL COURSE GRADE</div>';
    html += `<div class="katex-render calc-line" data-display="true">\\text{Midterm}\\; ${fmtPct(midterm)}\\% \\times ${tw.midterm}\\% + \\text{Finals}\\; ${fmtPct(finals)}\\% \\times ${tw.finals}\\%</div>`;
    html += `<div class="katex-render calc-line" data-display="true">= \\boxed{${fmtPct(midterm * tw.midterm / 100)}} + \\boxed{${fmtPct(finals * tw.finals / 100)}} = \\boxed{${fg}}\\%</div>`;
    html += '</div>';
    return html;
  },

  updateCalcSection() {
    const body = document.getElementById('calc-body');
    const c = State.course;
    if (!body || !c) return;
    body.innerHTML = this._calcContent(c);
    if (typeof renderKatex === 'function') renderKatex();
  },

  updateScores() {
    const c = State.course;
    if (!c) return;
    const { midterm, finals } = Calc.courseAverages(c);
    const fg = Calc.roundWhole(Calc.finalGrade(midterm, finals, c.termWeights));
    const midEl = document.getElementById('midterm-score');
    const finEl = document.getElementById('finals-score');
    const fgEl = document.getElementById('final-grade-val');
    if (midEl) { midEl.textContent = fmtPct(midterm) + '%'; midEl.className = 'term-score ' + scoreColor(midterm); }
    if (finEl) { finEl.textContent = fmtPct(finals) + '%'; finEl.className = 'term-score ' + scoreColor(finals); }
    if (fgEl) { fgEl.textContent = gradesRevealed ? fg + '%' : '•••'; fgEl.className = 'final-grade-value' + (gradesRevealed ? ' ' + scoreColor(fg) : ''); }
    this.updateCalcSection();
  }
};

function distributeOtherWeights(termObj) {
  const c = State.course;
  const cw = c?.compWeights || {};
  const totalOther = 100 - (parseFloat(cw.quiz) || 0) - (parseFloat(cw.major) || 0);
  const otherComps = (termObj?.components || []).filter(g => g.type === 'other');
  if (otherComps.length && totalOther > 0) {
    const perItem = Math.floor(totalOther / otherComps.length * 100) / 100;
    let remainder = Math.round((totalOther - perItem * otherComps.length) * 100) / 100;
    otherComps.forEach((comp, i) => {
      const w = i === otherComps.length - 1 ? perItem + remainder : perItem;
      if (comp.items && comp.items[0]) comp.items[0].weight = Math.round(w * 100) / 100;
    });
  }
}

function weightWarnings(c) {
  const cw = c.compWeights || {};
  const tw = c.termWeights || {};
  const warns = [];
  const compTotal = (parseFloat(cw.quiz) || 0) + (parseFloat(cw.major) || 0);
  const midOther = (c.midterm?.components || []).filter(g => g.type === 'other').reduce((s, g) => s + (g.items || []).reduce((t, it) => t + (parseFloat(it.weight) || 0), 0), 0);
  const finOther = (c.finals?.components || []).filter(g => g.type === 'other').reduce((s, g) => s + (g.items || []).reduce((t, it) => t + (parseFloat(it.weight) || 0), 0), 0);
  if (Math.abs(compTotal + midOther - 100) > 0.01) warns.push(`Midterm component weights (quiz ${cw.quiz || 0}% + major ${cw.major || 0}% + other ${midOther}%) sum to ${(compTotal + midOther).toFixed(2)}%, not 100%`);
  if (Math.abs(compTotal + finOther - 100) > 0.01) warns.push(`Finals component weights (quiz ${cw.quiz || 0}% + major ${cw.major || 0}% + other ${finOther}%) sum to ${(compTotal + finOther).toFixed(2)}%, not 100%`);
  const termTotal = (parseFloat(tw.midterm) || 0) + (parseFloat(tw.finals) || 0);
  if (Math.abs(termTotal - 100) > 0.01) warns.push(`Term weights (midterm ${tw.midterm || 0}% + finals ${tw.finals || 0}%) sum to ${termTotal.toFixed(2)}%, not 100%`);
  return warns;
}

function scoreColor(v) {
  if (v >= 75) return 'score-green';
  if (v >= 50) return 'score-yellow';
  return 'score-red';
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

window.Render = Render;
