# xontable

A spreadsheet-like React table component with Excel-style editing, selection, clipboard, fill handle, validation, filters, select dropdowns, checkbox cells, and column groups.

## Install

```bash
npm install xontable
```

## Quick Start

```tsx
import React, { useState } from "react";
import { XOnTable, type ColumnDef } from "xontable";
import "xontable/styles";

type Row = { id: string; name: string; qty: string };

const columns: ColumnDef<Row>[] = [
  { key: "name", label: "Name", editable: true },
  { key: "qty", label: "Qty", type: "number", editable: true },
];

export default function App() {
  const [rows, setRows] = useState<Row[]>([
    { id: "1", name: "Rice", qty: "10" },
  ]);

  return <XOnTable columns={columns} rows={rows} onChange={setRows} />;
}
```

## Styles (Required)

Always import the styles once in your app:

```ts
import "xontable/styles";
```

## Props

- `columns`: Column definitions
- `rows`: Data rows
- `onChange(nextRows, meta)`: Updated rows with change meta
- `readOnly`: Disable editing
- `theme`: `"light" | "dark"`
- `showStatusBar`: Show validation summary bar
- `darkThemeColors`: Override dark theme colors

## Column Definition

```ts
type ColumnDef<Row> = {
  key: keyof Row | string;
  label: string;
  width?: number;
  editable?: boolean;
  type?: "text" | "number" | "date" | "select" | "checkbox";
  validator?: (value: string, row: Row) => string | null;
  group?: string;
  groupCollapsible?: boolean;
  options?: { value: string; label: string }[];
  getOptions?: (row: Row) => Promise<{ value: string; label: string }[]>;
  dependsOn?: string; // for cascading selects
};
```

## Editing
- Single click selects
- Enter or double-click to edit
- Typing starts edit with typed character
- Enter commits, Esc cancels, Tab commits and moves

## Copy / Paste
- TSV compatible with Excel/Google Sheets
- Use Ctrl/Cmd+C to copy selection
- Use Ctrl/Cmd+V to paste into table

## Fill Handle
- Drag the dot at bottom-right of active cell
- Fills down or across with repeated value

## Validation

Per-column validation:

```ts
{ key: "qty", label: "Qty", type: "number", validator: (v) => v ? null : "Required" }
```

## Status Bar

```tsx
<XOnTable showStatusBar />
```

## Select Dropdowns

```ts
{ key: "city", label: "City", type: "select", options: [
  { value: "tokyo", label: "Tokyo" }
] }
```

## Checkbox Cells

```ts
{ key: "active", label: "Active", type: "checkbox" }
```

## Column Groups

```ts
const columns: ColumnDef<Row>[] = [
  { key: "name", label: "Name", group: "User" },
  { key: "active", label: "Active", type: "checkbox", group: "User" },
  { key: "group", label: "Group", type: "select", group: "Account Details" },
  { key: "subgroup", label: "Subgroup", type: "select", group: "Account Details" },
  { key: "city", label: "City", type: "select", group: "Login info" },
];
```

## Theme

```tsx
<XOnTable theme="dark" />
```

### Dark Theme Colors (Props)

```tsx
<XOnTable
  theme="dark"
  darkThemeColors={{ bg: "#111318", headBg: "#1c1f26", accent: "#7aa2ff" }}
/>
```

## Requirements
- React 19+
- Peer deps: `react`, `react-dom`

## Troubleshooting

**Error: Could not resolve "./styles/xontable.css"**
- Ensure you installed the latest version and it was built/published correctly.
- Clear Vite cache: delete `node_modules/.vite` and run `npm run dev -- --force`.

## License
MIT
