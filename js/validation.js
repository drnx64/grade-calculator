const Validator = {
  errors: [],

  reset() { this.errors = []; },

  score(earned, max, passing, uid) {
    const e = parseFloat(earned);
    const m = parseFloat(max);
    const p = parseFloat(passing);

    if (earned !== '' && (isNaN(e) || e < 0)) {
      this.errors.push({ uid, field: 'earned', msg: 'Score cannot be negative' });
    }
    if (max !== '' && (isNaN(m) || m <= 0)) {
      this.errors.push({ uid, field: 'max', msg: 'Max must be greater than 0' });
    }
    if (earned !== '' && max !== '' && !isNaN(e) && !isNaN(m) && e > m) {
      this.errors.push({ uid, field: 'earned', msg: 'Earned score cannot exceed max' });
    }
    if (passing !== '' && (isNaN(p) || p < 0 || p > 100)) {
      this.errors.push({ uid, field: 'passing', msg: 'Passing target must be 0–100' });
    }
  },

  hasErrors() { return this.errors.length > 0; },

  show() {
    this.errors.forEach(err => {
      const input = document.querySelector(`[data-uid="${err.uid}"][data-val="${err.field}"]`);
      if (!input) return;
      input.classList.add('input--error', 'input--shake');
      setTimeout(() => input.classList.remove('input--shake'), 300);
      const errEl = document.getElementById(`err-${err.uid}-${err.field}`);
      if (errEl) {
        errEl.textContent = err.msg;
        errEl.classList.add('visible');
      }
    });
  },

  clearField(uid, field) {
    const input = document.querySelector(`[data-uid="${uid}"][data-val="${field}"]`);
    if (input) input.classList.remove('input--error');
    const errEl = document.getElementById(`err-${uid}-${field}`);
    if (errEl) errEl.classList.remove('visible');
  },

  clearAll() {
    document.querySelectorAll('.input--error').forEach(el => el.classList.remove('input--error'));
    document.querySelectorAll('.field-error.visible').forEach(el => el.classList.remove('visible'));
  }
};

window.Validator = Validator;
