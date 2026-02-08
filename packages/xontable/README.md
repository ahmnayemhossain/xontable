# xontable

A lightweight spreadsheet-like React table with editable cells, keyboard navigation, fill handle, filtering, and select/checkbox support.

## Install

```bash
npm install xontable
```

## Usage

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

## Notes
- `type: "select"` shows a dropdown arrow and supports async `getOptions`.
- `type: "checkbox"` renders a checkbox and enforces `true/false` validation.
- Styling lives in `xontable/styles`.
