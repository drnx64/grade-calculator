const Calc = {
  /* Score for a component group — returns { score, max } */
  componentScore(comp, compWeights, system, passingTarget) {
    passingTarget = comp.passingTarget ?? passingTarget;
    const items = comp.items || [];
    if (comp.type === 'other') {
      let totalScore = 0, totalMax = 0;
      items.forEach(item => {
        if (item.earned === '' || item.max === '') return;
        const e = parseFloat(item.earned) || 0;
        const m = parseFloat(item.max) || 1;
        const iw = parseFloat(item.weight) || 0;
        totalScore += (e / m) * iw;
        totalMax += iw;
      });
      return { score: totalScore, max: totalMax };
    }
    // quiz or major: combine items then apply formula
    const w = parseFloat(compWeights?.[comp.type]) || 0;
    const filled = items.filter(it => it.earned !== '' && it.max !== '');
    if (filled.length === 0) return { score: 0, max: w };

    const pts = filled.map(it => (it.passing !== undefined && it.passing !== '' ? parseFloat(it.passing) : passingTarget || 50) / 100);
    if (pts.every(v => v === pts[0])) {
      // all items share same passing target — use aggregate formula
      let sumE = 0, sumM = 0;
      filled.forEach(it => { sumE += parseFloat(it.earned) || 0; sumM += parseFloat(it.max) || 1; });
      const ratio = sumE / sumM;
      const pt = pts[0];
      if (system === 'zero') return { score: ratio * pt * w, max: w };
      return { score: (ratio * pt + (1 - pt)) * w, max: w };
    }
    // different passing targets per item — compute per-item
    const norms = filled.map(it => {
      const e = parseFloat(it.earned) || 0;
      const m = parseFloat(it.max) || 1;
      const pt = (it.passing !== undefined && it.passing !== '' ? parseFloat(it.passing) : passingTarget || 50) / 100;
      const ratio = e / m;
      return system === 'zero' ? ratio * pt : ratio * pt + (1 - pt);
    });
    const avgNorm = norms.reduce((s, v) => s + v, 0) / norms.length;
    return { score: avgNorm * w, max: w };
  },

  /* Term total (sum of component scores) */
  termTotal(components, compWeights, system, passingTarget) {
    if (!components || components.length === 0) return 0;
    let total = 0;
    components.forEach(comp => {
      total += this.componentScore(comp, compWeights, system, passingTarget).score;
    });
    return total;
  },

  /* Term average as percentage (total points out of total possible) */
  termAverage(components, compWeights, system, passingTarget) {
    if (!components || components.length === 0) return 0;
    let totalPts = 0, totalPossible = 0;
    components.forEach(comp => {
      const r = this.componentScore(comp, compWeights, system, passingTarget);
      totalPts += r.score;
      totalPossible += r.max;
    });
    return totalPossible > 0 ? (totalPts / totalPossible) * 100 : 0;
  },

  courseAverages(course) {
    const cw = course.compWeights || {};
    const midAvg = this.termAverage(course.midterm?.components, cw, course.system, course.passingTarget);
    const finAvg = this.termAverage(course.finals?.components, cw, course.system, course.passingTarget);
    return { midterm: midAvg, finals: finAvg };
  },

  finalGrade(midtermAvg, finalAvg, termWeights) {
    const mw = (termWeights?.midterm || 50) / 100;
    const fw = (termWeights?.finals || 50) / 100;
    return (midtermAvg * mw) + (finalAvg * fw);
  },

  round(value, decimals) {
    const f = Math.pow(10, decimals);
    return Math.round(value * f) / f;
  },

  roundWhole(value) {
    return Math.round(value);
  },

  gwa(courses) {
    if (!courses || courses.length === 0) return 0;
    let total = 0;
    courses.forEach(c => {
      const { midterm, finals } = this.courseAverages(c);
      total += this.finalGrade(midterm, finals, c.termWeights);
    });
    return total / courses.length;
  },

  /* Step-by-step solution for a component — returns LaTeX lines */
  componentSteps(comp, compWeights, system, passingTarget) {
    passingTarget = comp.passingTarget ?? passingTarget;
    const out = [];
    if (comp.type === 'other') {
      const items = comp.items || [];
      const scoreParts = [];
      items.forEach((item, i) => {
        if (item.earned === '' || item.max === '') return;
        const e = parseFloat(item.earned) || 0;
        const m = parseFloat(item.max) || 1;
        const iw = parseFloat(item.weight) || 0;
        const ratio = e / m;
        const pts = (ratio * iw).toFixed(2);
        scoreParts.push({ label: escLatex(item.label || 'Item ' + (i + 1)), e, m, iw, pts, ratio });
      });
      if (scoreParts.length === 0) return [{ text: '\\text{No scores entered yet.}', display: false }];
      scoreParts.forEach(sp => {
        out.push({ text: `\\text{${sp.label}:}\\; ${sp.e}/${sp.m} \\times ${sp.iw} = \\boxed{${fmtPct(sp.pts)}}`, display: true });
      });
      const totalPts = scoreParts.reduce((s, p) => s + parseFloat(p.pts), 0);
      const totalMax = scoreParts.reduce((s, p) => s + p.iw, 0);
      out.push({ text: `\\text{Total:}\\; \\boxed{${fmtPct(totalPts)}} / ${totalMax}`, display: true });
      return out;
    }

    // quiz or major
    const filled = (comp.items || []).filter(it => it.earned !== '' && it.max !== '');
    if (filled.length === 0) return [{ text: '\\text{No scores entered yet.}', display: false }];

    const w = parseFloat(compWeights?.[comp.type]) || 0;
    const wDec = (w / 100).toFixed(2);

    // check if all items share the same passing target
    const itemPts = filled.map(it => (it.passing !== undefined && it.passing !== '' ? parseFloat(it.passing) : passingTarget || 50) / 100);
    if (itemPts.every(v => v === itemPts[0])) {
      // same passing — aggregate display
      let sumE = 0, sumM = 0;
      const itemParts = [], earnedParts = [], maxParts = [];
      filled.forEach((item, i) => {
        const e = parseFloat(item.earned) || 0;
        const m = parseFloat(item.max) || 1;
        sumE += e; sumM += m;
        itemParts.push(`${escLatex(item.label || 'Item ' + (i + 1))}\\; ${e}/${m}`);
        earnedParts.push(e);
        maxParts.push(m);
      });
      const eStr = earnedParts.join(' + ');
      const mStr = maxParts.join(' + ');
      const ratio = sumE / sumM;
      const pct = fmtPct(ratio * 100);
      const pt = itemPts[0];
      const ptStr = fmtRatio(pt);
      out.push({ text: `\\text{Items:}\\; ${itemParts.join(', ')}`, display: false });
      out.push({ text: `\\dfrac{${eStr}}{${mStr}} = ${pct}\\%`, display: true });
      if (system === 'zero') {
        const inner = ratio * pt;
        const iPct = fmtPct(inner * 100);
        const ptsVal = fmtPct(inner * w);
        out.push({ text: `\\left(\\dfrac{${eStr}}{${mStr}} \\times ${ptStr}\\right) \\times 100 = ${iPct}\\%`, display: true });
        out.push({ text: `\\left[\\left(\\dfrac{${eStr}}{${mStr}} \\times ${ptStr}\\right) \\times 100\\right] \\times ${wDec} = \\boxed{${ptsVal}}`, display: true });
      } else {
        const offPct = ((1 - pt) * 100).toFixed(0);
        const inner = ratio * pt + (1 - pt);
        const iPct = fmtPct(inner * 100);
        const ptsVal = fmtPct(inner * w);
        out.push({ text: `\\left(\\dfrac{${eStr}}{${mStr}} \\times ${ptStr}\\right) \\times 100 + ${offPct} = ${iPct}\\%`, display: true });
        out.push({ text: `\\left[\\left(\\dfrac{${eStr}}{${mStr}} \\times ${ptStr}\\right) \\times 100 + ${offPct}\\right] \\times ${wDec} = \\boxed{${ptsVal}}`, display: true });
      }
    } else {
      // different passing per item — solve separately
      const iPcts = [];
      filled.forEach((item, i) => {
        const e = parseFloat(item.earned) || 0;
        const m = parseFloat(item.max) || 1;
        const pt = (item.passing !== undefined && item.passing !== '' ? parseFloat(item.passing) : passingTarget || 50) / 100;
        const ptStr = fmtRatio(pt);
        const ratio = e / m;
        const label = escLatex(item.label || 'Item ' + (i + 1));
        if (system === 'zero') {
          const inner = ratio * pt;
          const iPct = fmtPct(inner * 100);
          iPcts.push(inner * 100);
          out.push({ text: `\\text{${label}:}\\; \\left(\\dfrac{${e}}{${m}} \\times ${ptStr}\\right) \\times 100 = ${iPct}\\%`, display: true });
        } else {
          const offPct = ((1 - pt) * 100).toFixed(0);
          const inner = ratio * pt + (1 - pt);
          const iPct = fmtPct(inner * 100);
          iPcts.push(inner * 100);
          out.push({ text: `\\text{${label}:}\\; \\left(\\dfrac{${e}}{${m}} \\times ${ptStr}\\right) \\times 100 + ${offPct} = ${iPct}\\%`, display: true });
        }
      });
      const avgPct = iPcts.reduce((s, v) => s + v, 0) / iPcts.length;
      out.push({ text: `\\text{Average:}\\; \\left(${iPcts.map(v => fmtPct(v)).join(' + ')}\\right) / ${iPcts.length} = ${fmtPct(avgPct)}\\%`, display: true });
      out.push({ text: `${fmtPct(avgPct)}\\% \\times ${wDec} = \\boxed{${fmtPct(avgPct / 100 * w)}}`, display: true });
    }
    return out;
  },

  /* Step-by-step for a full term — returns HTML */
  termSteps(components, compWeights, system, passingTarget, label) {
    if (!components || components.length === 0) return '';
    let html = '';
    let totalPts = 0, totalPossible = 0;
    const parts = [];
    html += `<div class="calc-term-label">${escLatex(label)} TERM</div>`;
    components.forEach((comp) => {
      const cw = compWeights || {};
      const result = this.componentScore(comp, cw, system, passingTarget);
      const steps = this.componentSteps(comp, cw, system, passingTarget);
      totalPts += result.score; totalPossible += result.max;
      parts.push(fmtPct(result.score));
      const pctLabel = comp.type === 'other' ? '' : ` (${cw[comp.type] || 0}\\%)`;
      html += `<div class="calc-comp-name">${escLatex(comp.label)}${pctLabel}</div>`;
      steps.forEach(s => {
        html += `<div class="katex-render calc-line" data-display="${s.display}">${s.text}</div>`;
      });
    });
    const totPct = totalPossible > 0 ? fmtPct(totalPts / totalPossible * 100) : '0';
    html += `<div class="calc-total-line"><div class="katex-render calc-line" data-display="true">${parts.join(' + ')} = \\boxed{${fmtPct(totalPts)}} / ${totalPossible} = \\boxed{${totPct}}\\%</div></div>`;
    return html;
  }
};

function fmtPct(v) {
  const r = Math.round(v * 100) / 100;
  return r % 1 === 0 ? r.toFixed(0) : r.toFixed(2);
}
function fmtRatio(v) {
  if (v === Math.floor(v)) return v.toFixed(0);
  return parseFloat(v.toFixed(4)).toString();
}

function escLatex(s) {
  if (!s) return '';
  return s.replace(/[&$#_{}~^]/g, '').replace(/%/g, '\\%');
}

window.Calc = Calc;