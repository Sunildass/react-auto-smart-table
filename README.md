# React Smart Table ✨

> A zero-configuration, intelligent data table for React that visually explains your data instantly.

![Demo Banner](https://via.placeholder.com/800x400?text=React+Smart+Table+Demo) <!-- Placeholder for hero image -->

Drop in your raw JSON datasets and watch `<SmartTable />` automatically infer the schema, generate columns, detect semantic types, allow rich filtering, wire sorting heuristics, and build beautiful analytics widgets.

All powered by an intelligent Schema Inference Engine scaling up to 10,000+ virtualized rows gracefully.

---

## ⚡ Features

- 🧠 **Zero-Config Schema Inference:** Pass an array of objects. That's it. It automatically figures out if columns are emails, URLs, dates, currenices, booleans, or percentages.
- 🎨 **Semantic Cell Renderers:** Emails become clickable, booleans become Badges, Currencies format intelligently.
- 📊 **Insight Engine Chart Generation:** Enable the `insights` prop to instantly detect groupings and metrics. We manufacture Recharts widgets out of thin air to visualize your table data perfectly. 
- 🎛️ **Intelligent Filtering & Sorting:** Deep filtering built-in. Strings get fuzzy search, numbers get min/max range sliders, dates get calendar pickers.
- 🚀 **Extreme Performance:** Built on `react-virtual`, instantly renders lists with thousands of objects without freezing the DOM.
- 🔌 **Plugin SDK:** Inject your own custom Type Detectors and Cell Renderers. Want to render a bespoke Jira Ticket tag? Register a plugin in 3 lines of code.

---

## 📦 Installation
```bash
npm install react-smart-table
```

*(Note: Ensure you have `react`, `react-dom`, and `recharts` installed as peer dependencies)*

```bash
npm install react react-dom recharts
```

---

## 🎮 Interactive Playing (Demo)

Want to see `<SmartTable />` in action immediately? We have provided a live React playground.

```bash
cd playground
npm install
npm run dev
```

---

## 🚀 Basic Usage

The design philosophy is that one line of code builds a functional dashboard.

```tsx
import React from 'react';
import { SmartTable } from 'react-smart-table';

const dataset = [
  { id: 1, name: "Alice", email: "alice@example.com", revenue: 5400.5, active: true },
  { id: 2, name: "Bob", email: "bob@example.com", revenue: 800.75, active: false },
  // ... thousands of rows
];

export function App() {
  return (
    <div style={{ height: '600px' }}>
       {/* 1 Line. Infinite Power. */}
       <SmartTable data={dataset} />
    </div>
  );
}
```

---

## 🔥 Advanced Usage

Unlock the full suite of the table by opting into features via component props.

```tsx
<SmartTable 
  data={dataset} 
  sortable={true} 
  filterable={true} 
  pagination={true} 
  insights={true} // Triggers the Recharts visualizer 
/>
```

### Writing a Custom Plugin

Need custom parsing rules? Override the inference engine!

```tsx
import { SmartTable, SmartTablePlugin } from 'react-smart-table';

const customStatusPlugin: SmartTablePlugin = {
  detect: (key, sample) => {
    // If column name has 'status', take it over.
    if (key.toLowerCase() === 'status') return 'custom-status';
    return null; 
  },
  render: ({ value }) => {
    const color = value === 'Failed' ? 'red' : 'green';
    return <span style={{ color }}>{value}</span>;
  }
}

// Pass it into the component
<SmartTable data={dataset} plugins={[customStatusPlugin]} />
```

---

## 🏗️ Architecture

- **Phase 1: Analytics Inference:** Calculates confidence scores based on sampled rows resolving deterministic types (`src/analyzer`).
- **Phase 2: Renderer Factory:** Injects React nodes based on the schema mapping output.
- **Phase 3: Hook Isolation:** Filters, Sorting, and Pagination maintain their own state context cleanly separated from UI templates.
- **Phase 4: Insight Builder:** Generates aggregation metrics traversing Categorical parameters vs Numeric outputs building a configuration map for rendering Recharts. 

## 💡 Contributing

We welcome pull requests and issues! 

1. Clone the repository
2. Run `npm install`
3. Run Vitest Unit/Integration testing suit `npm run test`

---
*Created carefully using rigorous step-based execution.*
