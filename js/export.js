const Export = {
  pdf() {
    if (typeof jspdf === 'undefined') { alert('PDF library not loaded'); return; }
    const c = State.course;
    if (!c) return;
    const cw = c.compWeights || {};
    const tw = c.termWeights || { midterm: 50, finals: 50 };
    const { midterm, finals } = Calc.courseAverages(c);
    const fg = Calc.finalGrade(midterm, finals, c.termWeights);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const M = 20, W = 210 - 2 * M;
    const primary = [124, 108, 240];
    const dark = [241, 245, 249];
    const gray = [100, 116, 139];

    doc.setFillColor(...primary);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Grade Report', M, 26);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, M, 35);

    doc.setTextColor(...dark);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const name = c.name || 'Untitled Course';
    doc.text(name, M, 56);

    doc.setDrawColor(...primary);
    doc.setLineWidth(0.5);
    doc.line(M, 62, 210 - M, 62);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    const sysLabel = c.system === 'zero' ? 'Zero-Based' : 'Transmuted';
    doc.text(`Grading: ${sysLabel}`, M, 74);
    doc.text(`Weights: ${tw.midterm}% Midterm / ${tw.finals}% Finals`, M, 82);

    function stripLatex(s) {
      return s
        .replace(/\\dfrac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
        .replace(/\\boxed\{([^}]+)\}/g, '[$1]')
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .replace(/\\left\[/g, '[')
        .replace(/\\right\]/g, ']')
        .replace(/\\times/g, '\u00D7')
        .replace(/\\%/g, '%')
        .replace(/\\;/g, ' ')
        .replace(/\\,|\\:/g, '')
        .replace(/\\(.)/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function writeTerm(name, termObj, startY) {
      let y = startY;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...dark);
      doc.text(name, M, y); y += 8;
      (termObj.components || []).forEach(comp => {
        if (!comp.items || comp.items.length === 0) return;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primary);
        const pct = comp.type === 'other' ? '' : ` (${cw[comp.type] || 0}%)`;
        doc.text(comp.label + pct, M, y); y += 6;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...dark);
        const result = Calc.componentScore(comp, cw, c.system, c.passingTarget);
        comp.items.forEach((item, i) => {
          if (item.earned === '' || item.max === '') return;
          doc.text(`  #${i + 1}: ${item.earned}/${item.max}`, M + 4, y);
          y += 5;
        });
        doc.text(`  Score: ${result.score.toFixed(2)} / ${result.max}`, M + 4, y);
        y += 5;
        // Solution steps
        const steps = Calc.componentSteps(comp, cw, c.system, c.passingTarget);
        doc.setTextColor(...gray);
        steps.forEach(s => {
          if (y > 265) { doc.addPage(); y = 30; }
          doc.text(`  ${stripLatex(s.text)}`, M + 4, y);
          y += 4;
        });
        doc.setTextColor(...dark);
        y += 3;
      });
      return y;
    }

    function computeTermTotal(comps) {
      let pts = 0, max = 0;
      (comps || []).forEach(comp => {
        const r = Calc.componentScore(comp, cw, c.system, c.passingTarget);
        pts += r.score; max += r.max;
      });
      return { pts, max };
    }

    let y = 96;
    y = writeTerm('Midterm', c.midterm, y);
    const mt = computeTermTotal(c.midterm?.components);
    if (y > 260) { doc.addPage(); y = 30; }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gray);
    doc.text(`Midterm total: ${fmtPct(mt.pts)} / ${mt.max} = ${mt.max > 0 ? fmtPct(mt.pts / mt.max * 100) : '0'}%`, M, y); y += 6;

    y = writeTerm('Finals', c.finals, y);
    const ft = computeTermTotal(c.finals?.components);
    if (y > 260) { doc.addPage(); y = 30; }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gray);
    doc.text(`Finals total: ${fmtPct(ft.pts)} / ${ft.max} = ${ft.max > 0 ? fmtPct(ft.pts / ft.max * 100) : '0'}%`, M, y); y += 8;

    if (y > 230) y = 230;
    doc.setDrawColor(...primary);
    doc.setLineWidth(0.5);
    doc.line(M, y, 210 - M, y); y += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...dark);
    doc.text('Grade Summary', M, y); y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...dark);
    doc.text(`Midterm: ${fmtPct(midterm)}%`, M, y); y += 6;
    doc.text(`Finals: ${fmtPct(finals)}%`, M, y); y += 6;
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    const fgFormula = `${fmtPct(midterm)}% × ${tw.midterm}% + ${fmtPct(finals)}% × ${tw.finals}%`;
    doc.text(`Formula: ${fgFormula}`, M, y); y += 4;
    const fgCalc = `${fmtPct(midterm * tw.midterm / 100)} + ${fmtPct(finals * tw.finals / 100)} = ${Calc.roundWhole(fg)}%`;
    doc.text(`= ${fgCalc}`, M, y); y += 6;
    doc.setDrawColor(...primary);
    doc.setLineWidth(0.5);
    doc.line(M, y, 210 - M, y); y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...primary);
    doc.text(`Final Grade: ${Calc.roundWhole(fg)}%`, M, y);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text('Grade Calculator', M, 285);
    doc.text(new Date().toISOString().split('T')[0], 210 - M - 30, 285, { align: 'right' });
    doc.save(`${name.replace(/\s+/g, '_')}_report.pdf`);
  },

  json() {
    const data = State.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grade_calculator_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importJson(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        State.importAll(JSON.parse(e.target.result));
        Render.all();
      } catch (err) {
        alert(`Import failed: ${err.message}`);
      }
    };
    reader.onerror = () => alert('Failed to read file.');
    reader.readAsText(file);
  }
};

window.Export = Export;
