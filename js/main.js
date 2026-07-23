let calcTimer;

function debouncedRecalc() {
  clearTimeout(calcTimer);
  clearTimeout(window.contentRenderTimer);
  calcTimer = setTimeout(() => Render.updateScores(), 80);
}

function showToast(msg, type) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast' + (type ? ' toast-' + type : '');
  t.textContent = msg;
  container.appendChild(t);
  requestAnimationFrame(() => t.classList.add('visible'));
  setTimeout(() => {
    t.classList.remove('visible');
    setTimeout(() => t.remove(), 200);
  }, 2000);
}

function showSaved() {
  const el = document.getElementById('save-indicator');
  if (el) { el.textContent = 'Saved'; el.className = 'save-indicator saved'; }
  clearTimeout(window._saveTimer);
  window._saveTimer = setTimeout(() => { if (el) el.className = 'save-indicator'; }, 3000);
}
function saveAndToast() {
  State.save();
  showToast('Saved', 'green');
  showSaved();
}

// ===== Eye reveal — pop overlay =====
function revealGrades() {
  const btn = document.getElementById('eye-btn');
  const val = document.getElementById('final-grade-val');
  if (!btn || !val) return;

  if (gradesRevealed) {
    gradesRevealed = false;
    btn.innerHTML = ICONS.eyeOff;
    val.textContent = '•••';
    clearTimeout(window.contentRenderTimer);
    Render.updateScores();
    return;
  }

  const c = State.course;
  if (!c) return;
  const { midterm, finals } = Calc.courseAverages(c);
  const fg = Calc.roundWhole(Calc.finalGrade(midterm, finals, c.termWeights));

  val.textContent = fg + '%';
  gradesRevealed = true;
  btn.innerHTML = ICONS.eye;
  try { new Audio(REVEAL_SOUND).play(); } catch {}

  const overlay = document.createElement('div');
  overlay.className = 'grade-overlay';
  overlay.innerHTML = '<span class="grade-overlay-pct">' + fg + '</span>';
  document.body.appendChild(overlay);
  const pct = overlay.querySelector('.grade-overlay-pct');
  overlay.animate([
    { opacity: 0 },
    { opacity: 1, offset: 0.08 },
    { opacity: 0.9, offset: 0.3 },
    { opacity: 0 }
  ], { duration: 1600, easing: 'ease', fill: 'forwards' });
  pct.animate([
    { transform: 'scale(0.15)', opacity: 1 },
    { transform: 'scale(4.5)', opacity: 0.7, offset: 0.5 },
    { transform: 'scale(8)', opacity: 0 }
  ], { duration: 1500, easing: 'ease-out', fill: 'forwards' });
  setTimeout(() => overlay.remove(), 1700);
}

// ===== Rename Modal =====
function openRenameModal(index, currentName) {
  const html = `
    <div class="modal-header">
      <h2 class="modal-title">Rename Course</h2>
      <button class="modal-close" aria-label="Close">${ICONS.x}</button>
    </div>
    <div class="modal-body">
      <div class="field">
        <label for="rename-input">Course Name</label>
        <input type="text" id="rename-input" value="${esc(currentName)}">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline modal-close">Cancel</button>
      <button class="btn btn-primary" id="rename-confirm">Rename</button>
    </div>
  `;
  Modal.open('rename-modal', html);
  const inp = document.getElementById('rename-input');
  if (inp) { inp.focus(); inp.select(); }
  document.getElementById('rename-confirm')?.addEventListener('click', () => {
    const name = document.getElementById('rename-input')?.value.trim();
    if (name) { State.renameCourse(index, name); saveAndToast(); Render.all(); }
    Modal.closeTop();
  });
}

function openRemoveModal(index) {
  const name = State.courses[index].name;
  const html = `
    <div class="modal-header">
      <h2 class="modal-title">Remove Course</h2>
      <button class="modal-close" aria-label="Close">${ICONS.x}</button>
    </div>
    <div class="modal-body">
      <p>Remove <strong>${esc(name)}</strong>? This cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline modal-close">Cancel</button>
      <button class="btn btn-red" id="remove-confirm">Remove</button>
    </div>
  `;
  Modal.open('remove-modal', html);
  document.getElementById('remove-confirm')?.addEventListener('click', () => {
    State.removeCourse(index);
    saveAndToast();
    Render.all();
    Modal.closeTop();
  });
}

