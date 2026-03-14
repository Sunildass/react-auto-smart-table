# react-auto-smart-table

[![npm version](https://img.shields.io/npm/v/react-auto-smart-table.svg)](https://www.npmjs.com/package/react-auto-smart-table)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A zero-configuration, intelligent React data table that automatically analyzes your data to provide a premium, production-ready dashboard experience out of the box.

[**Live Demo**](https://sunildass.github.io/react-auto-smart-table/)

## 🚀 Why react-auto-smart-table?

Most data tables require extensive configuration—defining columns, types, filters, and sorters manually. **react-auto-smart-table** flips the script. Just pass your JSON array, and it handles the heavy lifting.

-   **🧠 Intelligent Schema Inference**: Automatically detects types (dates, currency, percentage, booleans, etc.) and formats them beautifully.
-   **⚡ High Performance**: Built-in virtualization via `react-virtual` for handling thousands of records with zero lag.
-   **🎨 Modern Dashboard UI**: A premium SaaS-ready design with adaptive column widths, card-based layouts, and rich visual hierarchy.
-   **📊 Automatic Insights**: Generates meaningful charts and aggregations based on your data patterns.
-   **🔌 Extensible Plugin SDK**: Add custom cell renderers and detectors using a simple plugin system.

## 📦 Installation

```bash
npm install react-auto-smart-table
# or
yarn add react-auto-smart-table
```

## 🛠️ Quick Start

```tsx
import { SmartTable } from 'react-auto-smart-table';

const data = [
  { id: 1, name: "John Smith", amount: 1200.50, status: "Active", joined: "2024-01-15" },
  { id: 2, name: "Maria Garcia", amount: 450.00, status: "Pending", joined: "2024-02-10" },
  // ...
];

function App() {
  return (
    <div style={{ height: '600px' }}>
      <SmartTable 
        data={data}
        sortable
        filterable
        insights
      />
    </div>
  );
}
```

## ✨ Features

### 1. Intelligent Data Analytics
The table doesn't just display data; it understands it.
- **Auto-Formatting**: Recognizes "USD", "$", or large numbers and applies appropriate formatting.
- **Smart Labels**: Automatically transforms `camelCase` or `snake_case` keys into `Title Case` labels (e.g., `order_id` becomes `Order ID`).
- **Date Normalization**: Sophisticated detection for ISO strings, timestamps, and various date formats.

### 2. Built-in Interactivity
- **Multi-column Sorting**: Interaction-rich headers with visual sort indicators (↑, ↓, ⇅).
- **Responsive Filtering**: Automatic generation of filter panels based on column types (text search for strings, toggles for booleans).
- **Pagination**: Smooth client-side pagination for manageable data chunks.

### 3. Insights Panel
The `insights` prop enables an analytics dashboard above the table that automatically visualizes:
- Distribution of categorical data (Bar charts).
- Trends over time (Time-series charts).
- Histograms for numeric value distributions.

### 4. Plugin System
Extend the table with your own logic:

```tsx
import { currencyPlugin, percentagePlugin } from 'react-auto-smart-table';

<SmartTable 
  data={data} 
  plugins={[currencyPlugin, percentagePlugin]} 
/>
```

## ⚙️ Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `any[]` | `[]` | The array of objects to display. |
| `sortable` | `boolean` | `false` | Enable/disable column sorting. |
| `filterable` | `boolean` | `false` | Enable/disable the interactive filter panel. |
| `insights` | `boolean` | `false` | Show auto-generated analytic charts. |
| `pagination`| `boolean` | `false` | Enable client-side pagination. |
| `pageSize` | `number` | `10` | Number of rows per page. |
| `plugins` | `Plugin[]` | `[]` | Array of plugins to extend detection/rendering. |
| `title` | `string` | `undefined`| Optional table header title. |

`react-auto-smart-table` is built with modern React patterns:
- **Virtualization**: Uses `@tanstack/react-virtual` for windowing long lists.
- **Styles**: Zero-dependency CSS-in-JS/External CSS for maximum compatibility.
- **Inference**: A custom analysis engine that samples data for high accuracy and performance.

## 📄 License

MIT © [Sunildass](https://github.com/Sunildass)
