import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CellPos, XOnTableMeta, ColumnDef } from "../types";
import { useValidation } from "./useValidation";

type CellUpdate = { r: number; c: number; value: any };

type TableModelOptions<Row extends Record<string, any>> = {
  columns: ColumnDef<Row>[];
  rows: Row[];
  rowFilter?: (row: Row, r: number) => boolean;
  onChange?: (rows: Row[], meta: XOnTableMeta) => void;
  createRow?: () => Row;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function useTableModel<Row extends Record<string, any>>(options: TableModelOptions<Row>) {
  const { columns, rows, rowFilter, onChange } = options;
  const createRow = options.createRow;
  const colCount = columns.length;
  const [data, setData] = useState<Row[]>(rows);
  const dataRef = useRef(rows);
  const historyRef = useRef<{ past: Row[][]; future: Row[][] }>({ past: [], future: [] });
  const lastCellRef = useRef<CellPos>({ r: 0, c: 0 });
  useEffect(() => { setData(rows); dataRef.current = rows; historyRef.current = { past: [], future: [] }; }, [rows]);

  const [active, setActive] = useState<CellPos>({ r: 0, c: 0 });

  const view = useMemo(() => {
    const map: number[] = []; const list: Row[] = [];
    dataRef.current.forEach((row, i) => { if (!rowFilter || rowFilter(row, i)) { map.push(i); list.push(row); } });
    return { map, list };
  }, [rowFilter, data]);
  const rowCount = view.list.length;

  const getRow = useCallback((r: number) => {
    const real = view.map[r]; return real == null ? undefined : dataRef.current[real];
  }, [view.map]);
  const getValue = useCallback((r: number, c: number) => {
    const col = columns[c]; const real = view.map[r]; const row = real == null ? undefined : dataRef.current[real];
    const v = row && col ? row[col.key] : ""; return v == null ? "" : String(v);
  }, [columns, view.map]);

  const { validateCell, setCellError, hasError, getError } = useValidation<Row>(columns, getRow, getValue);

  const setCellErrorView = useCallback((r: number, c: number, msg: string | null) => {
    const real = view.map[r]; if (real == null) return; setCellError(real, c, msg);
  }, [setCellError, view.map]);

  const commitRows = useCallback((next: Row[], meta: XOnTableMeta, recordHistory: boolean, prev: Row[]) => {
    if (recordHistory) { const h = historyRef.current; h.past.push(prev); h.future = []; if (h.past.length > 50) h.past.shift(); }
    dataRef.current = next; setData(next); onChange?.(next, meta);
  }, [onChange]);

  const updateCells = useCallback((updates: CellUpdate[], meta: XOnTableMeta) => {
    if (updates.length === 0) return;
    const prev = dataRef.current; const next = prev.map((r) => ({ ...r })); let changed = false;
    const map = [...view.map];
    for (const u of updates) {
      const col = columns[u.c];
      let real = map[u.r];
      if (real == null && createRow) { real = next.length; next.push(createRow()); map[u.r] = real; }
      const row = real == null ? undefined : next[real];
      if (!col || !row || col.editable === false) continue;
      const nextRow = { ...(row as Record<string, any>) };
      nextRow[col.key as string] = u.value as any;
      next[real] = nextRow as Row;
      const err = validateCell(u.r, u.c, u.value, nextRow as Row); if (real != null) setCellError(real, u.c, err);
      changed = true;
      lastCellRef.current = { r: u.r, c: u.c };
    }
    if (changed) commitRows(next, meta, true, prev);
  }, [columns, commitRows, createRow, setCellError, validateCell, view.map]);

  const moveActive = useCallback((dr: number, dc: number) => {
    setActive((prev) => {
      if (rowCount === 0 || colCount === 0) return prev;
      return { r: clamp(prev.r + dr, 0, rowCount - 1), c: clamp(prev.c + dc, 0, colCount - 1) };
    });
  }, [colCount, rowCount]);

  const undo = useCallback(() => {
    const h = historyRef.current; if (h.past.length === 0) return;
    const prev = h.past.pop() as Row[]; h.future.push(dataRef.current); dataRef.current = prev; setData(prev);
    onChange?.(prev, { type: "undo", cell: lastCellRef.current });
  }, [onChange]);

  const redo = useCallback(() => {
    const h = historyRef.current; if (h.future.length === 0) return;
    const next = h.future.pop() as Row[]; h.past.push(dataRef.current); dataRef.current = next; setData(next);
    onChange?.(next, { type: "redo", cell: lastCellRef.current });
  }, [onChange]);

  const hasErrorView = useCallback((r: number, c: number) => {
    const real = view.map[r]; return real == null ? false : hasError(real, c);
  }, [hasError, view.map]);

  const getErrorView = useCallback((r: number, c: number) => {
    const real = view.map[r]; return real == null ? null : getError(real, c);
  }, [getError, view.map]);

  return {
    data: view.list,
    rawData: dataRef.current,
    active,
    setActive,
    getValue,
    updateCells,
    moveActive,
    rowCount,
    colCount,
    hasError: hasErrorView,
    getError: getErrorView,
    setCellErrorView,
    undo,
    redo,
  };
}