// ===== Click Handler =====
function handleClick(e) {
  const t = e.target;
  console.log('[CLICK] target:', t.tagName, t.className, t.id || '(no id)', 'text:', (t.textContent || '').trim().slice(0, 30));

  // Tab rename/remove (before tab switch so buttons inside .tab don't trigger switch)
  const renameBtn = t.closest('.tab-rename');
  if (renameBtn) { console.log('[CLICK] -> TAB rename'); openRenameModal(parseInt(renameBtn.dataset.index), State.courses[parseInt(renameBtn.dataset.index)].name); return; }
  const removeBtn = t.closest('.tab-remove');
  if (removeBtn) { console.log('[CLICK] -> TAB remove'); openRemoveModal(parseInt(removeBtn.dataset.index)); return; }

  // Tab switch
  const tab = t.closest('.tab:not(.tab-add)');
  if (tab && tab.dataset.index !== undefined) {
    console.log('[CLICK] -> TAB switch index:', tab.dataset.index);
    State.activeIndex = parseInt(tab.dataset.index);
    State.save();
    Render.all();
    return;
  }
  if (t.closest('#tab-add')) { console.log('[CLICK] -> TAB add'); State.addCourse(); saveAndToast(); Render.all(); return; }

  // Header
  if (t.closest('#presets-btn')) { console.log('[CLICK] -> PRESETS'); openPresetModal(); return; }
  if (t.closest('#formula-btn')) { console.log('[CLICK] -> FORMULA'); openFormulaModal(); return; }
  if (t.closest('#whatif-btn')) { console.log('[CLICK] -> WHAT-IF'); openWhatIfModal(); return; }
  if (t.closest('#pdf-btn')) { console.log('[CLICK] -> PDF'); openPDFModal(); return; }
  if (t.closest('#export-btn')) { console.log('[CLICK] -> EXPORT'); Export.json(); return; }
  if (t.closest('[for="import-file"]')) { console.log('[CLICK] -> IMPORT'); document.getElementById('import-file')?.click(); return; }

  // System choice cards
  const sysOpt = t.closest('.system-option');
  if (sysOpt) {
    const sys = sysOpt.dataset.system;
    if (sys) {
      State.updateCourse(c => { c.system = sys; });
      saveAndToast();
      Render.courseContent();
    }
    return;
  }

  // Eye reveal
  if (t.closest('#eye-btn')) { console.log('[CLICK] -> EYE REVEAL'); revealGrades(); return; }

  // Calc section toggle
  if (t.closest('#calc-toggle, .calc-header')) {
    console.log('[CLICK] -> CALC TOGGLE');
    const sect = document.getElementById('calc-section');
    if (sect) {
      const expanded = sect.getAttribute('aria-expanded') !== 'false';
      sect.setAttribute('aria-expanded', String(!expanded));
      const c = State.course;
      if (c) { c._calcExpanded = !expanded; State.save(); }
    }
    return;
  }

  // Delete component
  const compRm = t.closest('.comp-remove');
  if (compRm) {
    console.log('[CLICK] -> COMP-REMOVE term:', compRm.dataset.term, 'ci:', compRm.dataset.ci);
    const term = compRm.dataset.term;
    const ci = parseInt(compRm.dataset.ci);
    const c = State.course;
    if (!c) return;
    const termObj = term === 'midterm' ? c.midterm : c.finals;
    if (!termObj || !termObj.components[ci]) return;
    const comp = termObj.components[ci];
    if (comp.type === 'major') { showToast('Cannot remove major exam', '', 2000); return; }
    if (comp.type === 'quiz') {
      if (comp.items.length <= 1) { showToast('Course requires at least 1 quiz', '', 2000); return; }
      comp.items.pop();
      saveAndToast();
      Render.courseContent();
      debouncedRecalc();
      return;
    }
    termObj.components.splice(ci, 1);
    saveAndToast();
    Render.courseContent();
    debouncedRecalc();
    return;
  }

  // Add item in component
  const addItem = t.closest('.add-item-btn');
  if (addItem) {
    console.log('[CLICK] -> ADD-ITEM term:', addItem.dataset.term, 'ci:', addItem.dataset.ci);
    const term = addItem.dataset.term;
    const ci = parseInt(addItem.dataset.ci);
    const c = State.course;
    if (!c) { console.log('[CLICK]   NO COURSE'); return; }
    const termObj = term === 'midterm' ? c.midterm : c.finals;
    if (!termObj || !termObj.components[ci]) { console.log('[CLICK]   NO TERM/COMP'); return; }
    const comp = termObj.components[ci];
    const nextNum = comp.items.length + 1;
    const newItem = {
      label: comp.type === 'quiz' ? `Quiz ${nextNum}` : '',
      earned: '', max: '100', passing: '50'
    };
    comp.items.push(newItem);
    comp._expanded = true;
    console.log('[CLICK]   items now:', comp.items.length);
    saveAndToast();
    Render.courseContent();
    debouncedRecalc();
    return;
  }

  // Add other component (grouped section)
  const addOther = t.closest('.add-other-btn');
  if (addOther) {
    console.log('[CLICK] -> ADD-OTHER term:', addOther.dataset.term);
    const term = addOther.dataset.term;
    const c = State.course;
    if (!c) return;
    const termObj = term === 'midterm' ? c.midterm : c.finals;
    if (!termObj) return;
    const nth = termObj.components.filter(g => g.type === 'other').length + 1;
    const comp = { type: 'other', label: `Other ${nth}`, items: [{ label: `Other ${nth}`, earned: '', max: '100', weight: 10 }] };
    termObj.components.push(comp);
    distributeOtherWeights(termObj);
    saveAndToast();
    Render.courseContent();
    debouncedRecalc();
    return;
  }

  // Remove last other component
  const rmOther = t.closest('.remove-other-btn');
  if (rmOther) {
    console.log('[CLICK] -> REMOVE-OTHER term:', rmOther.dataset.term);
    const term = rmOther.dataset.term;
    const c = State.course;
    if (!c) return;
    const termObj = term === 'midterm' ? c.midterm : c.finals;
    if (!termObj) return;
    const otherIndices = termObj.components.map((comp, i) => comp.type === 'other' ? i : -1).filter(i => i >= 0);
    if (otherIndices.length === 0) return;
    termObj.components.splice(otherIndices[otherIndices.length - 1], 1);
    distributeOtherWeights(termObj);
    saveAndToast();
    Render.courseContent();
    debouncedRecalc();
    return;
  }

  // Collapse/expand
  const chevron = t.closest('.comp-chevron, .comp-header');
  if (chevron) {
    console.log('[CLICK] -> COLLAPSE/EXPAND');
    const section = chevron.closest('.comp-group');
    if (section) {
      const expanded = section.getAttribute('aria-expanded') !== 'true';
      section.setAttribute('aria-expanded', String(expanded));
      const c = State.course;
      if (!c) return;
      const term = section.dataset.term;
      const ci = section.dataset.ci;
      if (ci !== undefined && term) {
        const termObj = term === 'midterm' ? c.midterm : c.finals;
        if (termObj?.components[ci]) {
          termObj.components[ci]._expanded = expanded;
          State.save();
        }
      }
      if (section.classList.contains('comp-group-other')) {
        const termObj = term === 'midterm' ? c.midterm : c.finals;
        if (termObj) { termObj._otherExpanded = expanded; State.save(); }
      }
    }
    return;
  }

  // Add component to term
  const addComp = t.closest('.term-add-comp');
  if (addComp) {
    console.log('[CLICK] -> TERM-ADD-COMP term:', addComp.dataset.term, 'type:', addComp.dataset.type);
    const term = addComp.dataset.term;
    const type = addComp.dataset.type;
    const c = State.course;
    if (!c) { console.log('[CLICK]   NO COURSE'); return; }
    const termObj = term === 'midterm' ? c.midterm : c.finals;
    if (!termObj) { console.log('[CLICK]   NO TERM OBJ'); return; }
    const labels = { quiz: 'Quizzes', major: 'Exam', other: 'Other Components' };
    if (type === 'other') {
      const nth = termObj.components.filter(g => g.type === 'other').length + 1;
      comp = { type, label: `Other ${nth}`, items: [{ label: `Other ${nth}`, earned: '', max: '100', weight: 10 }] };
      termObj.components.push(comp);
      distributeOtherWeights(termObj);
    } else {
      let comp = termObj.components.find(g => g.type === type);
      if (!comp) {
        console.log('[CLICK]   creating new component group');
        comp = { type, label: labels[type] || type, items: [] };
        termObj.components.push(comp);
      }
      const nextNum = comp.items.length + 1;
      const newItem = {
        label: type === 'quiz' ? `Quiz ${nextNum}` : '',
        earned: '', max: '100'
      };
      if (type !== 'major') newItem.passing = '50';
      comp.items.push(newItem);
    }
    comp._expanded = true;
    console.log('[CLICK]   items now:', comp.items.length);
    saveAndToast();
    Render.courseContent();
    debouncedRecalc();
    return;
  }

  // Remove item
  const rmBtn = t.closest('.remove-btn');
  if (rmBtn) {
    console.log('[CLICK] -> REMOVE term:', rmBtn.dataset.term, 'ci:', rmBtn.dataset.ci, 'ii:', rmBtn.dataset.ii);
    const term = rmBtn.dataset.term;
    const ci = parseInt(rmBtn.dataset.ci);
    const ii = parseInt(rmBtn.dataset.ii);
    const c = State.course;
    if (!c) { console.log('[CLICK]   NO COURSE'); return; }
    const termObj = term === 'midterm' ? c.midterm : c.finals;
    if (!termObj || !termObj.components[ci]) { console.log('[CLICK]   NO TERM/COMP'); return; }
    if (termObj.components[ci].items.length <= 1) {
      console.log('[CLICK]   LAST ITEM - removing component');
      termObj.components.splice(ci, 1);
      saveAndToast();
      Render.courseContent();
      debouncedRecalc();
      return;
    }
    const row = rmBtn.closest('.comp-row');
    if (row) row.classList.add('row-exit');
    setTimeout(() => {
      termObj.components[ci].items.splice(ii, 1);
      console.log('[CLICK]   removed, items now:', termObj.components[ci].items.length);
      saveAndToast();
      Render.courseContent();
      debouncedRecalc();
    }, 200);
    return;
  }

  // Modal close
  if (t.closest('.modal-close') || t.classList.contains('modal-backdrop')) {
    console.log('[CLICK] -> MODAL CLOSE');
    Modal.close(t.closest('.modal-backdrop'));
    return;
  }
  console.log('[CLICK] -> UNMATCHED target:', t.className);
}

