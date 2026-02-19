import React from "react";
import type { ColumnDef } from "../types";

type ErrorItem = { r: number; c: number; message: string };

type StatusBarProps<Row extends Record<string, any>> = {
  errors: ErrorItem[];
  columns: Array<{ col: ColumnDef<Row>; idx: number | null }>;
  onSelect: (r: number, c: number) => void;
};

export function XOnTableStatusBar<Row extends Record<string, any>>(props: StatusBarProps<Row>) {
  const { errors, columns, onSelect } = props;
  const total = errors.length;
  const visible = errors.slice(0, 3);
  const countLabel = total ? "Errors" : "No errors";
  return (
    <div className="xontable-status">
      <span className={["xontable-status-count", total ? "is-error" : ""].join(" ")}>
        <span className="xontable-status-num">{total}</span>
        <span className="xontable-status-label">{countLabel}</span>
      </span>
      {visible.map((e, idx) => {
        const col = columns[e.c]?.col;
        const label = col?.label ?? `Col ${e.c + 1}`;
        return (
          <button key={`${e.r}:${e.c}`} type="button" className={["xontable-status-item", "is-error", `is-chip-${idx % 3}`].join(" ")} onClick={() => onSelect(e.r, e.c)} title={e.message}>
            {`Row ${e.r + 1}, ${label}: ${e.message}`}
          </button>
        );
      })}
    </div>
  );
}
