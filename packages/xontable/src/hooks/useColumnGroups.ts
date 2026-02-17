import { useCallback, useMemo, useState } from "react";
import type { ColumnDef } from "../types";

type GroupHeader = {
  key: string;
  label: string;
  width: number;
  collapsible: boolean;
  collapsed: boolean;
};

type GroupInfo<Row extends Record<string, any>> = {
  key: string;
  label: string;
  cols: Array<{ col: ColumnDef<Row>; idx: number }>;
  collapsible: boolean;
};

type VisibleCol<Row extends Record<string, any>> = { col: ColumnDef<Row>; idx: number | null };

type ColumnGroupsOptions<Row extends Record<string, any>> = {
  columns: ColumnDef<Row>[];
  collapsedWidth?: number;
};

export function useColumnGroups<Row extends Record<string, any>>(
  options: ColumnGroupsOptions<Row>,
) {
  const { columns, collapsedWidth = 56 } = options;
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [colWidths, setColWidths] = useState<number[]>(
    columns.map((c) => c.width ?? 140),
  );

  const groups = useMemo<GroupInfo<Row>[]>(() => {
    const list: GroupInfo<Row>[] = [];
    let lastKey = "";
    columns.forEach((col, idx) => {
      const gKey = col.group ?? `__col_${idx}`;
      const label = col.group ?? "";
      const collapsible = col.group != null && col.groupCollapsible !== false;
      if (list.length === 0 || lastKey !== gKey) {
        list.push({ key: gKey, label, cols: [{ col, idx }], collapsible });
        lastKey = gKey;
      } else {
        list[list.length - 1].cols.push({ col, idx });
        if (!collapsible) list[list.length - 1].collapsible = false;
      }
    });
    return list;
  }, [columns]);

  const visibleColumns = useMemo<VisibleCol<Row>[]>(() => {
    const out: VisibleCol<Row>[] = [];
    for (const g of groups) {
      const isCollapsed = g.collapsible && collapsed[g.key];
      if (!g.collapsible || !isCollapsed) {
        g.cols.forEach(({ col, idx }) => out.push({ col, idx }));
      } else {
        out.push({ col: { key: `__group_${g.key}`, label: "", editable: false }, idx: null });
      }
    }
    return out;
  }, [groups, collapsed]);

  const getColWidth = useCallback(
    (visibleIndex: number) => {
      const v = visibleColumns[visibleIndex];
      if (!v) return 140;
      if (v.idx == null) return collapsedWidth;
      return colWidths[v.idx] ?? 140;
    },
    [collapsedWidth, colWidths, visibleColumns],
  );

  const setColWidth = useCallback(
    (visibleIndex: number, w: number) => {
      const v = visibleColumns[visibleIndex];
      if (!v || v.idx == null) return;
      setColWidths((prev) => {
        const next = [...prev];
        next[v.idx as number] = w;
        return next;
      });
    },
    [visibleColumns],
  );

  const groupHeaders = useMemo<GroupHeader[]>(() => {
    return groups.map((g) => {
      const isCollapsed = g.collapsible && collapsed[g.key];
      const width = isCollapsed
        ? collapsedWidth
        : g.cols.reduce((sum, { idx }) => sum + (colWidths[idx] ?? 140), 0);
      return {
        key: g.key,
        label: g.label,
        width,
        collapsible: g.collapsible,
        collapsed: Boolean(isCollapsed),
      };
    });
  }, [collapsed, collapsedWidth, colWidths, groups]);

  const toggleGroup = useCallback(
    (key: string) => setCollapsed((p) => ({ ...p, [key]: !p[key] })),
    [],
  );

  const resetWidths = useCallback(() => {
    setColWidths((prev) => {
      if (!prev.length) return columns.map((c) => c.width ?? 140);
      return columns.map((c, i) => prev[i] ?? c.width ?? 140);
    });
  }, [columns]);

  const getOrigIndex = useCallback(
    (visibleIndex: number) => visibleColumns[visibleIndex]?.idx ?? null,
    [visibleColumns],
  );

  return {
    visibleColumns,
    groupHeaders,
    getColWidth,
    setColWidth,
    toggleGroup,
    resetWidths,
    getOrigIndex,
  };
}