// ===== Input Handler =====
function handleInput(e) {
  const input = e.target.closest('input, select');
  if (!input) { console.log('[INPUT] no input found'); return; }

  console.log('[INPUT] id:', input.id, 'val:', input.dataset.val, 'term:', input.dataset.term, 'ci:', input.dataset.ci, 'ii:', input.dataset.ii, 'weight:', input.dataset.weight, 'termweight:', input.dataset.termweight);

  // System selector
  if (input.id === 'system-select') {
    console.log('[INPUT] -> system select:', input.value);
    State.updateCourse(c => { c.system = input.value; });
    saveAndToast();
    Render.courseContent();
    return;
  }

  // Passing target
  if (input.id === 'passing-target') {
    const v = parseFloat(input.value);
    if (!isNaN(v) && v >= 0 && v <= 100) {
      State.updateCourse(c => { c.passingTarget = v; });
      debouncedRecalc();
    }
    return;
  }

  // Shared component weight (quiz, major)
  if (input.classList.contains('comp-weight-input')) {
    const type = input.dataset.weight;
    const v = parseFloat(input.value);
    if (type && !isNaN(v) && v >= 0 && v <= 100) {
      State.updateCourse(c => {
        if (!c.compWeights) c.compWeights = {};
        c.compWeights[type] = v;
      });
      const c = State.course;
      if (c?.midterm) distributeOtherWeights(c.midterm);
      if (c?.finals) distributeOtherWeights(c.finals);
      clearTimeout(window._weightTimer);
      window._weightTimer = setTimeout(() => {
        Render.courseContent();
        debouncedRecalc();
      }, 200);
    }
    return;
  }

  // Term weight (midterm, finals)
  if (input.classList.contains('term-weight-input')) {
    const termKey = input.dataset.termweight;
    const v = parseFloat(input.value);
    if (termKey && !isNaN(v) && v >= 0 && v <= 100) {
      State.updateCourse(c => {
        if (!c.termWeights) c.termWeights = { midterm: 50, finals: 50 };
        c.termWeights[termKey] = v;
      });
      clearTimeout(window._weightTimer);
      window._weightTimer = setTimeout(() => {
        Render.courseContent();
        debouncedRecalc();
      }, 200);
    }
    return;
  }

  // Item weight (for other type items)
  if (input.classList.contains('item-weight-input')) {
    const v = parseFloat(input.value);
    const val = input.dataset.val;
    if (val === 'weight' && !isNaN(v) && v >= 0) {
      const term = input.dataset.term;
      const ci = parseInt(input.dataset.ci);
      const ii = parseInt(input.dataset.ii);
      const c = State.course;
      const termObj = term === 'midterm' ? c?.midterm : c?.finals;
      if (termObj && termObj.components[ci] && termObj.components[ci].items[ii]) {
        termObj.components[ci].items[ii].weight = v;
        State.save();
        debouncedRecalc();
      }
    }
    return;
  }

  const term = input.dataset.term;
  const ci = input.dataset.ci;
  const ii = input.dataset.ii;
  const val = input.dataset.val;
  const uid = input.dataset.uid;
  if (term && ci !== undefined && ii !== undefined && val) {
    const c = State.course;
    const termObj = term === 'midterm' ? c?.midterm : c?.finals;
    if (!termObj || !termObj.components[ci] || !termObj.components[ci].items[ii]) return;
    const item = termObj.components[ci].items[ii];
    item[val] = input.value;

    clearTimeout(input._valTimer);
    input._valTimer = setTimeout(() => {
      Validator.reset();
      Validator.score(item.earned, item.max, item.passing, uid);
      if (val === 'earned' || val === 'max' || val === 'passing') Validator.clearField(uid, val);
      Validator.show();
    }, 400);

    State.save();
    debouncedRecalc();

    const isOther = termObj.components[ci].type === 'other';
    if (val === 'earned' && !isOther) {
      const v = input.value.trim();
      const meets = v.length >= 2 && parseFloat(v) >= 50;
      if (!meets) {
        input._ebShown = false;
      } else if (!input._ebShown) {
        const score = parseFloat(v);
        if (!isNaN(score) && score >= 50) {
          input._ebShown = true;
          console.log('[INPUT] earned >= 50, playing vine sfx + eyebrow');
          try { new Audio(VINE_SFX).play(); } catch {}
          showEyebrowPopup(score);
        }
      }
    } else {
      input._ebShown = false;
    }
  }
}

