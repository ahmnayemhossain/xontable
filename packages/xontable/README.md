# xontable

A spreadsheet-like React table component for editable, Excel-style grids.

## Install

```bash
npm install xontable
```

## Usage

```tsx
import { XOnTable, type ColumnDef } from "xontable";
import "xontable/styles";

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

## Column Types
- `text`
- `number`
- `date`
- `select`
- `checkbox`

## Select Dropdowns
Use `options` or `getOptions`:

```ts
{ key: "city", label: "City", type: "select", options: [
  { value: "tokyo", label: "Tokyo" }
] }
```

## Validation
Use `validator` per column:

```ts
{ key: "qty", label: "Qty", type: "number", validator: (v) => v ? null : "Required" }
```

## Readonly & Theme

```tsx
<XOnTable readOnly theme="dark" />
```

## Requirements
- React 19+
- Peer deps: `react`, `react-dom`, `lucide-react`

## Styles
Required:

```ts
import "xontable/styles";
```
