const STORE = {
  COURSES: 'gc_courses',
  ACTIVE: 'gc_active',
  PRESETS: 'gc_presets',
  SETTINGS: 'gc_settings'
};

function makeComponents() {
  return [
    { type: 'quiz', label: 'Quizzes', items: [{ label: 'Quiz 1', earned: '', max: '100', passing: '50' }] },
    { type: 'major', label: 'Exam', items: [{ label: 'Exam', earned: '', max: '100' }] },
    { type: 'other', label: 'Problem Sets', items: [{ label: 'Problem Sets', earned: '', max: '10', weight: 10 }] },
    { type: 'other', label: 'Attendance', items: [{ label: 'Attendance', earned: '', max: '10', weight: 10 }] }
  ];
}

function createCourse(name) {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: name || 'Untitled',
    system: 'transmuted',
    passingTarget: 50,
    termWeights: { midterm: 30, finals: 70 },
    compWeights: { quiz: 35, major: 45 },
    midterm: { components: makeComponents() },
    finals: { components: makeComponents() }
  };
}

function createPreset(name, course) {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    system: course.system,
    passingTarget: course.passingTarget,
    termWeights: { ...course.termWeights },
    compWeights: { ...course.compWeights },
    midterm: JSON.parse(JSON.stringify(course.midterm)),
    finals: JSON.parse(JSON.stringify(course.finals))
  };
}

