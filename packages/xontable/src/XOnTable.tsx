import React from "react";
import "./styles/xontable.css";
import type { XOnTableProps } from "./types";
import { SelectMenu } from "./components/SelectMenu";
import { XOnTableGrid } from "./components/XOnTableGrid";
import { useClipboardCatcher } from "./hooks/useClipboardCatcher";
import { useColumnFilters } from "./hooks/useColumnFilters";
import { useColumnGroups } from "./hooks/useColumnGroups";
import { useColumnResize } from "./hooks/useColumnResize";
import { useEditorOverlay } from "./hooks/useEditorOverlay";
import { useFillHandle } from "./hooks/useFillHandle";
import { useGridKeydown } from "./hooks/useGridKeydown";
import { useOutsideClick } from "./hooks/useOutsideClick";
import { useRangeSelection } from "./hooks/useRangeSelection";
import { useSelectOptions } from "./hooks/useSelectOptions";
import { useTableModel } from "./hooks/useTableModel";
import { useAutoRows } from "./hooks/useAutoRows";
type CellUpdate = { r: number; c: number; value: any }; const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function XOnTable<Row extends Record<string, any>>(props: XOnTableProps<Row>) {
  const { columns, rows, rowIdKey = "id" as keyof Row, onChange, readOnly = false, theme = "light" } = props;
  const activeCellRef = React.useRef<HTMLDivElement | null>(null);
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const { normalizedRows, handleChange, createRow } = useAutoRows(columns, rows, rowIdKey, onChange, editingRowId);
  const filters = useColumnFilters(columns, normalizedRows);
  const { visibleColumns, groupHeaders, getColWidth, setColWidth, toggleGroup, resetWidths, getOrigIndex } = useColumnGroups<Row>({ columns });
  const { getOptions, ensureOptions, isLoading } = useSelectOptions(columns);
  const selection = useRangeSelection();
  const [copiedBounds, setCopiedBounds] = React.useState<{ r1: number; r2: number; c1: number; c2: number } | null>(null);
  React.useEffect(() => { resetWidths(); }, [columns, resetWidths]);
  const { data, active, setActive, getValue, updateCells, moveActive, rowCount, colCount, hasError, getError, setCellErrorView, undo, redo } = useTableModel<Row>({
    columns: visibleColumns.map((v) => v.col),
    rows: normalizedRows,
    rowFilter: filters.rowFilter,
    onChange: handleChange,
    createRow,
  });
  React.useEffect(() => { if (active.c >= colCount) setActive({ r: active.r, c: Math.max(0, colCount - 1) }); }, [active, colCount, setActive]);
  const activeCol = visibleColumns[active.c]?.col; const activeRow = data[active.r];
  const validateSelect = React.useCallback((r: number, c: number, value: string, row: Row | undefined) => {
    const col = visibleColumns[c]?.col; if (!col || col.type !== "select" || !row) return null;
    const opts = getOptions(row, col); const match = opts.find((o) => o.value === value || o.label === value) ?? null;
    if (!match && value.trim() !== "") { setCellErrorView(r, c, "Invalid option"); return null; }
    setCellErrorView(r, c, null); return match;
  }, [getOptions, setCellErrorView, visibleColumns]);
  const normalizeSelectValue = React.useCallback((r: number, c: number, value: string, row: Row | undefined) => { const match = validateSelect(r, c, value, row); return match ? match.value : value; }, [validateSelect]);
  const ensureSelect = React.useCallback((r: number, c: number, row: Row | undefined) => { const col = visibleColumns[c]?.col; if (!col || col.type !== "select" || !row) return; ensureOptions(row, col); }, [ensureOptions, visibleColumns]);
  const { startResize } = useColumnResize({ colCount, getWidth: getColWidth, setWidth: setColWidth, minWidth: 60 });
  const measureRef = React.useRef<HTMLDivElement | null>(null); React.useEffect(() => () => { if (measureRef.current) measureRef.current.remove(); }, []);
  const measureText = React.useCallback((text: string) => { let el = measureRef.current; if (!el) { el = document.createElement("div"); el.className = "xontable-cell xontable-measure"; document.body.appendChild(el); measureRef.current = el; } el.textContent = text || ""; return Math.ceil(el.getBoundingClientRect().width); }, []);
  const autoFitCol = React.useCallback((visibleIndex: number) => { const orig = getOrigIndex(visibleIndex); if (orig == null) return; let max = measureText(columns[orig]?.label ?? ""); for (let r = 0; r < data.length; r++) { const w = measureText(getValue(r, visibleIndex)); if (w > max) max = w; } setColWidth(visibleIndex, Math.min(600, Math.max(60, max + 15))); }, [columns, data.length, getOrigIndex, getValue, measureText, setColWidth]);
  const { isEditing, draft, setDraft, editorRect, editorRef, startEdit, commitEdit, onEditorKeyDown } = useEditorOverlay({
    active, activeCellRef, getValue,
    onCommit: (value) => {
      const row = data[active.r]; const col = visibleColumns[active.c]?.col;
      const v = col?.type === "select" ? normalizeSelectValue(active.r, active.c, value, row) : value;
      updateCells([{ r: active.r, c: active.c, value: v }], { type: "edit", cell: active });
    },
    onEnter: (dir) => moveActive(dir, 0), onTab: (dir) => moveActive(0, dir),
  });
  React.useEffect(() => { if (!isEditing) setEditingRowId(null); }, [isEditing]);
  const startEditCell = React.useCallback((initial?: string) => { if (readOnly) return; const id = activeRow ? String((activeRow as any)[rowIdKey] ?? "") : ""; setEditingRowId(id || null); ensureSelect(active.r, active.c, activeRow); startEdit(initial); }, [active.c, active.r, activeRow, ensureSelect, readOnly, rowIdKey, startEdit]);
  const toggleCheckbox = React.useCallback((r: number, c: number) => {
    if (readOnly) return;
    const col = visibleColumns[c]?.col; const row = data[r];
    if (!col || col.type !== "checkbox" || !row) return;
    const checked = row[col.key] === true || row[col.key] === "true";
    updateCells([{ r, c, value: !checked }], { type: "edit", cell: { r, c } });
  }, [data, readOnly, updateCells, visibleColumns]);
  const clearRange = React.useCallback(() => { const b = selection.getBounds(); if (!b) { updateCells([{ r: active.r, c: active.c, value: "" }], { type: "edit", cell: active }); return; } const updates: CellUpdate[] = []; for (let r = b.r1; r <= b.r2; r++) for (let c = b.c1; c <= b.c2; c++) updates.push({ r, c, value: "" }); updateCells(updates, { type: "edit", cell: active }); }, [active, selection, updateCells]);
  const { clipRef, focusClipboard, onCopy, onPaste } = useClipboardCatcher({
    isEditing,
    getCopyBlock: () => { const b = selection.getBounds(); if (!b) return [[getValue(active.r, active.c)]]; const block: string[][] = []; for (let r = b.r1; r <= b.r2; r++) { const row: string[] = []; for (let c = b.c1; c <= b.c2; c++) row.push(getValue(r, c)); block.push(row); } return block; },
    onCopy: () => setCopiedBounds(selection.getBounds() ?? { r1: active.r, r2: active.r, c1: active.c, c2: active.c }),
    onPasteBlock: (block) => { if (readOnly) return; const updates: CellUpdate[] = []; for (let rOff = 0; rOff < block.length; rOff++) for (let cOff = 0; cOff < block[rOff].length; cOff++) { const r = active.r + rOff; const c = active.c + cOff; if (c < colCount) updates.push({ r, c, value: block[rOff][cOff] }); } updateCells(updates, { type: "paste", cell: active }); updates.forEach((u) => validateSelect(u.r, u.c, u.value, data[u.r])); },
  });
  React.useEffect(() => { if (!isEditing) focusClipboard(); }, [focusClipboard, isEditing]);
  const openSelectAt = React.useCallback((r: number, c: number) => {
    if (readOnly) return;
    setActive({ r, c }); selection.startSelection({ r, c }); focusClipboard();
    const row = data[r]; const id = row ? String((row as any)[rowIdKey] ?? "") : ""; setEditingRowId(id || null);
    ensureSelect(r, c, row); requestAnimationFrame(() => startEdit());
  }, [data, ensureSelect, focusClipboard, readOnly, rowIdKey, selection, setActive, startEdit]);
  const { startDrag, isPreview } = useFillHandle({
    onApply: (startR, startC, endR, endC) => {
      if (readOnly) return; const value = getValue(startR, startC); const updates: CellUpdate[] = [];
      const dr = Math.abs(endR - startR); const dc = Math.abs(endC - startC);
      if (dc >= dr) { const from = Math.min(startC, endC); const to = Math.max(startC, endC); for (let c = from; c <= to; c++) updates.push({ r: startR, c, value }); }
      else { const from = Math.min(startR, endR); const to = Math.max(startR, endR); for (let r = from; r <= to; r++) updates.push({ r, c: startC, value }); }
      updateCells(updates, { type: "fill", cell: { r: startR, c: startC } }); updates.forEach((u) => validateSelect(u.r, u.c, u.value, data[u.r])); focusClipboard();
    },
  });
  const onShiftMove = React.useCallback((dr: number, dc: number) => { const next = { r: clamp(active.r + dr, 0, rowCount - 1), c: clamp(active.c + dc, 0, colCount - 1) }; if (!selection.selection) selection.startSelection(active); selection.updateSelection(next); setActive(next); }, [active, colCount, rowCount, selection, setActive]);
  const onGridKeyDown = useGridKeydown({
    active, rowCount, colCount, isEditing, moveActive, moveTo: (r, c) => setActive({ r, c }),
    startEdit: readOnly ? () => {} : startEditCell,
    clearCell: () => { if (!readOnly) clearRange(); },
    undo: () => { if (!readOnly) undo(); }, redo: () => { if (!readOnly) redo(); },
    onShiftMove,
  });
  const onGridKeyDownWithCopy = React.useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    const target = e.target as HTMLElement | null;
    const isClip = Boolean(target && target.classList.contains("xontable-clip"));
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA") && !isClip) return;
    const isCopy = (e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C");
    if (isCopy) setCopiedBounds(selection.getBounds() ?? { r1: active.r, r2: active.r, c1: active.c, c2: active.c });
    else setCopiedBounds(null);
    onGridKeyDown(e);
  }, [active.c, active.r, onGridKeyDown, selection]);
  useOutsideClick({ isOpen: filters.filterOpenKey != null, onClose: filters.closeFilter });

  return (
    <div className={`xontable-wrap theme-${theme}${readOnly ? " is-readonly" : ""}`}>
      <textarea ref={clipRef} className="xontable-clip" name="xontable-clip" aria-hidden="true" tabIndex={-1} onCopy={onCopy} onPaste={onPaste} onKeyDown={onGridKeyDownWithCopy} readOnly />
      <div
        className="xontable-surface"
        tabIndex={0}
        onFocus={(e) => {
          const target = e.target as HTMLElement | null;
          if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
          focusClipboard();
        }}
        onKeyDown={onGridKeyDownWithCopy}
      >
        <XOnTableGrid
          columns={visibleColumns} groups={groupHeaders.some((g) => g.label) ? groupHeaders : undefined} rowNumberWidth={44}
          data={data} rowIdKey={rowIdKey} active={active} activeCol={active.c} isEditing={isEditing} readOnly={readOnly}
          selectionBounds={selection.getBounds()} copiedBounds={copiedBounds}
          getColWidth={getColWidth} getValue={getValue} hasError={hasError} getError={getError} isPreview={isPreview} activeCellRef={activeCellRef}
          onCellMouseDown={(r, c, ev) => { ev.preventDefault(); setActive({ r, c }); selection.startSelection({ r, c }); setCopiedBounds(null); focusClipboard(); if (filters.filterOpenKey) filters.closeFilter(); }}
          onCellMouseEnter={(r, c) => { if (selection.isSelecting) selection.updateSelection({ r, c }); }}
          onCellDoubleClick={(r, c) => { setActive({ r, c }); startEditCell(); }}
          onCheckboxToggle={toggleCheckbox}
          onSelectOpen={openSelectAt}
          onFillStart={(r, c, ev) => { ev.preventDefault(); ev.stopPropagation(); startDrag(r, c); }}
          onResizeStart={(c, ev) => { ev.preventDefault(); ev.stopPropagation(); startResize(c, ev.clientX); }}
          onResizeDoubleClick={(c, ev) => { ev.preventDefault(); ev.stopPropagation(); autoFitCol(c); }}
          onGroupToggle={toggleGroup} filterOpenKey={filters.filterOpenKey} filterSearch={filters.filterSearch}
          getFilterOptions={filters.getFilterOptions} isFilterChecked={filters.isFilterChecked} isFilterAllChecked={filters.isAllChecked}
          onFilterOpen={filters.openFilter} onFilterSearch={filters.setFilterSearch}
          onFilterToggle={filters.toggleFilterValue} onFilterToggleAll={filters.toggleAll}
        />
      </div>
      {isEditing && editorRect && (
        <input ref={editorRef} className="xontable-editor" name="xontable-editor" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onEditorKeyDown} onBlur={() => { commitEdit(); validateSelect(active.r, active.c, draft, activeRow); }} style={{ position: "fixed", left: editorRect.left, top: editorRect.top, width: editorRect.width, height: editorRect.height }} />
      )}
      <SelectMenu isOpen={Boolean(isEditing && activeCol?.type === "select")} rect={editorRect} options={activeRow && activeCol ? getOptions(activeRow, activeCol) : []} loading={Boolean(activeRow && activeCol && isLoading(activeRow, activeCol))} filter={draft} onSelect={(v) => { setDraft(v); commitEdit(v); validateSelect(active.r, active.c, v, activeRow); }} />
    </div>
  );
}