function showEyebrowPopup(score) {
  if (!EYEBROW_IMGS || !EYEBROW_IMGS.length) return;
  try {
    const idx = Math.floor(Math.random() * EYEBROW_IMGS.length);
    const w = 80 + (score - 50) * 7;
    const l = 5 + Math.random() * 65;
    const t = 5 + Math.random() * 40;
    const rot = (Math.random() - 0.5) * 90;

    const el = document.createElement('div');
    el.className = 'eyebrow-popup';
    el.style.left = l + 'vw';
    el.style.top = t + 'vh';
    el.style.width = w + 'px';
    el.style.transform = 'rotate(' + rot + 'deg)';
    el.innerHTML = '<img src="' + EYEBROW_IMGS[idx] + '" alt="">';
    document.body.appendChild(el);

    setTimeout(() => {
      el.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], { duration: 400, easing: 'ease', fill: 'forwards' });
      setTimeout(() => el.remove(), 450);
    }, 1200);
  } catch (e) { console.log('[EYEBROW] error:', e); }
}

function handleChange(e) {
  if (e.target.id === 'import-file') {
    if (e.target.files[0]) Export.importJson(e.target.files[0]);
    e.target.value = '';
  }
}

function handleKeydown(e) {
  if (e.key === 'Escape') { Modal.closeTop(); return; }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    const input = e.target.closest('input');
    if (input) {
      const row = input.closest('.comp-row');
      if (row) {
        const inputs = row.querySelectorAll('input:not([readonly])');
        const idx = Array.from(inputs).indexOf(input);
        if (idx < inputs.length - 1) { inputs[idx + 1].focus(); return; }
        const section = row.closest('.comp-group');
        if (section) {
          const addBtn = section.querySelector('.add-item-btn, .add-other-btn');
          if (addBtn) { addBtn.click(); return; }
        }
      }
    }
  }
  if (e.key === 'Enter' && document.getElementById('rename-input')) {
    document.getElementById('rename-confirm')?.click(); return;
  }
}

