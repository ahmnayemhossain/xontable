# xontable

A spreadsheet-like React table component with selection, clipboard, fill handle, validation, filters, select dropdowns, and checkbox cells.

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

## Core Features
- Single-cell select with keyboard navigation
- Edit on Enter or double click
- Type to start editing
- TSV copy/paste compatible with Excel/Google Sheets
- Fill handle drag to repeat values
- Per-column validation
- Select dropdowns and checkbox cells
- Filters and column groups
- Light and dark themes
- Readonly mode styling
- Validation status bar (optional)

## Props (Most Used)
- `columns`: Column definitions
- `rows`: Data rows
- `onChange(nextRows, meta)`: Receives updated rows
- `readOnly`: Disable editing
- `theme`: `"light" | "dark"`
- `showStatusBar`: Show validation summary bar
- `darkThemeColors`: Override dark theme colors

## Styles
Always import:

```ts
import "xontable/styles";
```

## Notes
- React 19+ is required.
- You must install peer deps: `react`, `react-dom`.

## Docs
- Package usage: `packages/xontable/README.md`
- Changelog: `CHANGELOG.md`
