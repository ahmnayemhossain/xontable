import { useCallback, useRef, useState } from "react";
import type { ColumnDef } from "../types";

type Option = { value: string; label: string };

type SelectOptionsResult<Row extends Record<string, any>> = {
  getOptions: (row: Row, col: ColumnDef<Row>) => Option[];
  ensureOptions: (row: Row, col: ColumnDef<Row>) => void;
  isLoading: (row: Row, col: ColumnDef<Row>) => boolean;
  preloadOptions: (rows: Row[], cols: ColumnDef<Row>[]) => Promise<void>;
};

export function useSelectOptions<Row extends Record<string, any>>(
  columns: ColumnDef<Row>[],
): SelectOptionsResult<Row> {
  const cacheRef = useRef<Record<string, Option[]>>({});
  const loadingRef = useRef<Record<string, boolean>>({});
  const [, bump] = useState(0);

  const keyFor = useCallback((row: Row, col: ColumnDef<Row>) => {
    const dep = col.dependsOn ? String((row as any)[col.dependsOn] ?? "") : "";
    const rid = String((row as any).id ?? (row as any)._id ?? "");
    return `${rid}|${col.key}|${dep}`;
  }, []);

  const getOptions = useCallback(
    (row: Row, col: ColumnDef<Row>) => {
      if (col.options) return col.options;
      const key = keyFor(row, col);
      return cacheRef.current[key] ?? [];
    },
    [keyFor],
  );

  const isLoading = useCallback(
    (row: Row, col: ColumnDef<Row>) => {
      const key = keyFor(row, col);
      return Boolean(loadingRef.current[key]);
    },
    [keyFor],
  );

  const loadOptions = useCallback(
    (row: Row, col: ColumnDef<Row>) => {
      if (col.options || !col.getOptions) return;
      const key = keyFor(row, col);
      if (cacheRef.current[key] || loadingRef.current[key]) return;
      loadingRef.current[key] = true;
      col.getOptions(row).then((opts) => {
        cacheRef.current[key] = opts ?? [];
        loadingRef.current[key] = false;
        bump((v) => v + 1);
      });
    },
    [keyFor],
  );

  const ensureOptions = loadOptions;

  const preloadOptions = useCallback(async (rows: Row[], cols: ColumnDef<Row>[]) => {
    const tasks: Promise<void>[] = [];
    rows.forEach((row) => {
      cols.forEach((col) => {
        if (col.options || !col.getOptions) return;
        const key = keyFor(row, col);
        if (cacheRef.current[key]) return;
        if (!loadingRef.current[key]) loadingRef.current[key] = true;
        tasks.push(col.getOptions(row).then((opts) => {
          cacheRef.current[key] = opts ?? [];
          loadingRef.current[key] = false;
        }));
      });
    });
    if (tasks.length) { await Promise.allSettled(tasks); bump((v) => v + 1); }
  }, [keyFor]);

  return { getOptions, ensureOptions, isLoading, preloadOptions };
}
