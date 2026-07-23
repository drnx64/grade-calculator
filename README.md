# Grade Calculator

A single-page grade calculator with a chalkboard-aesthetic UI. Supports zero-based and transmuted grading systems with per-component passing targets, real-time KaTeX solution breakdowns, and multi-course tabs.

## Features

- **Dual grading systems** — zero-based and transmuted (with passing offset)
- **Per-item passing targets** — each quiz item can have its own passing rate
- **Real-time KaTeX solutions** — step-by-step formula breakdown rendered with KaTeX
- **Multi-course tabs** — add, rename, remove courses with tab context menu (right-click)
- **Inline scores & weight bars** — visual weight distribution per component
- **Auto-collapse** — expand/collapse component groups, other-items section, and calc section (persisted)
- **Auto-save indicator** — green "Saved" badge on every save
- **Keyboard shortcuts** — navigate and edit without mouse
- **Empty-state UI** — placeholder when no scores are entered
- **Responsive layout** — adapts from desktop to mobile
- **Console helper** — type `autocomplete` in devtools to fill all scores with random values
- **Export to PDF** — print-ready solution sheets
- **Presets** — quick-apply grading templates

## Usage

Open `index.html` in a browser. No build step required — it's all vanilla JS, CSS, and HTML.

### Grading Formula

**Zero-based:** `(earned / max × passingTarget) × 100` per component, weighted and summed across terms.

**Transmuted:** `(earned / max × passingTarget + (1 - passingTarget)) × 100`, which ensures a minimum score even at zero raw performance.

### Passing Target

The course-wide default is 50%. Override per item by editing the `passing` field on any quiz row. When items share the same passing target, the solution uses an aggregate formula; when they differ, each item is solved separately.

## Project Structure

```
index.html          — entry point
css/                — stylesheets (components, responsive, tabs, header, results, etc.)
js/
  main.js           — event handlers, init, autocomplete helper
  state.js          — data model, persistence, migration, presets
  render.js         — DOM rendering (course content, headers, calc section)
  calculations.js   — scoring formulas, step-by-step LaTeX generation
  export.js         — PDF export
assets/
  icons/            — SVG icons
```

## License

MIT
