import { useCallback, useMemo, useState } from "react";
import type { ColumnDef } from "../types";

type FiltersResult<Row extends Record<string, any>> = {
  filterOpenKey: string | null;
  filterSearch: string;
  rowFilter: (row: Row) => boolean;
  getFilterOptions: (key: string) => string[];
  isFilterChecked: (key: string, value: string) => boolean;
  isAllChecked: (key: string) => boolean;
  openFilter: (key: string) => void;
  closeFilter: () => void;
  setFilterSearch: (value: string) => void;
  toggleFilterValue: (key: string, value: string) => void;
  toggleAll: (key: string) => void;
};

export function useColumnFilters<Row extends Record<string, any>>(columns: ColumnDef<Row>[], rows: Row[]): FiltersResult<Row> {
  const [filters, setFilters] = useState<Record<string, Set<string>>>({});
  const [filterOpenKey, setFilterOpenKey] = useState<string | null>(null);
  const [filterSearch, setFilterSearch] = useState("");

  const rowFilter = useCallback((row: Row) => {
    for (const key of Object.keys(filters)) {
      const set = filters[key]; if (!set) continue; if (set.size === 0) return false;
      const v = row[key as keyof Row]; const s = v == null ? "" : String(v);
      if (!set.has(s)) return false;
    }
    if (filterOpenKey && filterSearch.trim() !== "") {
      const v = row[filterOpenKey as keyof Row]; const s = v == null ? "" : String(v);
      if (!s.toLowerCase().includes(filterSearch.toLowerCase())) return false;
    }
    return true;
  }, [filterOpenKey, filterSearch, filters]);

  const filterOptions = useMemo(() => {
    const map = new Map<string, string[]>();
    columns.forEach((col) => {
      const set = new Set<string>();
      rows.forEach((r) => set.add(String(r[col.key] ?? "")));
      map.set(col.key, Array.from(set).sort());
    });
    return map;
  }, [columns, rows]);

  const getFilterOptions = useCallback((key: string) => {
    const list = filterOptions.get(key) ?? [];
    if (!filterSearch || filterOpenKey !== key) return list;
    const q = filterSearch.toLowerCase();
    return list.filter((v) => v.toLowerCase().includes(q));
  }, [filterOpenKey, filterOptions, filterSearch]);

  const isFilterChecked = useCallback((key: string, value: string) => {
    const set = filters[key]; return !set || set.has(value);
  }, [filters]);

  const isAllChecked = useCallback((key: string) => !filters[key], [filters]);

  const toggleFilterValue = useCallback((key: string, value: string) => {
    const all = filterOptions.get(key) ?? [];
    setFilters((prev) => {
      const cur = prev[key]; const next = cur ? new Set(cur) : new Set(all);
      if (next.has(value)) next.delete(value); else next.add(value);
      const out = { ...prev } as Record<string, Set<string>>;
      if (next.size === all.length) delete out[key]; else out[key] = next;
      return out;
    });
  }, [filterOptions]);

  const toggleAll = useCallback((key: string) => {
    setFilters((prev) => {
      const next = { ...prev } as Record<string, Set<string>>;
      if (next[key]) delete next[key]; else next[key] = new Set();
      return next;
    });
  }, []);

  const openFilter = useCallback((key: string) => {
    setFilterOpenKey((k) => (k === key ? null : key));
    setFilterSearch("");
  }, []);

  const closeFilter = useCallback(() => {
    setFilterOpenKey(null);
    setFilterSearch("");
  }, []);

  return {
    filterOpenKey,
    filterSearch,
    rowFilter,
    getFilterOptions,
    isFilterChecked,
    isAllChecked,
    openFilter,
    closeFilter,
    setFilterSearch,
    toggleFilterValue,
    toggleAll,
  };
}