const State = {
  courses: [],
  activeIndex: 0,
  presets: [],

  _read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  _write(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
  },

  load() {
    this.courses = this._read(STORE.COURSES) || [createCourse('Course 1')];
    this.activeIndex = this._read(STORE.ACTIVE) || 0;
    this.presets = this._read(STORE.PRESETS) || [];
    if (this.activeIndex >= this.courses.length) this.activeIndex = 0;
    this._migrateCourses();
    return this;
  },

  _migrateCourses() {
    this.courses.forEach(c => {
      // Migrate v1: flat components → midterm/finals
      if (c.components && !c.midterm) {
        console.log('[MIGRATE] course:', c.name, 'v1 -> v2 (flat->midterm/finals)');
        const comps = c.components;
        delete c.components;
        c.midterm = { components: JSON.parse(JSON.stringify(comps)) };
        c.finals = { components: JSON.parse(JSON.stringify(comps)) };
      }
      // Migrate v2: termWeight → termWeights, maxPoints → compWeights, item weights
      if (!c.termWeights) {
        console.log('[MIGRATE] course:', c.name, 'v2 -> v3 (weights)');
        const tw = c.termWeight || 30;
        c.termWeights = { midterm: tw, finals: 100 - tw };
        delete c.termWeight;
        c.compWeights = {};
        ['midterm', 'finals'].forEach(termKey => {
          const term = c[termKey];
          if (!term || !term.components) return;
          term.components.forEach(comp => {
            if (comp.maxPoints !== undefined) {
              c.compWeights[comp.type] = parseFloat(comp.maxPoints) || 0;
              delete comp.maxPoints;
            }
            // Distribute other weights to items if missing
            if (comp.type === 'other' && comp.items) {
              const totalW = c.compWeights.other || comp.items.reduce((s, it) => s + (parseFloat(it.weight) || 0), 0);
              if (!totalW) return;
              const perItem = totalW / comp.items.length;
              comp.items.forEach(it => {
                if (it.weight === undefined) it.weight = Math.round(perItem * 100) / 100;
              });
            }
          });
        });
        // Clean up compWeights.other reference (other uses per-item weights)
        delete c.compWeights.other;
      }
      // Migrate v3a: split combined other components into separate ones
      ['midterm', 'finals'].forEach(termKey => {
        const term = c[termKey];
        if (!term || !term.components) return;
        const split = [];
        term.components.forEach(comp => {
          if (comp.type === 'other' && comp.items && comp.items.length > 1) {
            comp.items.forEach((item, i) => {
              split.push({ type: 'other', label: item.label || `Other ${i + 1}`, items: [item] });
            });
          } else {
            split.push(comp);
          }
        });
        term.components = split;
      });
    });
    this.presets.forEach(p => {
      // Same migrations for presets
      if (p.components && !p.midterm) {
        const comps = p.components;
        delete p.components;
        p.midterm = { components: JSON.parse(JSON.stringify(comps)) };
        p.finals = { components: JSON.parse(JSON.stringify(comps)) };
      }
      if (!p.termWeights) {
        const tw = p.termWeight || 30;
        p.termWeights = { midterm: tw, finals: 100 - tw };
        delete p.termWeight;
        p.compWeights = {};
        ['midterm', 'finals'].forEach(termKey => {
          const term = p[termKey];
          if (!term || !term.components) return;
          term.components.forEach(comp => {
            if (comp.maxPoints !== undefined) {
              p.compWeights[comp.type] = parseFloat(comp.maxPoints) || 0;
              delete comp.maxPoints;
            }
            if (comp.type === 'other' && comp.items) {
              const totalW = p.compWeights.other || comp.items.reduce((s, it) => s + (parseFloat(it.weight) || 0), 0);
              if (!totalW) return;
              const perItem = totalW / comp.items.length;
              comp.items.forEach(it => {
                if (it.weight === undefined) it.weight = Math.round(perItem * 100) / 100;
              });
            }
          });
        });
        delete p.compWeights.other;
      }
      // Migrate v3a: split combined other components
      ['midterm', 'finals'].forEach(termKey => {
        const term = p[termKey];
        if (!term || !term.components) return;
        const split = [];
        term.components.forEach(comp => {
          if (comp.type === 'other' && comp.items && comp.items.length > 1) {
            comp.items.forEach((item, i) => {
              split.push({ type: 'other', label: item.label || `Other ${i + 1}`, items: [item] });
            });
          } else {
            split.push(comp);
          }
        });
        term.components = split;
      });
    });
    this.save();
  },

  save() {
    this._write(STORE.COURSES, this.courses);
    this._write(STORE.ACTIVE, this.activeIndex);
    this._write(STORE.PRESETS, this.presets);
  },

  get course() { return this.courses[this.activeIndex]; },

  addCourse(name) {
    const c = createCourse(name || `Course ${this.courses.length + 1}`);
    this.courses.push(c);
    this.activeIndex = this.courses.length - 1;
    this.save();
    return c;
  },

  removeCourse(index) {
    if (this.courses.length <= 1) return;
    this.courses.splice(index, 1);
    if (this.activeIndex >= this.courses.length) this.activeIndex = this.courses.length - 1;
    this.save();
  },

  renameCourse(index, name) {
    this.courses[index].name = name;
    this.save();
  },

  updateCourse(fn) {
    fn(this.course);
    this.save();
  },

  addPreset(name) {
    if (!this.course) return;
    this.presets.push(createPreset(name, this.course));
    this.save();
  },

  removePreset(id) {
    this.presets = this.presets.filter(p => p.id !== id);
    this.save();
  },

  renamePreset(id, name) {
    const p = this.presets.find(p => p.id === id);
    if (p) { p.name = name; this.save(); }
  },

  applyPreset(id) {
    const p = this.presets.find(p => p.id === id);
    if (!p || !this.course) return;
    this.course.system = p.system;
    this.course.passingTarget = p.passingTarget;
    this.course.termWeights = { ...p.termWeights };
    this.course.compWeights = { ...p.compWeights };
    this.course.midterm = JSON.parse(JSON.stringify(p.midterm));
    this.course.finals = JSON.parse(JSON.stringify(p.finals));
    this.save();
  },

  exportAll() {
    return {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      courses: this.courses,
      activeIndex: this.activeIndex,
      presets: this.presets
    };
  },

  importAll(data) {
    if (!data || typeof data !== 'object') throw new Error('Invalid format');
    if (!data.version) throw new Error('Missing version');
    if (!Array.isArray(data.courses)) throw new Error('Missing courses');
    if (!Array.isArray(data.presets)) throw new Error('Missing presets');
    this.courses = data.courses;
    this.activeIndex = typeof data.activeIndex === 'number' ? data.activeIndex : 0;
    this.presets = data.presets;
    if (this.activeIndex >= this.courses.length) this.activeIndex = 0;
    this.save();
  }
};

window.State = State;
