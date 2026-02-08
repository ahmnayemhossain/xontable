# xontable

A lightweight spreadsheet-like React table with editable cells, keyboard navigation, selection, fill handle, filtering, select dropdowns, and checkbox cells.

## Install

```bash
npm install xontable
```

## Basic Usage

```tsx
import { XOnTable, type ColumnDef } from "xontable";
import "xontable/styles";

type Row = { id: string; name: string; active: boolean };

const columns: ColumnDef<Row>[] = [
  { key: "name", label: "Name", width: 180, editable: true },
  { key: "active", label: "Active", width: 80, type: "checkbox", editable: true },
];

const rows: Row[] = [
  { id: "1", name: "Rice", active: true },
  { id: "2", name: "Eggs", active: false },
];

export function App() {
  return <XOnTable columns={columns} rows={rows} />;
}
```

## Features

- Single-cell edit with overlay input
- Keyboard navigation (arrows, Tab, Enter)
- Range selection + copy/paste TSV
- Fill handle drag (repeat value)
- Column groups + collapsible headers
- Filter menu per column
- `select` and `checkbox` cell types
- Validation with error styling
- Light and dark themes

## Props (XOnTable)

- `columns`: Column definitions with types and validation
- `rows`: Array of row objects
- `rowIdKey`: Key for stable row ids (default `id`)
- `readOnly`: Disable edits if `true`
- `theme`: `light` or `dark`
- `onChange`: Called with updated rows and meta

## Styling

- Import base styles: `import "xontable/styles";`
- Themes are controlled by the `theme` prop

## Repo Layout

- `packages/xontable` — library source
- `apps/playground` — Vite demo app