// ===== Modals =====
function openPresetModal() {
  const presets = State.presets;
  const html = `
    <div class="modal-header">
      <h2 class="modal-title">Syllabus Presets</h2>
      <button class="modal-close" aria-label="Close">${ICONS.x}</button>
    </div>
    <div class="modal-body">
      <p style="font-size:13px;margin-bottom:14px;color:var(--text-secondary);">Save or load a grading setup.</p>
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        <input type="text" id="preset-name" placeholder="e.g. Engineering Syllabus" style="flex:1;background:var(--bg);border:1px solid var(--border);padding:8px 12px;border-radius:var(--radius-sm);font-size:13px;">
        <button class="btn btn-primary" id="preset-save">${ICONS.save} Save</button>
      </div>
      <ul class="preset-list">
        ${presets.length === 0 ? '<li style="color:var(--text-tertiary);padding:12px;text-align:center;">No saved presets yet.</li>' : ''}
        ${presets.map(p => `
          <li class="preset-item">
            <span class="preset-item-name">${esc(p.name)}</span>
            <span class="preset-item-actions">
              <button class="btn btn-sm btn-ghost preset-load" data-id="${p.id}">Load</button>
              <button class="btn btn-sm btn-ghost preset-rename" data-id="${p.id}">${ICONS.edit}</button>
              <button class="btn btn-sm btn-ghost preset-delete" data-id="${p.id}" style="color:var(--red);">${ICONS.trash}</button>
            </span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
  Modal.open('preset-modal', html);
  document.getElementById('preset-save')?.addEventListener('click', () => {
    const name = document.getElementById('preset-name')?.value.trim();
    if (name && State.course) { State.addPreset(name); showToast('Saved', 'green'); openPresetModal(); }
  });
  document.querySelectorAll('.preset-load').forEach(b => {
    b.addEventListener('click', () => { State.applyPreset(b.dataset.id); showToast('Loaded', 'green'); Modal.closeTop(); Render.all(); });
  });
  document.querySelectorAll('.preset-rename').forEach(b => {
    b.addEventListener('click', () => {
      const name = prompt('Rename preset:');
      if (name && name.trim()) { State.renamePreset(b.dataset.id, name.trim()); showToast('Renamed', 'green'); openPresetModal(); }
    });
  });
  document.querySelectorAll('.preset-delete').forEach(b => {
    b.addEventListener('click', () => {
      if (confirm('Delete this preset?')) { State.removePreset(b.dataset.id); openPresetModal(); }
    });
  });
}

