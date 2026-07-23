const Modal = {
  open(id, html, callbacks) {
    let backdrop = document.getElementById(id);
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.id = id;
      backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="${id}-title">${html}</div>`;
      document.body.appendChild(backdrop);
    } else {
      backdrop.querySelector('.modal').innerHTML = html;
    }
    requestAnimationFrame(() => backdrop.classList.add('is-open'));
    this._trapFocus(backdrop);
    this._onCloseCallback = callbacks?.onClose || null;
  },

  close(backdrop) {
    if (!backdrop) return;
    backdrop.classList.remove('is-open');
    if (this._onCloseCallback) this._onCloseCallback();
    this._onCloseCallback = null;
  },

  closeTop() {
    const open = document.querySelector('.modal-backdrop.is-open');
    if (open) this.close(open);
  },

  _trapFocus(backdrop) {
    const focusables = backdrop.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    setTimeout(() => first.focus(), 100);

    const handler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    backdrop.addEventListener('keydown', handler);
    backdrop._focusHandler = handler;
  },

  _releaseFocus(backdrop) {
    if (backdrop._focusHandler) {
      backdrop.removeEventListener('keydown', backdrop._focusHandler);
    }
  }
};

window.Modal = Modal;
