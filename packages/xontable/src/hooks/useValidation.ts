import { useCallback, useMemo, useState } from "react";
import { cellKey } from "../utils/cellKey";
import type { ColumnDef } from "../types";

export function useValidation<Row extends Record<string, any>>(
  columns: ColumnDef<Row>[],
  getRow: (r: number) => Row | undefined,
  getValue: (r: number, c: number) => string,
) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCell = useCallback(
    (
      r: number,
      c: number,
      nextValue?: string,
      rowOverride?: Row,
    ) => {
      const col = columns[c];
      if (!col) return null;

      const raw = nextValue ?? getValue(r, c);
      const value = raw == null ? "" : String(raw);
      const rowObj = rowOverride ?? getRow(r);

      // default simple validators by type (optional)
      if (col.type === "number" && value.trim() !== "" && Number.isNaN(Number(value))) {
        return "Must be a number";
      }

      if (col.type === "checkbox") {
        const v = typeof nextValue === "boolean" ? String(nextValue) : value.trim().toLowerCase();
        if (v !== "true" && v !== "false") return "Must be true or false";
      }

      if (col.validator) return col.validator(value, rowObj as Row);
      return null;
    },
    [columns, getRow, getValue],
  );

  const setCellError = useCallback(
    (r: number, c: number, msg: string | null) => {
      const k = cellKey(r, c);
      setErrors((prev) => {
        const next = { ...prev };
        if (!msg) delete next[k];
        else next[k] = msg;
        return next;
      });
    },
    [],
  );

  const hasError = useCallback(
    (r: number, c: number) => {
      return Boolean(errors[cellKey(r, c)]);
    },
    [errors],
  );

  const getError = useCallback(
    (r: number, c: number) => errors[cellKey(r, c)] ?? null,
    [errors],
  );

  const api = useMemo(
    () => ({ errors, validateCell, setCellError, hasError, getError }),
    [errors, validateCell, setCellError, hasError, getError],
  );

  return api;
}