function openFormulaModal() {
  const c = State.course;
  if (!c) return;
  let stepsHtml = '';
  const cw = c.compWeights || {};
  const showFormula = c.system !== 'zero';
  const pt = (c.passingTarget || 50) / 100;
  const r1 = (pt * 100).toFixed(0);
  const r2 = ((1 - pt) * 100).toFixed(0);
  const allComps = [...(c.midterm?.components || []), ...(c.finals?.components || [])];

  const formulaLatex = showFormula
    ? `\\text{Grade} = \\left[\\frac{\\text{Score}}{\\text{Max}}\\right] \\times ${r1} + ${r2}`
    : `\\text{Grade} = \\frac{\\text{Score}}{\\text{Max}} \\times 100`;

  allComps.forEach(comp => {
    if (!comp.items) return;
    comp.items.forEach((item, idx) => {
      if (item.earned === '' || item.max === '') return;
      const e = parseFloat(item.earned) || 0;
      const m = parseFloat(item.max) || 1;
      const ratio = e / m;
      const pct = (ratio * 100).toFixed(2);
      let label, result;
      if (comp.type === 'other') {
        const iw = parseFloat(item.weight) || 0;
        result = (ratio * iw).toFixed(2);
        label = `${esc(comp.label)} — ${item.label || `Item ${idx + 1}`}: ${e} / ${m} (weight: ${iw}%)`;
        stepsHtml += `
          <div class="step-row">
            <div class="step-label">${label}</div>
            <div class="katex-render">${pct}\\% \\times ${iw} = ${result}\\;\\text{pts}</div>
          </div>
        `;
      } else {
        const w = cw[comp.type] || 0;
        const wDec = (w / 100).toFixed(2);
        if (showFormula) {
          const inner = ratio * pt + (1 - pt);
          const iPct = (inner * 100).toFixed(2);
          result = (inner * w).toFixed(2);
          label = `${esc(comp.label)} — ${item.label || `Item ${idx + 1}`}: ${e} / ${m}`;
          stepsHtml += `
            <div class="step-row">
              <div class="step-label">${label}</div>
              <div class="katex-render">${pct}\\% \\rightarrow \\left[${pct}\\%\\right] \\times ${r1} + ${r2} = ${iPct}\\%</div>
              <div class="katex-render">${iPct}\\% \\times ${wDec} = ${result}\\;\\text{pts}</div>
            </div>
          `;
        } else {
          result = (ratio * w).toFixed(2);
          label = `${esc(comp.label)} — ${item.label || `Item ${idx + 1}`}: ${e} / ${m}`;
          stepsHtml += `
            <div class="step-row">
              <div class="step-label">${label}</div>
              <div class="katex-render">${pct}\\% \\times ${wDec} = ${result}\\;\\text{pts}</div>
            </div>
          `;
        }
      }
    });
  });
  if (!stepsHtml) stepsHtml = '<p style="color:var(--text-tertiary);text-align:center;padding:20px 0;">Enter scores to see the formula.</p>';

  const html = `
    <div class="modal-header">
      <h2 class="modal-title">Formula Breakdown</h2>
      <button class="modal-close" aria-label="Close">${ICONS.x}</button>
    </div>
    <div class="modal-body">
      <div class="step-row">
        <div class="step-label">Formula</div>
        <div class="katex-render" style="font-size:16px;">${formulaLatex}</div>
      </div>
      ${stepsHtml}
    </div>
  `;
  Modal.open('formula-modal', html);
  document.getElementById('formula-modal')?.classList.add('modal-wide');
  renderKatex();
}

