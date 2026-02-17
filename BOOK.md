# xontable Consumer Guide

This guide shows how to install and use xontable in any React app.

## 1. Install

```bash
npm install xontable
```

## 2. Import Styles

```ts
import "xontable/styles";
```

## 3. Basic Table

```tsx
import { XOnTable, type ColumnDef } from "xontable";

type Row = { id: string; name: string; qty: string };

const columns: ColumnDef<Row>[] = [
  { key: "name", label: "Name", editable: true },
  { key: "qty", label: "Qty", type: "number", editable: true },
];

const [rows, setRows] = useState<Row[]>([
  { id: "1", name: "Rice", qty: "10" },
]);

<XOnTable columns={columns} rows={rows} onChange={setRows} />;
```

## 4. Features
- Keyboard navigation
- Enter or double-click to edit
- Type to edit
- Copy/paste TSV
- Fill handle
- Filters and column groups
- Select dropdowns and checkbox cells
- Validation per column
- Readonly mode and dark theme

## 5. Validation Example

```ts
{ key: "qty", label: "Qty", type: "number", validator: (v) => v ? null : "Required" }
```

## 6. Select Example

```ts
{ key: "city", label: "City", type: "select", options: [
  { value: "tokyo", label: "Tokyo" }
] }
```

## 7. Readonly + Theme

```tsx
<XOnTable readOnly theme="dark" />
```

## 8. Requirements
- React 19+
- Peer deps: `react`, `react-dom`, `lucide-react`
