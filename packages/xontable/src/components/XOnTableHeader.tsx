import React from "react";
import { Filter, Minus, Plus } from "lucide-react";
import type { ColumnDef } from "../types";
import { ColumnFilterMenu } from "./ColumnFilterMenu";

type GroupHeader = { key: string; label: string; width: number; collapsible: boolean; collapsed: boolean };

type HeaderProps<Row extends Record<string, any>> = {
  columns: Array<{ col: ColumnDef<Row>; idx: number | null }>;
  groups?: GroupHeader[];
  rowNumberWidth: number;
  activeCol: number;
  getColWidth: (c: number) => number;
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

export function XOnTableHeader<Row extends Record<string, any>>(props: HeaderProps<Row>) {
  const { columns, groups, rowNumberWidth, activeCol, getColWidth, onResizeStart, onResizeDoubleClick, onGroupToggle, filterOpenKey, filterSearch, getFilterOptions, isFilterChecked, isFilterAllChecked, onFilterOpen, onFilterSearch, onFilterToggle, onFilterToggleAll } = props;

  return (
    <>
      {groups && groups.length > 0 && (
        <div className="xontable-row xontable-group-row">
          <div className="xontable-cell xontable-rownum-cell xontable-group-cell" style={{ width: rowNumberWidth }} />
          {groups.map((g) => (
            <div key={g.key} className="xontable-cell xontable-group-cell" style={{ width: g.width }}>
              <span className="xontable-group-label">{g.label}</span>
              {g.collapsible && (
                <button type="button" className="xontable-group-toggle" onClick={() => onGroupToggle(g.key)} title={g.collapsed ? "Expand" : "Collapse"}>
                  {g.collapsed ? <Plus size={12} /> : <Minus size={12} />}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="xontable-row xontable-head">
        <div className="xontable-cell xontable-rownum-cell xontable-head-cell" style={{ width: rowNumberWidth }} />
        {columns.map(({ col, idx }, c) => (
          <div key={col.key + String(idx ?? c)} className={["xontable-cell", "xontable-head-cell", c === activeCol ? "is-active-col-head" : ""].join(" ")} style={{ width: getColWidth(c) }}>
            <span className="xontable-head-label">{col.label}</span>
            {idx != null && (
              <>
                <button type="button" className="xontable-filter-btn" onClick={() => onFilterOpen(col.key)} title="Filter">
                  <Filter size={14} />
                </button>
                <div className="xontable-col-resizer" onMouseDown={(ev) => onResizeStart(c, ev)} onDoubleClick={(ev) => onResizeDoubleClick(c, ev)} title="Drag to resize" />
                <ColumnFilterMenu
                  isOpen={filterOpenKey === col.key}
                  search={filterSearch}
                  options={getFilterOptions(col.key)}
                  allChecked={isFilterAllChecked(col.key)}
                  isChecked={(v) => isFilterChecked(col.key, v)}
                  onSearchChange={onFilterSearch}
                  onToggle={(v) => onFilterToggle(col.key, v)}
                  onToggleAll={() => onFilterToggleAll(col.key)}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
