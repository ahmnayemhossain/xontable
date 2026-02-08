export type CellPos = { r: number; c: number };

export type ColumnType = "text" | "number" | "date" | "select" | "checkbox";

export type ColumnDef<Row extends Record<string, any> = any> = {
  key: string;
  label: string;
  width?: number;
  group?: string;
  groupCollapsible?: boolean;
  type?: ColumnType;
  options?: Array<{ value: string; label: string }>;
  getOptions?: (row: Row) => Promise<Array<{ value: string; label: string }>>;
  dependsOn?: string;
  editable?: boolean;
  validator?: (value: string, row: Row) => string | null;
};

export type XOnTableMeta = {
  type: "edit" | "paste" | "fill" | "undo" | "redo";
  cell: CellPos;
};

export type XOnTableProps<Row extends Record<string, any> = any> = {
  columns: ColumnDef<Row>[];
  rows: Row[];
  rowIdKey?: keyof Row; // default: "id"
  readOnly?: boolean;
  theme?: "light" | "dark";
  onChange?: (rows: Row[], meta: XOnTableMeta) => void;
};