function openWhatIfModal() {
  const c = State.course;
  if (!c) return;
  const { midterm, finals } = Calc.courseAverages(c);
  const tw = c.termWeights || { midterm: 50, finals: 50 };
  const mw = tw.midterm / 100;
  const fw = tw.finals / 100;

  let html = `
    <div class="modal-header">
      <h2 class="modal-title">What-If Simulator</h2>
      <button class="modal-close" aria-label="Close">${ICONS.x}</button>
    </div>
    <div class="modal-body">
      <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">
        Current midterm: <strong style="color:var(--text)">${typeof fmtPct === 'function' ? fmtPct(midterm) : midterm.toFixed(2)}%</strong> &nbsp;|&nbsp;
        Current finals: <strong style="color:var(--text)">${typeof fmtPct === 'function' ? fmtPct(finals) : finals.toFixed(2)}%</strong>
      </p>
      <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">
        Weights: midterm <strong>${tw.midterm}%</strong> + finals <strong>${tw.finals}%</strong>
      </p>
      <div class="field" style="margin-bottom:16px;">
        <label for="whatif-target">Target Final Grade (%)</label>
        <input type="number" id="whatif-target" min="0" max="100" step="0.1" value="75" style="width:120px;">
      </div>
      <div id="whatif-result" style="padding:14px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);font-size:13px;min-height:40px;">Enter a target grade to calculate.</div>
    </div>
  `;
  Modal.open('whatif-modal', html);
  document.getElementById('whatif-target')?.addEventListener('input', function () {
    const target = parseFloat(this.value);
    const res = document.getElementById('whatif-result');
    if (isNaN(target) || target < 0 || target > 100) {
      res.innerHTML = '<span style="color:var(--text-tertiary);">Enter a value between 0 and 100.</span>';
      return;
    }
    const needed = (target - midterm * mw) / fw;
    const fm = typeof fmtPct === 'function' ? fmtPct : v => v.toFixed(2);
    if (needed > 100) {
      res.innerHTML = `
        <span style="color:var(--red);font-weight:600;">Unreachable.</span><br>
        <span style="color:var(--text-secondary);">You'd need ${fm(needed)}% on finals, which exceeds 100%.</span><br>
        <span style="color:var(--text-secondary);">Try lowering your target or improving your midterm.</span>
      `;
    } else if (needed < 0) {
      res.innerHTML = `
        <span style="color:var(--green);font-weight:600;">Already achieved!</span><br>
        <span style="color:var(--text-secondary);">Your midterm (${fm(midterm)}%) alone is enough to reach ${target}%.</span>
      `;
    } else {
      const colorClass = needed >= 75 ? 'score-green' : needed >= 50 ? 'score-yellow' : 'score-red';
      const effective = midterm * mw + needed * fw;
      res.innerHTML = `
        <div style="margin-bottom:8px;">
          <span style="font-weight:600;">You need <span class="${colorClass}" style="font-size:18px;">${fm(needed)}%</span> on finals</span>
        </div>
        <div style="color:var(--text-secondary);font-size:12px;">
          ${fm(midterm)}% × ${tw.midterm}% + ${fm(needed)}% × ${tw.finals}% = ${fm(effective)}%
        </div>
      `;
    }
  });
}

