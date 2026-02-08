import { useCallback, useMemo, useRef } from "react";
import type { ColumnDef, XOnTableMeta } from "../types";

type AutoRowsResult<Row> = {
  normalizedRows: Row[];
  handleChange: (rows: Row[], meta: XOnTableMeta) => void;
  createRow: () => Row;
};

export function useAutoRows<Row extends Record<string, any>>(
  columns: ColumnDef<Row>[],
  rows: Row[],
  rowIdKey: keyof Row,
  onChange?: (rows: Row[], meta: XOnTableMeta) => void,
  pinnedRowId?: string | null,
): AutoRowsResult<Row> {
  const idRef = useRef(0);
  const makeRowId = useCallback(() => `row_${Date.now()}_${idRef.current++}`, []);
  const createRow = useCallback(() => {
    const row: Record<string, any> = {};
    columns.forEach((col) => { if (col.key !== String(rowIdKey)) row[col.key] = col.type === "checkbox" ? false : ""; });
    row[String(rowIdKey)] = makeRowId();
    return row as Row;
  }, [columns, makeRowId, rowIdKey]);
  const isRowEmpty = useCallback((row: Row) => {
    const id = String((row as any)[rowIdKey] ?? "");
    if (pinnedRowId && id === pinnedRowId) return false;
    return columns.every((col) => {
      if (col.key === String(rowIdKey)) return true;
      const v = (row as any)[col.key];
      if (col.type === "checkbox") return v !== true;
      return v == null || v === "";
    });
  }, [columns, pinnedRowId, rowIdKey]);
  const ensureTrailingBlank = useCallback((list: Row[]) => {
    if (list.length === 0) return [createRow()];
    let lastNonEmpty = -1;
    for (let i = 0; i < list.length; i++) if (!isRowEmpty(list[i])) lastNonEmpty = i;
    const keep = lastNonEmpty === -1 ? [] : list.slice(0, lastNonEmpty + 1);
    const tail = list[lastNonEmpty + 1];
    return [...keep, tail && isRowEmpty(tail) ? tail : createRow()];
  }, [createRow, isRowEmpty]);
  const normalizedRows = useMemo(() => ensureTrailingBlank(rows), [ensureTrailingBlank, rows]);
  const handleChange = useCallback((next: Row[], meta: XOnTableMeta) => {
    onChange?.(ensureTrailingBlank(next), meta);
  }, [ensureTrailingBlank, onChange]);

  return { normalizedRows, handleChange, createRow };
}
