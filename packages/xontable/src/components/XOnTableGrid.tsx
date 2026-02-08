import React from "react";
import type { CellPos, ColumnDef } from "../types";
import { XOnTableHeader } from "./XOnTableHeader";

type GroupHeader = { key: string; label: string; width: number; collapsible: boolean; collapsed: boolean };

type GridProps<Row extends Record<string, any>> = {
  columns: Array<{ col: ColumnDef<Row>; idx: number | null }>;
  groups?: GroupHeader[];
  rowNumberWidth: number;
  data: Row[];
  rowIdKey: keyof Row;
  active: CellPos;
  activeCol: number;
  isEditing: boolean;
  readOnly: boolean;
  selectionBounds: { r1: number; r2: number; c1: number; c2: number } | null;
  copiedBounds: { r1: number; r2: number; c1: number; c2: number } | null;
  getColWidth: (c: number) => number;
  getValue: (r: number, c: number) => string;
  hasError: (r: number, c: number) => boolean;
  getError: (r: number, c: number) => string | null;
  isPreview: (r: number, c: number) => boolean;
  activeCellRef: React.RefObject<HTMLDivElement | null>;
  onCellMouseDown: (r: number, c: number, ev: React.MouseEvent) => void;
  onCellMouseEnter: (r: number, c: number, ev: React.MouseEvent) => void;
  onCellDoubleClick: (r: number, c: number) => void;
  onCheckboxToggle: (r: number, c: number) => void;
  onSelectOpen: (r: number, c: number) => void;
  onFillStart: (r: number, c: number, ev: React.MouseEvent) => void;
  onResizeStart: (c: number, ev: React.MouseEvent) => void;
  onResizeDoubleClick: (c: number, ev: React.MouseEvent) => void;
  onGroupToggle: (key: string) => void;
  filterOpenKey: string | null;
  filterSearch: string;
  getFilterOptions: (key: string) => string[];
  isFilterChecked: (key: string, value: string) => boolean;
  isFilterAllChecked: (key: string) => boolean;
  onFilterOpen: (key: string) => void;
  onFilterSearch: (value: string) => void;
  onFilterToggle: (key: string, value: string) => void;
  onFilterToggleAll: (key: string) => void;
};

export function XOnTableGrid<Row extends Record<string, any>>(props: GridProps<Row>) {
  const { columns, data, rowIdKey, active, isEditing, readOnly, selectionBounds, copiedBounds, getColWidth, getValue, hasError, getError, isPreview, activeCellRef, onCellMouseDown, onCellMouseEnter, onCellDoubleClick, onCheckboxToggle, onSelectOpen, onFillStart } = props;

  return (
    <div className="xontable">
      <XOnTableHeader {...props} />
      {data.map((row, r) => (
        <div className={["xontable-row", r % 2 === 1 ? "is-zebra" : ""].join(" ")} data-row={r} key={String(row[rowIdKey] ?? r)}>
          <div className={["xontable-cell", "xontable-rownum-cell", r === active.r ? "is-active-rownum" : ""].join(" ")} style={{ width: props.rowNumberWidth }}>
            {r + 1}
          </div>
          {columns.map(({ col, idx }, c) => {
            const isActive = active.r === r && active.c === c;
            const invalid = hasError(r, c);
            const preview = isPreview(r, c);
            const inSel = !!selectionBounds && r >= selectionBounds.r1 && r <= selectionBounds.r2 && c >= selectionBounds.c1 && c <= selectionBounds.c2;
            const inCopy = !!copiedBounds && r >= copiedBounds.r1 && r <= copiedBounds.r2 && c >= copiedBounds.c1 && c <= copiedBounds.c2;
            const selTop = inSel && selectionBounds && r === selectionBounds.r1;
            const selBottom = inSel && selectionBounds && r === selectionBounds.r2;
            const selLeft = inSel && selectionBounds && c === selectionBounds.c1;
            const selRight = inSel && selectionBounds && c === selectionBounds.c2;
            const copyTop = inCopy && copiedBounds && r === copiedBounds.r1;
            const copyBottom = inCopy && copiedBounds && r === copiedBounds.r2;
            const copyLeft = inCopy && copiedBounds && c === copiedBounds.c1;
            const copyRight = inCopy && copiedBounds && c === copiedBounds.c2;
            const isCheckbox = col.type === "checkbox";
            const isSelect = col.type === "select";
            const checked = row[col.key] === true || row[col.key] === "true";
            const isPlaceholder = idx == null;
            return (
              <div
                key={col.key + String(idx ?? c)}
                ref={isActive ? activeCellRef : null}
                data-row={r}
                data-col={c}
                className={[
                  "xontable-cell",
                  isActive ? "is-active" : "",
                  inSel ? "is-range" : "",
                  selTop ? "is-range-top" : "",
                  selRight ? "is-range-right" : "",
                  selBottom ? "is-range-bottom" : "",
                  selLeft ? "is-range-left" : "",
                  inCopy ? "is-copied-range" : "",
                  copyTop ? "is-copied-top" : "",
                  copyRight ? "is-copied-right" : "",
                  copyBottom ? "is-copied-bottom" : "",
                  copyLeft ? "is-copied-left" : "",
                  isCheckbox ? "is-checkbox" : "",
                  isSelect ? "is-select" : "",
                  invalid ? "is-invalid" : "",
                  preview ? "is-fill-preview" : "",
                ].join(" ")}
                style={{ width: getColWidth(c) }}
                title={invalid ? (getError(r, c) ?? "") : ""}
                onMouseDown={(ev) => onCellMouseDown(r, c, ev)}
                onMouseEnter={(ev) => onCellMouseEnter(r, c, ev)}
                onDoubleClick={() => onCellDoubleClick(r, c)}
              >
                {isCheckbox ? (
                  <input
                    type="checkbox"
                    className="xontable-checkbox"
                    name="xontable-checkbox"
                    checked={checked}
                    onChange={() => onCheckboxToggle(r, c)}
                    onClick={(ev) => ev.stopPropagation()}
                    onMouseDown={(ev) => ev.stopPropagation()}
                  />
                ) : (
                  isPlaceholder ? "" : getValue(r, c)
                )}
                {isSelect && !readOnly && !isEditing && (
                  <button
                    type="button"
                    className="xontable-select-trigger"
                    title="Open"
                    onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); onSelectOpen(r, c); }}
                  />
                )}
                {isActive && !isEditing && !readOnly && (
                  <div className="xontable-fill-handle" onMouseDown={(ev) => onFillStart(r, c, ev)} title="Drag to fill" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