function renderKatex() {
  if (typeof katex === 'undefined') { setTimeout(renderKatex, 300); return; }
  document.querySelectorAll('.katex-render').forEach(el => {
    const display = el.dataset.display !== 'false';
    let src = el.textContent.replace(/[\u00a0\u2000-\u200f\u202f\u2060\ufeff]/g, ' ').trim();
    try { katex.render(src, el, { displayMode: display, throwOnError: false }); }
    catch (err) { el.textContent = 'Render error'; }
  });
}

function openPDFModal() {
  const html = `
    <div class="modal-header">
      <h2 class="modal-title">Generate PDF Report</h2>
      <button class="modal-close" aria-label="Close">${ICONS.x}</button>
    </div>
    <div class="modal-body">
      <p style="margin-bottom:16px;color:var(--text-secondary);">Report for <strong style="color:var(--text)">${esc(State.course?.name || 'current course')}</strong></p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline modal-close">Cancel</button>
      <button class="btn btn-green" id="pdf-generate">${ICONS.download} Generate PDF</button>
    </div>
  `;
  Modal.open('pdf-modal', html);
  document.getElementById('pdf-generate')?.addEventListener('click', () => {
    Export.pdf(); Modal.closeTop(); showToast('PDF generated', 'green');
  });
}

// ===== Auto-label empty quiz items =====
document.addEventListener('focusout', (e) => {
  const input = e.target.closest('input[data-val="label"]');
  if (!input || input.value.trim()) return;
  const term = input.dataset.term;
  const ci = parseInt(input.dataset.ci);
  const ii = parseInt(input.dataset.ii);
  const c = State.course;
  if (!c) return;
  const termObj = term === 'midterm' ? c.midterm : c.finals;
  const comp = termObj?.components[ci];
  if (!comp || comp.type !== 'quiz') return;
  const label = `Quiz ${ii + 1}`;
  input.value = label;
  comp.items[ii].label = label;
  State.save();
  showSaved();
});

// ===== Tab Context Menu =====
function handleContextMenu(e) {
  const tab = e.target.closest('.tab:not(.tab-add)');
  if (!tab) return;
  e.preventDefault();
  const idx = parseInt(tab.dataset.index);
  const existing = document.querySelector('.tab-context-menu');
  if (existing) existing.remove();
  const menu = document.createElement('div');
  menu.className = 'tab-context-menu';
  menu.style.left = Math.min(e.clientX, window.innerWidth - 140) + 'px';
  menu.style.top = e.clientY + 'px';
  menu.innerHTML = '<button data-action="rename">Rename</button><button data-action="remove">Remove</button>';
  menu.querySelector('[data-action="rename"]').onclick = () => { menu.remove(); openRenameModal(idx, State.courses[idx].name); };
  menu.querySelector('[data-action="remove"]').onclick = () => { menu.remove(); openRemoveModal(idx); };
  document.body.appendChild(menu);
  setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 0);
}

// ===== Console Helpers =====
Object.defineProperty(window, 'autocomplete', {
  get() {
    console.log('[AUTO] Filling all scores with random values...');
    const c = State.course;
    if (!c) { console.log('[AUTO] No course'); return; }
    ['midterm', 'finals'].forEach(tk => {
      (c[tk]?.components || []).forEach(comp => {
        (comp.items || []).forEach(item => {
          const max = parseFloat(item.max) || 100;
          const min = Math.max(1, Math.round(max * 0.5));
          item.earned = Math.floor(Math.random() * (max - min + 1) + min);
        });
      });
    });
    State.save();
    Render.courseContent();
    debouncedRecalc();
    console.log('[AUTO] Done');
  },
  configurable: true
});

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('[INIT] DOM ready');
  console.log('[INIT] State:', !!window.State, 'Calc:', !!window.Calc, 'Render:', !!window.Render);
  console.log('[INIT] Modal:', !!window.Modal, 'Export:', !!window.Export, 'Validator:', !!window.Validator);
  console.log('[INIT] ICONS:', typeof ICONS, 'REVEAL_SOUND:', typeof REVEAL_SOUND, 'VINE_SFX:', typeof VINE_SFX);
  console.log('[INIT] EYEBROW_IMGS:', typeof EYEBROW_IMGS, 'defined:', typeof EYEBROW_IMGS !== 'undefined');
  State.load();
  console.log('[INIT] courses:', State.courses.length, 'active:', State.activeIndex);
  Render.all();
  document.addEventListener('click', handleClick);
  document.addEventListener('input', handleInput);
  document.addEventListener('change', handleChange);
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('contextmenu', handleContextMenu);
  console.log('[INIT] event listeners attached');
});
