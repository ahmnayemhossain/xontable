# xontable Developer Book

## Preface

This book explains the xontable package line by line. It is designed as a deep course document for package developers and maintainers. Every source line is explained so you can understand the full flow and intent.

## Table of Contents

1. Overview and Architecture
2. Public API
3. Components
4. Hooks
5. Utilities
6. Styles
7. Entry Points
8. Notes for Maintainers
9. Line-By-Line Source Walkthrough

## 1. Overview and Architecture

xontable is a React + TypeScript spreadsheet-like grid. It uses div-based layout, controlled-ish data updates, and a set of hooks for behavior such as selection, clipboard, editing, and filters.

Key ideas:

- The grid is a composition of `XOnTable`, `XOnTableGrid`, `XOnTableHeader`, and small feature hooks.
- Updates flow through `useTableModel`, which handles data state, filtering view, and undo/redo.
- Selection and copy/paste are handled by `useRangeSelection` and `useClipboardCatcher`.
- Select dropdowns are powered by `useSelectOptions` and `SelectMenu`.
- Validation is centralized in `useValidation`.

## 2. Public API

The public API exports:

- `XOnTable` component
- Types: `XOnTableProps`, `XOnTableMeta`, `ColumnDef`, `ColumnType`, `CellPos`
- Styles entry: `xontable/styles`

## 3. Components

- `XOnTable` orchestrates all hooks and renders the grid + editor overlay + select menu.
- `XOnTableGrid` renders rows/cells and calls handlers.
- `XOnTableHeader` renders header rows, group toggles, filters, and resizers.
- `SelectMenu` renders select dropdown.
- `ColumnFilterMenu` renders filter UI.

## 4. Hooks

- `useTableModel` manages data, filtering, validation, and undo/redo.
- `useEditorOverlay` manages edit input positioning and commit/cancel.
- `useClipboardCatcher` handles TSV copy/paste via hidden textarea.
- `useRangeSelection` handles drag selection and bounds.
- `useGridKeydown` handles keyboard navigation and edit start.
- `useFillHandle` handles drag-to-fill.
- `useSelectOptions` handles async options and caching.
- `useColumnGroups` and `useColumnResize` handle grouped headers and resize logic.
- `useColumnFilters` handles filtering state and filter UI logic.
- `useOutsideClick` handles filter close on outside click or Esc.

## 5. Utilities

- `cellKey` creates stable string keys for validation map.
- `tsv` parse and serialize blocks for clipboard.

## 6. Styles

The CSS files split base layout, filter menu styling, and theme overrides:

- `xontable.base.css` main layout and visuals
- `xontable.filter.css` filter menu styles
- `xontable.theme.css` dark theme overrides
- `xontable.css` imports all of the above

## 7. Entry Points

- `src/index.ts` re-exports components and types.
- `src/styles/xontable.css` is the style entry for consumers.

## 8. Notes for Maintainers

- Keep each file under 150 lines.
- `useTableModel` is the single source of data truth.
- Selection and copy logic are separate to avoid interfering with editing.
- Avoid HTML tables; always use div-based grid.

## 9. Line-By-Line Source Walkthrough

### File: `packages/xontable/src/types.ts`

1. `export type CellPos = { r: number; c: number };` Defines a cell position by row and column index.
2. Blank line for readability.
3. `export type ColumnType = "text" | "number" | "date" | "select" | "checkbox";` Defines supported column types.
4. Blank line for readability.
5. `export type ColumnDef<Row extends Record<string, any> = any> = {` Starts the column definition interface.
6. `key: string;` Column key used to read/write row fields.
7. `label: string;` Human-readable column label.
8. `width?: number;` Optional initial width.
9. `group?: string;` Optional group header label.
10. `groupCollapsible?: boolean;` Allow group collapse for this column.
11. `type?: ColumnType;` Column type for editing and rendering.
12. `options?: Array<{ value: string; label: string }>;` Static select options.
13. `getOptions?: (row: Row) => Promise<Array<{ value: string; label: string }>>;` Async options provider.
14. `dependsOn?: string;` Parent field for cascading selects.
15. `editable?: boolean;` Flag to disable edits on a column.
16. `validator?: (value: string, row: Row) => string | null;` Custom validator for a cell.
17. `};` Ends `ColumnDef`.
18. Blank line for readability.
19. `export type XOnTableMeta = {` Starts change meta type.
20. `type: "edit" | "paste" | "fill" | "undo" | "redo";` Operation type for changes.
21. `cell: CellPos;` The primary cell for the change.
22. `};` Ends meta type.
23. Blank line for readability.
24. `export type XOnTableProps<Row extends Record<string, any> = any> = {` Starts component props.
25. `columns: ColumnDef<Row>[];` Column definitions.
26. `rows: Row[];` Table data rows.
27. `rowIdKey?: keyof Row; // default: "id"` Row id field name.
28. `readOnly?: boolean;` Disable edits when true.
29. `theme?: "light" | "dark";` Theme selection.
30. `onChange?: (rows: Row[], meta: XOnTableMeta) => void;` Change callback.
31. `};` Ends props type.

### File: `packages/xontable/src/index.ts`

1. `export { XOnTable } from "./XOnTable";` Exposes the main component.
2. `export type {` Starts a type export block.
3. `XOnTableProps,` Re-exports the props type.
4. `XOnTableMeta,` Re-exports meta type.
5. `ColumnDef,` Re-exports column definition type.
6. `ColumnType,` Re-exports column type union.
7. `CellPos,` Re-exports cell position type.
8. `} from "./types";` Ends the export block.

### File: `packages/xontable/src/utils/cellKey.ts`

1. `export function cellKey(r: number, c: number) {` Starts key generator.
2. `return `${r}:${c}`;` Returns a string key `"row:col"` for maps.
3. `}` Ends the function.

### File: `packages/xontable/src/utils/range.ts`

This file is currently empty. It is reserved for future range utilities.

### File: `packages/xontable/src/utils/tsv.ts`

1. `export function parseTSV(text: string): string[][] {` Starts TSV parser.
2. `const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");` Normalizes line breaks and splits into rows.
3. `if (lines.length && lines[lines.length - 1] === "") lines.pop();` Removes trailing empty row.
4. `return lines.map((line) => line.split("\t"));` Splits rows into tab-separated cells.
5. `}` Ends parser.
6. Blank line for readability.
7. `export function toTSV(block: string[][]): string {` Starts TSV serializer.
8. `return block.map((row) => row.join("\t")).join("\n");` Joins rows and columns into TSV text.
9. `}` Ends serializer.

### File: `packages/xontable/src/hooks/useClipboard.ts`

This file is currently empty. It is reserved for future clipboard helpers.

### File: `packages/xontable/src/hooks/useClipboardCatcher.ts`

1. `import { useCallback, useRef } from "react";` Imports React hooks.
2. `import type { ClipboardEvent } from "react";` Imports clipboard event type.
3. `import { parseTSV, toTSV } from "../utils/tsv";` Imports TSV helpers.
4. Blank line for readability.
5. `type ClipboardCatcherOptions = {` Starts options type.
6. `isEditing: boolean;` Prevents clipboard during edit.
7. `getCopyBlock: () => string[][];` Provides data to copy.
8. `onPasteBlock: (block: string[][]) => void;` Handles pasted block.
9. `onCopy?: () => void;` Optional hook for copy side effects.
10. `};` Ends options type.
11. Blank line for readability.
12. `export function useClipboardCatcher(options: ClipboardCatcherOptions) {` Hook entry.
13. `const { isEditing, getCopyBlock, onPasteBlock, onCopy: onCopyCb } = options;` Destructures options.
14. `const clipRef = useRef<HTMLTextAreaElement | null>(null);` Hidden textarea ref.
15. Blank line for readability.
16. `const focusClipboard = useCallback(() => {` Focus helper.
17. `clipRef.current?.focus();` Focuses hidden textarea.
18. `clipRef.current?.select();` Selects text to allow Ctrl+C.
19. `}, []);` Memoized with no deps.
20. Blank line for readability.
21. `const onCopy = useCallback(` Starts copy handler.
22. `(e: ClipboardEvent) => {` Event handler.
23. `if (isEditing) return;` No copy during edit.
24. `e.preventDefault();` Prevents default copy.
25. `const block = getCopyBlock();` Gets data block.
26. `e.clipboardData.setData("text/plain", toTSV(block));` Writes TSV to clipboard.
27. `onCopyCb?.();` Fires optional copy callback.
28. `},` Ends handler.
29. `[getCopyBlock, isEditing, onCopyCb],` Dependencies.
30. `);` Ends useCallback.
31. Blank line for readability.
32. `const onPaste = useCallback(` Starts paste handler.
33. `(e: ClipboardEvent) => {` Event handler.
34. `if (isEditing) return;` No paste during edit.
35. `e.preventDefault();` Prevents default paste.
36. `const text = e.clipboardData.getData("text/plain");` Reads TSV text.
37. `const block = parseTSV(text);` Parses TSV.
38. `if (block.length === 0) return;` Ignores empty paste.
39. `onPasteBlock(block);` Calls paste handler.
40. `},` Ends handler.
41. `[isEditing, onPasteBlock],` Dependencies.
42. `);` Ends useCallback.
43. Blank line for readability.
44. `return { clipRef, focusClipboard, onCopy, onPaste };` Exposes API.
45. `}` Ends hook.
### File: `packages/xontable/src/hooks/useColumnFilters.ts`

1. `import { useCallback, useMemo, useState } from "react";` React hooks.
2. `import type { ColumnDef } from "../types";` Column type.
3. Blank line for readability.
4. `type FiltersResult<Row extends Record<string, any>> = {` Starts result type.
5. `filterOpenKey: string | null;` Which column filter is open.
6. `filterSearch: string;` Search input value.
7. `rowFilter: (row: Row) => boolean;` Row filtering function.
8. `getFilterOptions: (key: string) => string[];` Options list per column.
9. `isFilterChecked: (key: string, value: string) => boolean;` Value checked state.
10. `isAllChecked: (key: string) => boolean;` All option state.
11. `openFilter: (key: string) => void;` Open/close filter for column.
12. `closeFilter: () => void;` Close any filter.
13. `setFilterSearch: (value: string) => void;` Update search text.
14. `toggleFilterValue: (key: string, value: string) => void;` Toggle a value.
15. `toggleAll: (key: string) => void;` Toggle all values.
16. `};` Ends result type.
17. Blank line for readability.
18. `export function useColumnFilters<Row extends Record<string, any>>(columns: ColumnDef<Row>[], rows: Row[]): FiltersResult<Row> {` Hook start.
19. `const [filters, setFilters] = useState<Record<string, Set<string>>>({});` Active filters map.
20. `const [filterOpenKey, setFilterOpenKey] = useState<string | null>(null);` Open column key.
21. `const [filterSearch, setFilterSearch] = useState("");` Search string.
22. Blank line for readability.
23. `const rowFilter = useCallback((row: Row) => {` Build row filter.
24. `for (const key of Object.keys(filters)) {` Iterate filters.
25. `const set = filters[key]; if (!set) continue; if (set.size === 0) return false;` Skip missing, handle empty set as hide all.
26. `const v = row[key as keyof Row]; const s = v == null ? "" : String(v);` Normalize value.
27. `if (!set.has(s)) return false;` Exclude if not selected.
28. `}` Ends filter loop.
29. `if (filterOpenKey && filterSearch.trim() !== "") {` Apply search only when open.
30. `const v = row[filterOpenKey as keyof Row]; const s = v == null ? "" : String(v);` Get search value.
31. `if (!s.toLowerCase().includes(filterSearch.toLowerCase())) return false;` Search match.
32. `}` Ends search block.
33. `return true;` Keep row.
34. `}, [filterOpenKey, filterSearch, filters]);` Dependencies.
35. Blank line for readability.
36. `const filterOptions = useMemo(() => {` Compute options per column.
37. `const map = new Map<string, string[]>();` Map for options.
38. `columns.forEach((col) => {` Loop columns.
39. `const set = new Set<string>();` Unique values set.
40. `rows.forEach((r) => set.add(String(r[col.key] ?? "")));` Collect values.
41. `map.set(col.key, Array.from(set).sort());` Store sorted options.
42. `});` End columns loop.
43. `return map;` Return options map.
44. `}, [columns, rows]);` Dependencies.
45. Blank line for readability.
46. `const getFilterOptions = useCallback((key: string) => {` Get options for column.
47. `const list = filterOptions.get(key) ?? [];` Base list.
48. `if (!filterSearch || filterOpenKey !== key) return list;` No filtering unless open.
49. `const q = filterSearch.toLowerCase();` Lower-case query.
50. `return list.filter((v) => v.toLowerCase().includes(q));` Filter options.
51. `}, [filterOpenKey, filterOptions, filterSearch]);` Dependencies.
52. Blank line for readability.
53. `const isFilterChecked = useCallback((key: string, value: string) => {` Checked state.
54. `const set = filters[key]; return !set || set.has(value);` Default to checked.
55. `}, [filters]);` Dependencies.
56. Blank line for readability.
57. `const isAllChecked = useCallback((key: string) => !filters[key], [filters]);` All checked if no filter set.
58. Blank line for readability.
59. `const toggleFilterValue = useCallback((key: string, value: string) => {` Toggle single value.
60. `const all = filterOptions.get(key) ?? [];` Full list.
61. `setFilters((prev) => {` Update state.
62. `const cur = prev[key]; const next = cur ? new Set(cur) : new Set(all);` Start from all.
63. `if (next.has(value)) next.delete(value); else next.add(value);` Toggle.
64. `const out = { ...prev } as Record<string, Set<string>>;` Clone state.
65. `if (next.size === all.length) delete out[key]; else out[key] = next;` Remove filter if all selected.
66. `return out;` Return new filters.
67. `});` End state update.
68. `}, [filterOptions]);` Dependencies.
69. Blank line for readability.
70. `const toggleAll = useCallback((key: string) => {` Toggle all on/off.
71. `setFilters((prev) => {` Update state.
72. `const next = { ...prev } as Record<string, Set<string>>;` Clone.
73. `if (next[key]) delete next[key]; else next[key] = new Set();` Empty set means none selected.
74. `return next;` Return.
75. `});` End state update.
76. `}, []);` No deps.
77. Blank line for readability.
78. `const openFilter = useCallback((key: string) => {` Open/close filter.
79. `setFilterOpenKey((k) => (k === key ? null : key));` Toggle open.
80. `setFilterSearch("");` Reset search.
81. `}, []);` No deps.
82. Blank line for readability.
83. `const closeFilter = useCallback(() => {` Close filter.
84. `setFilterOpenKey(null);` Clear open key.
85. `setFilterSearch("");` Reset search.
86. `}, []);` No deps.
87. Blank line for readability.
88. `return {` Return API.
89. `filterOpenKey,` Expose open key.
90. `filterSearch,` Expose search string.
91. `rowFilter,` Expose row filter function.
92. `getFilterOptions,` Expose options getter.
93. `isFilterChecked,` Expose checked getter.
94. `isAllChecked,` Expose all checked state.
95. `openFilter,` Expose open handler.
96. `closeFilter,` Expose close handler.
97. `setFilterSearch,` Expose search setter.
98. `toggleFilterValue,` Expose value toggle.
99. `toggleAll,` Expose all toggle.
100. `};` End return object.
101. `}` Ends hook.

### File: `packages/xontable/src/hooks/useColumnGroups.ts`

1. `import { useCallback, useMemo, useState } from "react";` React hooks.
2. `import type { ColumnDef } from "../types";` Column type.
3. Blank line for readability.
4. `type GroupHeader = {` Starts header type.
5. `key: string;` Group key.
6. `label: string;` Group label.
7. `width: number;` Group total width.
8. `collapsible: boolean;` Collapsible flag.
9. `collapsed: boolean;` Collapsed state.
10. `};` Ends header type.
11. Blank line.
12. `type GroupInfo<Row> = {` Internal group info.
13. `key: string;` Key.
14. `label: string;` Label.
15. `cols: Array<{ col: ColumnDef<Row>; idx: number }>;` Columns in group.
16. `collapsible: boolean;` Collapsible flag.
17. `};` Ends group info.
18. Blank line.
19. `type VisibleCol<Row> = { col: ColumnDef<Row>; idx: number | null };` Visible column mapping type.
20. Blank line.
21. `type ColumnGroupsOptions<Row> = {` Options type.
22. `columns: ColumnDef<Row>[];` Input columns.
23. `collapsedWidth?: number;` Width for collapsed group.
24. `};` Ends options.
25. Blank line.
26. `export function useColumnGroups<Row extends Record<string, any>>(options: ColumnGroupsOptions<Row>,) {` Hook start.
27. `const { columns, collapsedWidth = 56 } = options;` Destructure and default width.
28. `const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});` Collapsed state map.
29. `const [colWidths, setColWidths] = useState<number[]>(columns.map((c) => c.width ?? 140),);` Widths per original column.
30. Blank line.
31. `const groups = useMemo<GroupInfo<Row>[]>(() => {` Build grouped columns.
32. `const list: GroupInfo<Row>[] = [];` Initialize list.
33. `let lastKey = "";` Track group transitions.
34. `columns.forEach((col, idx) => {` Iterate columns.
35. `const gKey = col.group ?? `__col_${idx}`;` Group key; each ungrouped column unique.
36. `const label = col.group ?? "";` Group label.
37. `const collapsible = col.group != null && col.groupCollapsible !== false;` Collapsible if grouped and not disabled.
38. `if (list.length === 0 || lastKey !== gKey) {` Start new group.
39. `list.push({ key: gKey, label, cols: [{ col, idx }], collapsible });` Push first column.
40. `lastKey = gKey;` Update key.
41. `} else {` Same group.
42. `list[list.length - 1].cols.push({ col, idx });` Add column to group.
43. `if (!collapsible) list[list.length - 1].collapsible = false;` If any col blocks collapse, disable.
44. `}` Ends grouping block.
45. `});` Ends columns loop.
46. `return list;` Return grouped list.
47. `}, [columns]);` Dependencies.
48. Blank line.
49. `const visibleColumns = useMemo<VisibleCol<Row>[]>(() => {` Build visible columns.
50. `const out: VisibleCol<Row>[] = [];` Init output.
51. `for (const g of groups) {` Loop groups.
52. `const isCollapsed = g.collapsible && collapsed[g.key];` Collapsed flag.
53. `if (!g.collapsible || !isCollapsed) {` Show actual columns.
54. `g.cols.forEach(({ col, idx }) => out.push({ col, idx }));` Append each.
55. `} else {` Collapsed group.
56. `out.push({ col: { key: `__group_${g.key}`, label: "", editable: false }, idx: null });` Insert placeholder column.
57. `}` End collapse branch.
58. `}` End loop.
59. `return out;` Return visible columns.
60. `}, [groups, collapsed]);` Dependencies.
61. Blank line.
62. `const getColWidth = useCallback(` Starts width getter.
63. `(visibleIndex: number) => {` Getter function.
64. `const v = visibleColumns[visibleIndex];` Get visible column.
65. `if (!v) return 140;` Default width.
66. `if (v.idx == null) return collapsedWidth;` Collapsed placeholder width.
67. `return colWidths[v.idx] ?? 140;` Width by original index.
68. `},` End getter.
69. `[collapsedWidth, colWidths, visibleColumns],` Dependencies.
70. `);` Ends callback.
71. Blank line.
72. `const setColWidth = useCallback(` Starts setter.
73. `(visibleIndex: number, w: number) => {` Setter.
74. `const v = visibleColumns[visibleIndex];` Get visible column.
75. `if (!v || v.idx == null) return;` Ignore placeholders.
76. `setColWidths((prev) => {` Update widths.
77. `const next = [...prev];` Clone array.
78. `next[v.idx as number] = w;` Update width.
79. `return next;` Return new array.
80. `});` End state update.
81. `},` End setter.
82. `[visibleColumns],` Dependencies.
83. `);` Ends callback.
84. Blank line.
85. `const groupHeaders = useMemo<GroupHeader[]>(() => {` Compute group headers.
86. `return groups.map((g) => {` Map group to header.
87. `const isCollapsed = g.collapsible && collapsed[g.key];` Collapsed flag.
88. `const width = isCollapsed ? collapsedWidth : g.cols.reduce((sum, { idx }) => sum + (colWidths[idx] ?? 140), 0);` Total width.
89. `return {` Build header object.
90. `key: g.key,` Key.
91. `label: g.label,` Label.
92. `width,` Width.
93. `collapsible: g.collapsible,` Collapsible flag.
94. `collapsed: Boolean(isCollapsed),` Collapsed state.
95. `};` End header object.
96. `});` End map.
97. `}, [collapsed, collapsedWidth, colWidths, groups]);` Dependencies.
98. Blank line.
99. `const toggleGroup = useCallback(` Toggle group.
100. `(key: string) => setCollapsed((p) => ({ ...p, [key]: !p[key] })),` Invert collapse.
101. `[],` No deps.
102. `);` Ends callback.
103. Blank line.
104. `const resetWidths = useCallback(` Reset widths to column defaults.
105. `() => setColWidths(columns.map((c) => c.width ?? 140)),` Rebuild widths array.
106. `[columns],` Dependencies.
107. `);` Ends callback.
108. Blank line.
109. `const getOrigIndex = useCallback(` Get original index.
110. `(visibleIndex: number) => visibleColumns[visibleIndex]?.idx ?? null,` Returns original index or null.
111. `[visibleColumns],` Dependencies.
112. `);` Ends callback.
113. Blank line.
114. `return {` Hook return.
115. `visibleColumns,` Expose visible columns.
116. `groupHeaders,` Expose group header data.
117. `getColWidth,` Expose width getter.
118. `setColWidth,` Expose width setter.
119. `toggleGroup,` Expose group toggle.
120. `resetWidths,` Expose width reset.
121. `getOrigIndex,` Expose original index.
122. `};` End return.
123. `}` Ends hook.

### File: `packages/xontable/src/hooks/useColumnResize.ts`

1. `import { useCallback, useEffect, useState } from "react";` React hooks.
2. Blank line.
3. `type DragState = { col: number; startX: number; startW: number };` Resize drag state.
4. Blank line.
5. `type ResizeOptions = {` Options type.
6. `colCount: number;` Total columns.
7. `getWidth: (c: number) => number;` Width getter.
8. `setWidth: (c: number, w: number) => void;` Width setter.
9. `minWidth?: number;` Minimum width.
10. `};` Ends options.
11. Blank line.
12. `export function useColumnResize(options: ResizeOptions) {` Hook start.
13. `const { colCount, getWidth, setWidth, minWidth = 60 } = options;` Destructure with default.
14. `const [drag, setDrag] = useState<DragState | null>(null);` Drag state.
15. Blank line.
16. `const startResize = useCallback(` Start resize.
17. `(col: number, startX: number) => {` Handler.
18. `if (col < 0 || col >= colCount) return;` Guard invalid column.
19. `setDrag({ col, startX, startW: getWidth(col) });` Initialize drag.
20. `},` End handler.
21. `[colCount, getWidth],` Dependencies.
22. `);` Ends callback.
23. Blank line.
24. `useEffect(() => {` Side effect for drag.
25. `if (!drag) return;` Only when dragging.
26. Blank line.
27. `const onMove = (e: MouseEvent) => {` Mouse move handler.
28. `const dx = e.clientX - drag.startX;` Delta from start.
29. `const next = Math.max(minWidth, drag.startW + dx);` Clamp width.
30. `setWidth(drag.col, next);` Apply width.
31. `};` End move handler.
32. Blank line.
33. `const onUp = () => setDrag(null);` Stop dragging on mouse up.
34. Blank line.
35. `window.addEventListener("mousemove", onMove);` Listen move.
36. `window.addEventListener("mouseup", onUp);` Listen up.
37. `return () => {` Cleanup.
38. `window.removeEventListener("mousemove", onMove);` Remove move.
39. `window.removeEventListener("mouseup", onUp);` Remove up.
40. `};` End cleanup.
41. `}, [drag, minWidth, setWidth]);` Dependencies.
42. Blank line.
43. `return { startResize, isResizing: Boolean(drag) };` Expose API.
44. `}` Ends hook.

### File: `packages/xontable/src/hooks/useEditor.ts`

This file is currently empty. It is reserved for future editor helpers.

### File: `packages/xontable/src/hooks/useEditorOverlay.ts`

1. `import { useCallback, useRef, useState } from "react";` React hooks.
2. `import type { KeyboardEvent, RefObject } from "react";` Types.
3. `import type { CellPos } from "../types";` Cell position type.
4. Blank line.
5. `type EditorOptions = {` Options type.
6. `active: CellPos;` Active cell.
7. `activeCellRef: RefObject<HTMLDivElement | null>;` Ref to active cell element.
8. `getValue: (r: number, c: number) => string;` Getter for current value.
9. `onCommit: (value: string) => void;` Commit callback.
10. `onCancel?: () => void;` Optional cancel callback.
11. `onTab?: (dir: number) => void;` Optional tab navigation.
12. `onEnter?: (dir: number) => void;` Optional enter navigation.
13. `};` End options.
14. Blank line.
15. `export function useEditorOverlay(options: EditorOptions) {` Hook start.
16. `const { active, activeCellRef, getValue, onCommit, onCancel, onTab, onEnter } = options;` Destructure.
17. `const [isEditing, setIsEditing] = useState(false);` Editing state.
18. `const [draft, setDraft] = useState("");` Draft value.
19. `const [editorRect, setEditorRect] = useState<DOMRect | null>(null);` Overlay rect.
20. `const [selectAll, setSelectAll] = useState(true);` Select-all flag.
21. `const editorRef = useRef<HTMLInputElement | null>(null);` Input ref.
22. Blank line.
23. `const measureRect = useCallback(() => {` Measure active cell.
24. `const el = activeCellRef.current;` Get cell element.
25. `if (!el) return;` Guard.
26. `setEditorRect(el.getBoundingClientRect());` Save cell rect.
27. `requestAnimationFrame(() => {` Defer focus.
28. `const input = editorRef.current;` Get input.
29. `if (!input) return;` Guard.
30. `input.focus();` Focus input.
31. `if (selectAll) {` Select all if needed.
32. `input.select();` Select text.
33. `} else {` Otherwise caret at end.
34. `const len = input.value.length;` Text length.
35. `input.setSelectionRange(len, len);` Place cursor.
36. `}` End select block.
37. `});` End RAF.
38. `}, [activeCellRef, selectAll]);` Dependencies.
39. Blank line.
40. `const startEdit = useCallback(` Begin edit.
41. `(initialValue?: string) => {` Handler.
42. `const current = getValue(active.r, active.c);` Current value.
43. `setDraft(initialValue ?? current);` Draft initial value.
44. `setSelectAll(initialValue == null);` Select all if no initial char.
45. `setIsEditing(true);` Enter edit mode.
46. `requestAnimationFrame(measureRect);` Measure cell.
47. `},` End handler.
48. `[active, getValue, measureRect],` Dependencies.
49. `);` Ends callback.
50. Blank line.
51. `const finish = useCallback(() => {` Cleanup edit.
52. `setIsEditing(false);` Exit edit.
53. `setEditorRect(null);` Clear rect.
54. `}, []);` End cleanup.
55. Blank line.
56. `const commitEdit = useCallback((value?: string) => {` Commit edit.
57. `onCommit(value ?? draft);` Call commit.
58. `finish();` Exit edit.
59. `}, [draft, finish, onCommit]);` Dependencies.
60. Blank line.
61. `const cancelEdit = useCallback(() => {` Cancel edit.
62. `onCancel?.();` Call cancel if provided.
63. `finish();` Exit edit.
64. `}, [finish, onCancel]);` Dependencies.
65. Blank line.
66. `const onEditorKeyDown = useCallback(` Key handler.
67. `(e: KeyboardEvent<HTMLInputElement>) => {` Event handler.
68. `if (e.key === "Enter") {` Enter: commit and move.
69. `e.preventDefault();` Prevent default.
70. `commitEdit();` Commit.
71. `onEnter?.(e.shiftKey ? -1 : 1);` Move up/down.
72. `} else if (e.key === "Escape") {` Escape: cancel.
73. `e.preventDefault();` Prevent default.
74. `cancelEdit();` Cancel.
75. `} else if (e.key === "Tab") {` Tab: commit and move.
76. `e.preventDefault();` Prevent default.
77. `commitEdit();` Commit.
78. `onTab?.(e.shiftKey ? -1 : 1);` Move left/right.
79. `}` End key cases.
80. `},` End handler.
81. `[cancelEdit, commitEdit, onEnter, onTab],` Dependencies.
82. `);` Ends callback.
83. Blank line.
84. `return {` Return API.
85. `isEditing,` Editing state.
86. `draft,` Draft value.
87. `setDraft,` Draft setter.
88. `editorRect,` Rect for overlay.
89. `editorRef,` Input ref.
90. `startEdit,` Start editing.
91. `commitEdit,` Commit.
92. `cancelEdit,` Cancel.
93. `onEditorKeyDown,` Key handler.
94. `};` End return.
95. `}` Ends hook.
### File: `packages/xontable/src/hooks/useFillHandle.ts`

1. `import { useCallback, useEffect, useState } from "react";` React hooks.
2. Blank line.
3. `type DragState = {` Fill drag state.
4. `startR: number;` Start row.
5. `startC: number;` Start col.
6. `endR: number;` End row.
7. `endC: number;` End col.
8. `};` End drag state.
9. Blank line.
10. `type FillHandleOptions = {` Options type.
11. `onApply: (startR: number, startC: number, endR: number, endC: number) => void;` Apply callback.
12. `};` Ends options.
13. Blank line.
14. `export function useFillHandle(options: FillHandleOptions) {` Hook start.
15. `const { onApply } = options;` Destructure.
16. `const [drag, setDrag] = useState<DragState | null>(null);` Drag state.
17. Blank line.
18. `const startDrag = useCallback((r: number, c: number) => {` Start drag.
19. `setDrag({ startR: r, startC: c, endR: r, endC: c });` Initialize drag.
20. `}, []);` End callback.
21. Blank line.
22. `useEffect(() => {` Watch drag.
23. `if (!drag) return;` Only if dragging.
24. Blank line.
25. `const onMove = (e: MouseEvent) => {` Mouse move handler.
26. `const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;` Find element under mouse.
27. `const cell = el?.closest("[data-row][data-col]") as HTMLElement | null;` Find cell element.
28. `if (!cell) return;` Ignore if not over cell.
29. `const r = Number(cell.dataset.row);` Row index.
30. `const c = Number(cell.dataset.col);` Col index.
31. `if (Number.isNaN(r) || Number.isNaN(c)) return;` Guard invalid.
32. `setDrag((prev) => (prev ? { ...prev, endR: r, endC: c } : prev));` Update end.
33. `};` End move handler.
34. Blank line.
35. `const onUp = () => {` Mouse up handler.
36. `onApply(drag.startR, drag.startC, drag.endR, drag.endC);` Apply fill.
37. `setDrag(null);` Clear drag.
38. `};` End up handler.
39. Blank line.
40. `window.addEventListener("mousemove", onMove);` Bind move.
41. `window.addEventListener("mouseup", onUp);` Bind up.
42. `return () => {` Cleanup.
43. `window.removeEventListener("mousemove", onMove);` Unbind move.
44. `window.removeEventListener("mouseup", onUp);` Unbind up.
45. `};` End cleanup.
46. `}, [drag, onApply]);` Dependencies.
47. Blank line.
48. `const isPreview = useCallback(` Fill preview predicate.
49. `(r: number, c: number) => {` Function.
50. `if (!drag) return false;` No drag.
51. `const dr = Math.abs(drag.endR - drag.startR);` Row delta.
52. `const dc = Math.abs(drag.endC - drag.startC);` Col delta.
53. `if (dc >= dr) {` Horizontal fill.
54. `if (r !== drag.startR) return false;` Only start row.
55. `const from = Math.min(drag.startC, drag.endC);` Min col.
56. `const to = Math.max(drag.startC, drag.endC);` Max col.
57. `return c >= from && c <= to;` Range check.
58. `}` End horizontal.
59. `if (c !== drag.startC) return false;` Vertical fill must be same col.
60. `const from = Math.min(drag.startR, drag.endR);` Min row.
61. `const to = Math.max(drag.startR, drag.endR);` Max row.
62. `return r >= from && r <= to;` Range check.
63. `},` End predicate.
64. `[drag],` Dependencies.
65. `);` Ends callback.
66. Blank line.
67. `return { drag, startDrag, isPreview };` Return API.
68. `}` Ends hook.

### File: `packages/xontable/src/hooks/useGridKeydown.ts`

1. `import { useCallback } from "react";` React hook.
2. `import type { KeyboardEvent } from "react";` Keyboard event type.
3. `import type { CellPos } from "../types";` Cell position type.
4. Blank line.
5. `type GridKeydownOptions = {` Options type.
6. `active: CellPos;` Active cell.
7. `rowCount: number;` Row count.
8. `colCount: number;` Column count.
9. `isEditing: boolean;` Editing flag.
10. `moveActive: (dr: number, dc: number) => void;` Move active by delta.
11. `moveTo: (r: number, c: number) => void;` Move to exact cell.
12. `startEdit: (initial?: string) => void;` Start edit.
13. `clearCell: () => void;` Clear cell(s).
14. `undo: () => void;` Undo action.
15. `redo: () => void;` Redo action.
16. `onShiftMove?: (dr: number, dc: number) => void;` Optional range selection move.
17. `};` End options.
18. Blank line.
19. `export function useGridKeydown(options: GridKeydownOptions) {` Hook start.
20. `const { active, rowCount, colCount, isEditing, moveActive, moveTo, startEdit, clearCell, undo, redo, onShiftMove, } = options;` Destructure.
21. Blank line.
22. `return useCallback(` Create handler.
23. `(e: KeyboardEvent<HTMLElement>) => {` Handler.
24. `if (isEditing) return;` Ignore during edit.
25. `const isCtrl = e.ctrlKey || e.metaKey;` Ctrl or Cmd.
26. `const lastRow = Math.max(0, rowCount - 1);` Last row index.
27. `const lastCol = Math.max(0, colCount - 1);` Last col index.
28. Blank line.
29. `if (isCtrl && (e.key === "z" || e.key === "Z")) {` Undo.
30. `e.preventDefault();` Prevent default.
31. `if (e.shiftKey) redo(); else undo();` Redo with Shift.
32. `return;` Exit.
33. `}` End undo.
34. `if (isCtrl && (e.key === "y" || e.key === "Y")) {` Redo.
35. `e.preventDefault();` Prevent default.
36. `redo();` Redo.
37. `return;` Exit.
38. `}` End redo.
39. Blank line.
40. `if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) { e.preventDefault(); }` Prevent scroll on arrows.
41. `switch (e.key) {` Handle keys.
42. `case "ArrowUp":` Up key.
43. `if (e.shiftKey && onShiftMove) onShiftMove(-1, 0);` Extend selection up.
44. `else if (isCtrl) moveTo(0, active.c);` Ctrl+Up.
45. `else moveActive(-1, 0);` Move up.
46. `break;` End case.
47. `case "ArrowDown":` Down key.
48. `if (e.shiftKey && onShiftMove) onShiftMove(1, 0);` Extend selection down.
49. `else if (isCtrl) moveTo(lastRow, active.c);` Ctrl+Down.
50. `else moveActive(1, 0);` Move down.
51. `break;` End case.
52. `case "ArrowLeft":` Left key.
53. `if (e.shiftKey && onShiftMove) onShiftMove(0, -1);` Extend selection left.
54. `else if (isCtrl) moveTo(active.r, 0);` Ctrl+Left.
55. `else moveActive(0, -1);` Move left.
56. `break;` End case.
57. `case "ArrowRight":` Right key.
58. `if (e.shiftKey && onShiftMove) onShiftMove(0, 1);` Extend selection right.
59. `else if (isCtrl) moveTo(active.r, lastCol);` Ctrl+Right.
60. `else moveActive(0, 1);` Move right.
61. `break;` End case.
62. `case "Tab":` Tab key.
63. `e.preventDefault();` Prevent focus change.
64. `moveActive(0, e.shiftKey ? -1 : 1);` Move horizontally.
65. `break;` End case.
66. `case "Enter":` Enter key.
67. `e.preventDefault();` Prevent default.
68. `startEdit();` Start edit.
69. `break;` End case.
70. `case "F2":` F2 key.
71. `e.preventDefault();` Prevent default.
72. `startEdit();` Start edit.
73. `break;` End case.
74. `case "Home":` Home key.
75. `e.preventDefault();` Prevent default.
76. `if (isCtrl) moveTo(0, 0); else moveTo(active.r, 0);` Move to row start or top-left.
77. `break;` End case.
78. `case "End":` End key.
79. `e.preventDefault();` Prevent default.
80. `if (isCtrl) moveTo(lastRow, lastCol); else moveTo(active.r, lastCol);` Move to row end or bottom-right.
81. `break;` End case.
82. `case "Backspace":` Backspace key.
83. `case "Delete":` Delete key.
84. `e.preventDefault();` Prevent default.
85. `clearCell();` Clear values.
86. `break;` End case.
87. `default:` Default case.
88. `if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); startEdit(e.key); }` Start edit with typed char.
89. `break;` End default.
90. `}` End switch.
91. `},` End handler.
92. `[ active, clearCell, colCount, isEditing, moveActive, moveTo, redo, rowCount, startEdit, undo, ],` Dependencies.
93. `);` Ends callback.
94. `}` Ends hook.

### File: `packages/xontable/src/hooks/useOutsideClick.ts`

1. `import { useEffect } from "react";` React hook.
2. Blank line.
3. `type OutsideClickOptions = {` Options type.
4. `isOpen: boolean;` Open flag.
5. `onClose: () => void;` Close callback.
6. `};` Ends options.
7. Blank line.
8. `export function useOutsideClick(options: OutsideClickOptions) {` Hook start.
9. `const { isOpen, onClose } = options;` Destructure.
10. Blank line.
11. `useEffect(() => {` Side effect.
12. `if (!isOpen) return;` Only when open.
13. `const onDoc = (e: MouseEvent) => {` Document click handler.
14. `const target = e.target as HTMLElement | null;` Target element.
15. `if (!target) return;` Guard.
16. `if (target.closest(".xontable-filter-menu") || target.closest(".xontable-filter-btn")) return;` Ignore clicks inside filter.
17. `onClose();` Close on outside click.
18. `};` End handler.
19. `const onKey = (e: KeyboardEvent) => {` Key handler.
20. `if (e.key === "Escape") onClose();` Close on Esc.
21. `};` End handler.
22. `document.addEventListener("mousedown", onDoc);` Bind click.
23. `document.addEventListener("keydown", onKey);` Bind key.
24. `return () => {` Cleanup.
25. `document.removeEventListener("mousedown", onDoc);` Remove click.
26. `document.removeEventListener("keydown", onKey);` Remove key.
27. `};` End cleanup.
28. `}, [isOpen, onClose]);` Dependencies.
29. `}` Ends hook.

### File: `packages/xontable/src/hooks/useRangeSelection.ts`

1. `import { useCallback, useEffect, useState } from "react";` React hooks.
2. `import type { CellPos } from "../types";` Cell position type.
3. Blank line.
4. `type Selection = { start: CellPos; end: CellPos };` Selection structure.
5. Blank line.
6. `type RangeSelectionApi = {` API type.
7. `selection: Selection | null;` Current selection.
8. `isSelecting: boolean;` Dragging flag.
9. `startSelection: (pos: CellPos) => void;` Start selection.
10. `updateSelection: (pos: CellPos) => void;` Update selection.
11. `stopSelection: () => void;` Stop selecting.
12. `clearSelection: () => void;` Clear selection.
13. `isSelected: (r: number, c: number) => boolean;` Check if cell is selected.
14. `getBounds: () => { r1: number; r2: number; c1: number; c2: number } | null;` Get bounds.
15. `};` Ends API type.
16. Blank line.
17. `export function useRangeSelection(): RangeSelectionApi {` Hook start.
18. `const [selection, setSelection] = useState<Selection | null>(null);` Selection state.
19. `const [isSelecting, setIsSelecting] = useState(false);` Dragging state.
20. Blank line.
21. `const startSelection = useCallback((pos: CellPos) => {` Start selection.
22. `setSelection({ start: pos, end: pos });` Init selection.
23. `setIsSelecting(true);` Mark selecting.
24. `}, []);` End callback.
25. Blank line.
26. `const updateSelection = useCallback((pos: CellPos) => {` Update selection.
27. `setSelection((prev) => (prev ? { ...prev, end: pos } : null));` Update end.
28. `}, []);` End callback.
29. Blank line.
30. `const stopSelection = useCallback(() => setIsSelecting(false), []);` Stop selecting.
31. `const clearSelection = useCallback(() => setSelection(null), []);` Clear selection.
32. Blank line.
33. `const getBounds = useCallback(() => {` Compute bounds.
34. `if (!selection) return null;` Guard.
35. `const r1 = Math.min(selection.start.r, selection.end.r);` Min row.
36. `const r2 = Math.max(selection.start.r, selection.end.r);` Max row.
37. `const c1 = Math.min(selection.start.c, selection.end.c);` Min col.
38. `const c2 = Math.max(selection.start.c, selection.end.c);` Max col.
39. `return { r1, r2, c1, c2 };` Return bounds.
40. `}, [selection]);` Dependencies.
41. Blank line.
42. `const isSelected = useCallback(` Selection predicate.
43. `(r: number, c: number) => {` Function.
44. `if (!selection) return false;` Guard.
45. `const b = getBounds();` Compute bounds.
46. `if (!b) return false;` Guard.
47. `return r >= b.r1 && r <= b.r2 && c >= b.c1 && c <= b.c2;` Check membership.
48. `},` End function.
49. `[getBounds, selection],` Dependencies.
50. `);` Ends callback.
51. Blank line.
52. `useEffect(() => {` Mouseup listener while selecting.
53. `if (!isSelecting) return;` Only when selecting.
54. `const onUp = () => setIsSelecting(false);` Stop on mouse up.
55. `window.addEventListener("mouseup", onUp);` Bind.
56. `return () => window.removeEventListener("mouseup", onUp);` Cleanup.
57. `}, [isSelecting]);` Dependencies.
58. Blank line.
59. `return {` Return API.
60. `selection,` Expose selection.
61. `isSelecting,` Expose flag.
62. `startSelection,` Expose start.
63. `updateSelection,` Expose update.
64. `stopSelection,` Expose stop.
65. `clearSelection,` Expose clear.
66. `isSelected,` Expose predicate.
67. `getBounds,` Expose bounds.
68. `};` End return.
69. `}` Ends hook.

### File: `packages/xontable/src/hooks/useSelection.ts`

This file is currently empty. It is reserved for future selection helpers.

### File: `packages/xontable/src/hooks/useSelectOptions.ts`

1. `import { useCallback, useRef, useState } from "react";` React hooks.
2. `import type { ColumnDef } from "../types";` Column type.
3. Blank line.
4. `type Option = { value: string; label: string };` Select option type.
5. Blank line.
6. `type SelectOptionsResult<Row> = {` API type.
7. `getOptions: (row: Row, col: ColumnDef<Row>) => Option[];` Get options.
8. `ensureOptions: (row: Row, col: ColumnDef<Row>) => void;` Load options if needed.
9. `isLoading: (row: Row, col: ColumnDef<Row>) => boolean;` Loading status.
10. `};` End API type.
11. Blank line.
12. `export function useSelectOptions<Row extends Record<string, any>>(columns: ColumnDef<Row>[],): SelectOptionsResult<Row> {` Hook start.
13. `const cacheRef = useRef<Record<string, Option[]>>({});` Options cache.
14. `const loadingRef = useRef<Record<string, boolean>>({});` Loading flags.
15. `const [, bump] = useState(0);` State to re-render on load.
16. Blank line.
17. `const keyFor = useCallback((row: Row, col: ColumnDef<Row>) => {` Cache key function.
18. `const dep = col.dependsOn ? String((row as any)[col.dependsOn] ?? "") : "";` Dependency value.
19. `const rid = String((row as any).id ?? (row as any)._id ?? "");` Row id.
20. `return `${rid}|${col.key}|${dep}`;` Unique key.
21. `}, []);` End callback.
22. Blank line.
23. `const getOptions = useCallback(` Get options.
24. `(row: Row, col: ColumnDef<Row>) => {` Function.
25. `if (col.options) return col.options;` Use static options.
26. `const key = keyFor(row, col);` Build key.
27. `return cacheRef.current[key] ?? [];` Return cached or empty.
28. `},` End function.
29. `[keyFor],` Dependencies.
30. `);` Ends callback.
31. Blank line.
32. `const isLoading = useCallback(` Loading check.
33. `(row: Row, col: ColumnDef<Row>) => {` Function.
34. `const key = keyFor(row, col);` Key.
35. `return Boolean(loadingRef.current[key]);` Loading flag.
36. `},` End function.
37. `[keyFor],` Dependencies.
38. `);` Ends callback.
39. Blank line.
40. `const ensureOptions = useCallback(` Ensure options.
41. `(row: Row, col: ColumnDef<Row>) => {` Function.
42. `if (col.options || !col.getOptions) return;` Only for async.
43. `const key = keyFor(row, col);` Key.
44. `if (cacheRef.current[key] || loadingRef.current[key]) return;` Avoid duplicate fetch.
45. `loadingRef.current[key] = true;` Mark loading.
46. `col.getOptions(row).then((opts) => {` Fetch async.
47. `cacheRef.current[key] = opts ?? [];` Store options.
48. `loadingRef.current[key] = false;` Clear loading.
49. `bump((v) => v + 1);` Trigger re-render.
50. `});` End promise.
51. `},` End function.
52. `[keyFor],` Dependencies.
53. `);` Ends callback.
54. Blank line.
55. `return { getOptions, ensureOptions, isLoading };` Return API.
56. `}` Ends hook.
### File: `packages/xontable/src/hooks/useTableModel.ts`

1. `import { useCallback, useEffect, useMemo, useRef, useState } from "react";` React hooks.
2. `import type { CellPos, XOnTableMeta, ColumnDef } from "../types";` Types.
3. `import { useValidation } from "./useValidation";` Validation hook.
4. Blank line.
5. `type CellUpdate = { r: number; c: number; value: any };` Cell update type.
6. Blank line.
7. `type TableModelOptions<Row extends Record<string, any>> = {` Options type.
8. `columns: ColumnDef<Row>[];` Columns list.
9. `rows: Row[];` Data rows.
10. `rowFilter?: (row: Row, r: number) => boolean;` Optional filter.
11. `onChange?: (rows: Row[], meta: XOnTableMeta) => void;` Change callback.
12. `};` End options.
13. Blank line.
14. `const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));` Clamp utility.
15. Blank line.
16. `export function useTableModel<Row extends Record<string, any>>(options: TableModelOptions<Row>) {` Hook start.
17. `const { columns, rows, rowFilter, onChange } = options;` Destructure.
18. `const colCount = columns.length;` Column count.
19. `const [data, setData] = useState<Row[]>(rows);` Local data state.
20. `const dataRef = useRef(rows);` Mutable data reference.
21. `const historyRef = useRef<{ past: Row[][]; future: Row[][] }>({ past: [], future: [] });` Undo/redo history.
22. `const lastCellRef = useRef<CellPos>({ r: 0, c: 0 });` Last edited cell.
23. `useEffect(() => { setData(rows); dataRef.current = rows; historyRef.current = { past: [], future: [] }; }, [rows]);` Reset on external rows change.
24. Blank line.
25. `const [active, setActive] = useState<CellPos>({ r: 0, c: 0 });` Active cell state.
26. Blank line.
27. `const view = useMemo(() => {` Build filtered view.
28. `const map: number[] = []; const list: Row[] = [];` Map and list.
29. `dataRef.current.forEach((row, i) => { if (!rowFilter || rowFilter(row, i)) { map.push(i); list.push(row); } });` Build list with filter.
30. `return { map, list };` Return view.
31. `}, [rowFilter, data]);` Dependencies.
32. `const rowCount = view.list.length;` Visible row count.
33. Blank line.
34. `const getRow = useCallback((r: number) => {` Get visible row by view index.
35. `const real = view.map[r]; return real == null ? undefined : dataRef.current[real];` Map to real index.
36. `}, [view.map]);` Dependencies.
37. `const getValue = useCallback((r: number, c: number) => {` Get cell value.
38. `const col = columns[c]; const real = view.map[r]; const row = real == null ? undefined : dataRef.current[real];` Resolve row.
39. `const v = row && col ? row[col.key] : ""; return v == null ? "" : String(v);` Normalize to string.
40. `}, [columns, view.map]);` Dependencies.
41. Blank line.
42. `const { validateCell, setCellError, hasError, getError } = useValidation<Row>(columns, getRow, getValue);` Validation API.
43. Blank line.
44. `const setCellErrorView = useCallback((r: number, c: number, msg: string | null) => {` Set error using visible indexes.
45. `const real = view.map[r]; if (real == null) return; setCellError(real, c, msg);` Map to real index.
46. `}, [setCellError, view.map]);` Dependencies.
47. Blank line.
48. `const commitRows = useCallback((next: Row[], meta: XOnTableMeta, recordHistory: boolean, prev: Row[]) => {` Commit helper.
49. `if (recordHistory) { const h = historyRef.current; h.past.push(prev); h.future = []; if (h.past.length > 50) h.past.shift(); }` Manage history.
50. `dataRef.current = next; setData(next); onChange?.(next, meta);` Commit and notify.
51. `}, [onChange]);` Dependencies.
52. Blank line.
53. `const updateCells = useCallback((updates: CellUpdate[], meta: XOnTableMeta) => {` Update cells.
54. `if (updates.length === 0) return;` Ignore empty.
55. `const prev = dataRef.current; const next = prev.map((r) => ({ ...r })); let changed = false;` Clone rows.
56. `for (const u of updates) {` Apply each update.
57. `const col = columns[u.c]; const real = view.map[u.r]; const row = real == null ? undefined : next[real];` Resolve row.
58. `if (!col || !row || col.editable === false) continue;` Skip invalid or readonly.
59. `row[col.key] = u.value as any;` Set value.
60. `const err = validateCell(u.r, u.c, u.value, row); if (real != null) setCellError(real, u.c, err);` Validate and store error.
61. `changed = true;` Mark changed.
62. `lastCellRef.current = { r: u.r, c: u.c };` Track last edited cell.
63. `}` End loop.
64. `if (changed) commitRows(next, meta, true, prev);` Commit changes.
65. `}, [columns, commitRows, setCellError, validateCell, view.map]);` Dependencies.
66. Blank line.
67. `const moveActive = useCallback((dr: number, dc: number) => {` Move active by delta.
68. `setActive((prev) => {` Update active.
69. `if (rowCount === 0 || colCount === 0) return prev;` Guard empty.
70. `return { r: clamp(prev.r + dr, 0, rowCount - 1), c: clamp(prev.c + dc, 0, colCount - 1) };` Clamp move.
71. `});` End update.
72. `}, [colCount, rowCount]);` Dependencies.
73. Blank line.
74. `const undo = useCallback(() => {` Undo action.
75. `const h = historyRef.current; if (h.past.length === 0) return;` Guard.
76. `const prev = h.past.pop() as Row[]; h.future.push(dataRef.current); dataRef.current = prev; setData(prev);` Swap state.
77. `onChange?.(prev, { type: "undo", cell: lastCellRef.current });` Notify with meta.
78. `}, [onChange]);` Dependencies.
79. Blank line.
80. `const redo = useCallback(() => {` Redo action.
81. `const h = historyRef.current; if (h.future.length === 0) return;` Guard.
82. `const next = h.future.pop() as Row[]; h.past.push(dataRef.current); dataRef.current = next; setData(next);` Swap state.
83. `onChange?.(next, { type: "redo", cell: lastCellRef.current });` Notify with meta.
84. `}, [onChange]);` Dependencies.
85. Blank line.
86. `const hasErrorView = useCallback((r: number, c: number) => {` Check error by view index.
87. `const real = view.map[r]; return real == null ? false : hasError(real, c);` Map to real index.
88. `}, [hasError, view.map]);` Dependencies.
89. Blank line.
90. `const getErrorView = useCallback((r: number, c: number) => {` Get error by view index.
91. `const real = view.map[r]; return real == null ? null : getError(real, c);` Map to real index.
92. `}, [getError, view.map]);` Dependencies.
93. Blank line.
94. `return {` Return API.
95. `data: view.list,` Visible data.
96. `rawData: dataRef.current,` Raw data.
97. `active,` Active cell.
98. `setActive,` Setter.
99. `getValue,` Value getter.
100. `updateCells,` Update function.
101. `moveActive,` Move function.
102. `rowCount,` Visible row count.
103. `colCount,` Column count.
104. `hasError: hasErrorView,` Error checker.
105. `getError: getErrorView,` Error getter.
106. `setCellErrorView,` Error setter.
107. `undo,` Undo.
108. `redo,` Redo.
109. `};` End return.
110. `}` Ends hook.

### File: `packages/xontable/src/hooks/useValidation.ts`

1. `import { useCallback, useMemo, useState } from "react";` React hooks.
2. `import { cellKey } from "../utils/cellKey";` Key helper.
3. `import type { ColumnDef } from "../types";` Column type.
4. Blank line.
5. `export function useValidation<Row extends Record<string, any>>(columns: ColumnDef<Row>[], getRow: (r: number) => Row | undefined, getValue: (r: number, c: number) => string,) {` Hook signature.
6. `const [errors, setErrors] = useState<Record<string, string>>({});` Error map.
7. Blank line.
8. `const validateCell = useCallback(` Start validation.
9. `(r: number, c: number, nextValue?: string, rowOverride?: Row,) => {` Validator.
10. `const col = columns[c];` Column by index.
11. `if (!col) return null;` Guard.
12. Blank line.
13. `const raw = nextValue ?? getValue(r, c);` Get value.
14. `const value = raw == null ? "" : String(raw);` Normalize to string.
15. `const rowObj = rowOverride ?? getRow(r);` Row object.
16. Blank line.
17. `if (col.type === "number" && value.trim() !== "" && Number.isNaN(Number(value))) {` Default number validation.
18. `return "Must be a number";` Error message.
19. `}` End number validation.
20. Blank line.
21. `if (col.type === "checkbox") {` Checkbox validation.
22. `const v = typeof nextValue === "boolean" ? String(nextValue) : value.trim().toLowerCase();` Normalize to true/false.
23. `if (v !== "true" && v !== "false") return "Must be true or false";` Error for invalid values.
24. `}` End checkbox validation.
25. Blank line.
26. `if (col.validator) return col.validator(value, rowObj as Row);` Custom validator.
27. `return null;` No error.
28. `},` End validator.
29. `[columns, getRow, getValue],` Dependencies.
30. `);` Ends callback.
31. Blank line.
32. `const setCellError = useCallback(` Set error.
33. `(r: number, c: number, msg: string | null) => {` Function.
34. `const k = cellKey(r, c);` Key.
35. `setErrors((prev) => {` Update state.
36. `const next = { ...prev };` Clone.
37. `if (!msg) delete next[k];` Remove if no error.
38. `else next[k] = msg;` Set error.
39. `return next;` Return.
40. `});` End update.
41. `},` End function.
42. `[],` No deps.
43. `);` Ends callback.
44. Blank line.
45. `const hasError = useCallback(` Error checker.
46. `(r: number, c: number) => {` Function.
47. `return Boolean(errors[cellKey(r, c)]);` Check map.
48. `},` End function.
49. `[errors],` Dependencies.
50. `);` Ends callback.
51. Blank line.
52. `const getError = useCallback(` Error getter.
53. `(r: number, c: number) => errors[cellKey(r, c)] ?? null,` Fetch error.
54. `[errors],` Dependencies.
55. `);` Ends callback.
56. Blank line.
57. `const api = useMemo(` Build API.
58. `() => ({ errors, validateCell, setCellError, hasError, getError }),` Return object.
59. `[errors, validateCell, setCellError, hasError, getError],` Dependencies.
60. `);` Ends memo.
61. Blank line.
62. `return api;` Return API.
63. `}` Ends hook.
### File: `packages/xontable/src/components/ColumnFilterMenu.tsx`

1. `import React from "react";` React import.
2. Blank line.
3. `type ColumnFilterMenuProps = {` Props type.
4. `isOpen: boolean;` Open state.
5. `search: string;` Search input value.
6. `options: string[];` Option list.
7. `allChecked: boolean;` All checked state.
8. `isChecked: (value: string) => boolean;` Per-option checked state.
9. `onSearchChange: (value: string) => void;` Search change handler.
10. `onToggle: (value: string) => void;` Toggle option.
11. `onToggleAll: () => void;` Toggle all.
12. `};` Ends props.
13. Blank line.
14. `export function ColumnFilterMenu(props: ColumnFilterMenuProps) {` Component start.
15. `const { isOpen, search, options, allChecked, isChecked, onSearchChange, onToggle, onToggleAll, } = props;` Destructure props.
16. Blank line.
17. `if (!isOpen) return null;` Only render when open.
18. Blank line.
19. `return (` Start JSX.
20. `<div className="xontable-filter-menu">` Wrapper.
21. `<input` Search input.
22. `className="xontable-filter-search"` Search input class.
23. `value={search}` Controlled value.
24. `onChange={(e) => onSearchChange(e.target.value)}` Update search.
25. `onKeyDown={(e) => e.stopPropagation()}` Prevent grid key handling.
26. `onMouseDown={(e) => e.stopPropagation()}` Prevent focus stealing.
27. `placeholder="Search"` Placeholder text.
28. `/>` End input.
29. `<div className="xontable-filter-actions">` Actions row.
30. `<label className="xontable-filter-toggle">` Toggle label.
31. `<input` Checkbox input.
32. `type="checkbox"` Checkbox type.
33. `checked={allChecked}` Controlled state.
34. `onChange={onToggleAll}` Toggle all handler.
35. `/>` End input.
36. `<span>All</span>` Label text.
37. `</label>` End label.
38. `</div>` End actions row.
39. `<div className="xontable-filter-list">` Options list.
40. `{options.map((opt) => (` Map options.
41. `<label key={opt} className="xontable-filter-item">` Option row.
42. `<input` Checkbox.
43. `type="checkbox"` Checkbox type.
44. `checked={isChecked(opt)}` Controlled state.
45. `onChange={() => onToggle(opt)}` Toggle handler.
46. `/>` End input.
47. `<span title={opt}>{opt || "(blank)"}</span>` Option label.
48. `</label>` End option label.
49. `))}` End map.
50. `</div>` End list.
51. `</div>` End menu.
52. `);` End JSX.
53. `}` Ends component.

### File: `packages/xontable/src/components/SelectMenu.tsx`

1. `import React from "react";` React import.
2. Blank line.
3. `type Option = { value: string; label: string };` Option type.
4. Blank line.
5. `type SelectMenuProps = {` Props type.
6. `isOpen: boolean;` Open state.
7. `rect: DOMRect | null;` Target rect.
8. `options: Option[];` Options list.
9. `loading: boolean;` Loading flag.
10. `filter: string;` Filter text.
11. `onSelect: (value: string) => void;` Select callback.
12. `};` Ends props type.
13. Blank line.
14. `export function SelectMenu(props: SelectMenuProps) {` Component start.
15. `const { isOpen, rect, options, loading, filter, onSelect } = props;` Destructure.
16. `if (!isOpen || !rect) return null;` Only render when open.
17. `const q = filter.toLowerCase();` Lower-case filter.
18. `const list = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;` Filter options.
19. `const current = filter.trim();` Current input text.
20. `const vw = window.innerWidth;` Viewport width.
21. `const vh = window.innerHeight;` Viewport height.
22. `const width = Math.min(rect.width, vw - 16);` Menu width.
23. `const left = Math.min(Math.max(8, rect.left), vw - width - 8);` Clamp left.
24. `const maxH = Math.min(220, vh - rect.bottom - 12);` Max height below.
25. `const placeAbove = maxH < 120;` Decide to place above.
26. `const top = placeAbove ? Math.max(8, rect.top - 6) : rect.bottom + 2;` Top position.
27. Blank line.
28. `const renderLabel = (label: string) => {` Highlighting helper.
29. `if (!q) return label;` No highlight if no query.
30. `const idx = label.toLowerCase().indexOf(q);` Match index.
31. `if (idx < 0) return label;` No match.
32. `const before = label.slice(0, idx);` Prefix.
33. `const match = label.slice(idx, idx + q.length);` Match text.
34. `const after = label.slice(idx + q.length);` Suffix.
35. `return (` Start JSX.
36. `<>` Fragment.
37. `{before}` Prefix.
38. `<strong>{match}</strong>` Bold match.
39. `{after}` Suffix.
40. `</>` End fragment.
41. `);` End return.
42. `};` End helper.
43. Blank line.
44. `return (` Start JSX.
45. `<div` Menu wrapper.
46. `className="xontable-select-menu"` Menu class.
47. `style={{` Inline positioning.
48. `position: "fixed",` Fixed to viewport.
49. `left,` Left value.
50. `top,` Top value.
51. `width,` Width.
52. `maxHeight: placeAbove ? Math.min(220, rect.top - 12) : maxH,` Height with clamp.
53. `transform: placeAbove ? "translateY(-100%)" : "none",` Flip above.
54. `}}` End style.
55. `>` End div open.
56. `{loading && <div className="xontable-select-item">Loading...</div>}` Loading row.
57. `{!loading && list.length === 0 && (` No results row.
58. `<div className="xontable-select-item">No results</div>` No results.
59. `)}` End no results.
60. `{!loading && list.map((opt) => (` Map options.
61. `<button` Option button.
62. `key={opt.value}` Key.
63. `type="button"` Button type.
64. `className={[ "xontable-select-item", current && (opt.value === current || opt.label === current) ? "is-active" : "", ].join(" ")}` Active state.
65. `onMouseDown={(e) => e.preventDefault()}` Prevent blur.
66. `onClick={() => onSelect(opt.value)}` Select option.
67. `title={opt.label}` Tooltip.
68. `>` End button open.
69. `{renderLabel(opt.label)}` Render label.
70. `</button>` End button.
71. `))}` End map.
72. `</div>` End menu.
73. `);` End JSX.
74. `}` Ends component.

### File: `packages/xontable/src/components/XOnTableHeader.tsx`

1. `import React from "react";` React import.
2. `import { Filter, Minus, Plus } from "lucide-react";` Icons.
3. `import type { ColumnDef } from "../types";` Column type.
4. `import { ColumnFilterMenu } from "./ColumnFilterMenu";` Filter menu.
5. Blank line.
6. `type GroupHeader = { key: string; label: string; width: number; collapsible: boolean; collapsed: boolean };` Group header type.
7. Blank line.
8. `type HeaderProps<Row extends Record<string, any>> = {` Props type.
9. `columns: Array<{ col: ColumnDef<Row>; idx: number | null }>;` Visible columns.
10. `groups?: GroupHeader[];` Group headers.
11. `rowNumberWidth: number;` Row number width.
12. `activeCol: number;` Active column index.
13. `getColWidth: (c: number) => number;` Column width getter.
14. `onResizeStart: (c: number, ev: React.MouseEvent) => void;` Resize start handler.
15. `onResizeDoubleClick: (c: number, ev: React.MouseEvent) => void;` Auto fit handler.
16. `onGroupToggle: (key: string) => void;` Group toggle.
17. `filterOpenKey: string | null;` Filter open key.
18. `filterSearch: string;` Filter search.
19. `getFilterOptions: (key: string) => string[];` Options list.
20. `isFilterChecked: (key: string, value: string) => boolean;` Value checked.
21. `isFilterAllChecked: (key: string) => boolean;` All checked.
22. `onFilterOpen: (key: string) => void;` Open filter.
23. `onFilterSearch: (value: string) => void;` Search change.
24. `onFilterToggle: (key: string, value: string) => void;` Toggle value.
25. `onFilterToggleAll: (key: string) => void;` Toggle all.
26. `};` Ends props.
27. Blank line.
28. `export function XOnTableHeader<Row extends Record<string, any>>(props: HeaderProps<Row>) {` Component start.
29. `const { columns, groups, rowNumberWidth, activeCol, getColWidth, onResizeStart, onResizeDoubleClick, onGroupToggle, filterOpenKey, filterSearch, getFilterOptions, isFilterChecked, isFilterAllChecked, onFilterOpen, onFilterSearch, onFilterToggle, onFilterToggleAll } = props;` Destructure.
30. Blank line.
31. `return (` Start JSX.
32. `<>` Fragment.
33. `{groups && groups.length > 0 && (` Group header row.
34. `<div className="xontable-row xontable-group-row">` Group row.
35. `<div className="xontable-cell xontable-rownum-cell xontable-group-cell" style={{ width: rowNumberWidth }} />` Row number group cell.
36. `{groups.map((g) => (` Map groups.
37. `<div key={g.key} className="xontable-cell xontable-group-cell" style={{ width: g.width }}>` Group cell.
38. `<span className="xontable-group-label">{g.label}</span>` Group label.
39. `{g.collapsible && (` Collapsible toggle.
40. `<button type="button" className="xontable-group-toggle" onClick={() => onGroupToggle(g.key)} title={g.collapsed ? "Expand" : "Collapse"}>` Toggle button.
41. `{g.collapsed ? <Plus size={12} /> : <Minus size={12} />}` Icon.
42. `</button>` End button.
43. `)}` End conditional.
44. `</div>` End group cell.
45. `))}` End map.
46. `</div>` End group row.
47. `)}` End group header block.
48. Blank line.
49. `<div className="xontable-row xontable-head">` Column header row.
50. `<div className="xontable-cell xontable-rownum-cell xontable-head-cell" style={{ width: rowNumberWidth }} />` Row number header cell.
51. `{columns.map(({ col, idx }, c) => (` Map columns.
52. `<div key={col.key + String(idx ?? c)} className={["xontable-cell", "xontable-head-cell", c === activeCol ? "is-active-col-head" : ""].join(" ")} style={{ width: getColWidth(c) }}>` Header cell.
53. `<span className="xontable-head-label">{col.label}</span>` Label.
54. `{idx != null && (` Skip placeholder columns.
55. `<>` Fragment.
56. `<button type="button" className="xontable-filter-btn" onClick={() => onFilterOpen(col.key)} title="Filter">` Filter button.
57. `<Filter size={14} />` Filter icon.
58. `</button>` End button.
59. `<div className="xontable-col-resizer" onMouseDown={(ev) => onResizeStart(c, ev)} onDoubleClick={(ev) => onResizeDoubleClick(c, ev)} title="Drag to resize" />` Resizer.
60. `<ColumnFilterMenu` Filter menu component.
61. `isOpen={filterOpenKey === col.key}` Open state.
62. `search={filterSearch}` Search value.
63. `options={getFilterOptions(col.key)}` Options.
64. `allChecked={isFilterAllChecked(col.key)}` All checked state.
65. `isChecked={(v) => isFilterChecked(col.key, v)}` Checked predicate.
66. `onSearchChange={onFilterSearch}` Search handler.
67. `onToggle={(v) => onFilterToggle(col.key, v)}` Toggle value.
68. `onToggleAll={() => onFilterToggleAll(col.key)}` Toggle all.
69. `/>` End filter menu.
70. `</>` End fragment.
71. `)}` End conditional.
72. `</div>` End header cell.
73. `))}` End map.
74. `</div>` End header row.
75. `</>` End fragment.
76. `);` End JSX.
77. `}` Ends component.

### File: `packages/xontable/src/components/XOnTableGrid.tsx`

1. `import React from "react";` React import.
2. `import type { CellPos, ColumnDef } from "../types";` Types.
3. `import { XOnTableHeader } from "./XOnTableHeader";` Header component.
4. Blank line.
5. `type GroupHeader = { key: string; label: string; width: number; collapsible: boolean; collapsed: boolean };` Group header type.
6. Blank line.
7. `type GridProps<Row extends Record<string, any>> = {` Props type.
8. `columns: Array<{ col: ColumnDef<Row>; idx: number | null }>;` Visible columns.
9. `groups?: GroupHeader[];` Group headers.
10. `rowNumberWidth: number;` Row number width.
11. `data: Row[];` Visible rows.
12. `rowIdKey: keyof Row;` Row id key.
13. `active: CellPos;` Active cell.
14. `activeCol: number;` Active column.
15. `isEditing: boolean;` Editing state.
16. `readOnly: boolean;` Read-only flag.
17. `selectionBounds: { r1: number; r2: number; c1: number; c2: number } | null;` Selected range.
18. `copiedBounds: { r1: number; r2: number; c1: number; c2: number } | null;` Copied range.
19. `getColWidth: (c: number) => number;` Width getter.
20. `getValue: (r: number, c: number) => string;` Value getter.
21. `hasError: (r: number, c: number) => boolean;` Error checker.
22. `getError: (r: number, c: number) => string | null;` Error getter.
23. `isPreview: (r: number, c: number) => boolean;` Fill preview predicate.
24. `activeCellRef: React.RefObject<HTMLDivElement | null>;` Active cell ref.
25. `onCellMouseDown: (r: number, c: number, ev: React.MouseEvent) => void;` Mouse down handler.
26. `onCellMouseEnter: (r: number, c: number, ev: React.MouseEvent) => void;` Mouse enter handler.
27. `onCellDoubleClick: (r: number, c: number) => void;` Double click handler.
28. `onCheckboxToggle: (r: number, c: number) => void;` Checkbox toggle.
29. `onSelectOpen: (r: number, c: number) => void;` Select open handler.
30. `onFillStart: (r: number, c: number, ev: React.MouseEvent) => void;` Fill drag start.
31. `onResizeStart: (c: number, ev: React.MouseEvent) => void;` Resize start.
32. `onResizeDoubleClick: (c: number, ev: React.MouseEvent) => void;` Auto fit.
33. `onGroupToggle: (key: string) => void;` Group toggle.
34. `filterOpenKey: string | null;` Filter open key.
35. `filterSearch: string;` Filter search.
36. `getFilterOptions: (key: string) => string[];` Options list.
37. `isFilterChecked: (key: string, value: string) => boolean;` Checked state.
38. `isFilterAllChecked: (key: string) => boolean;` All checked state.
39. `onFilterOpen: (key: string) => void;` Open filter.
40. `onFilterSearch: (value: string) => void;` Search change.
41. `onFilterToggle: (key: string, value: string) => void;` Toggle value.
42. `onFilterToggleAll: (key: string) => void;` Toggle all.
43. `};` End props.
44. Blank line.
45. `export function XOnTableGrid<Row extends Record<string, any>>(props: GridProps<Row>) {` Component start.
46. `const { columns, data, rowIdKey, active, isEditing, readOnly, selectionBounds, copiedBounds, getColWidth, getValue, hasError, getError, isPreview, activeCellRef, onCellMouseDown, onCellMouseEnter, onCellDoubleClick, onCheckboxToggle, onSelectOpen, onFillStart } = props;` Destructure.
47. Blank line.
48. `return (` Start JSX.
49. `<div className="xontable">` Grid container.
50. `<XOnTableHeader {...props} />` Render header with same props.
51. `{data.map((row, r) => (` Render rows.
52. `<div className="xontable-row" data-row={r} key={String(row[rowIdKey] ?? r)}>` Row container.
53. `<div className={["xontable-cell", "xontable-rownum-cell", r === active.r ? "is-active-rownum" : ""].join(" ")} style={{ width: props.rowNumberWidth }}>` Row number cell.
54. `{r + 1}` Row index display.
55. `</div>` End row number.
56. `{columns.map(({ col, idx }, c) => {` Render cells.
57. `const isActive = active.r === r && active.c === c;` Active cell.
58. `const invalid = hasError(r, c);` Error state.
59. `const preview = isPreview(r, c);` Fill preview state.
60. `const inSel = !!selectionBounds && r >= selectionBounds.r1 && r <= selectionBounds.r2 && c >= selectionBounds.c1 && c <= selectionBounds.c2;` In selection.
61. `const inCopy = !!copiedBounds && r >= copiedBounds.r1 && r <= copiedBounds.r2 && c >= copiedBounds.c1 && c <= copiedBounds.c2;` In copied range.
62. `const selTop = inSel && selectionBounds && r === selectionBounds.r1;` Top edge.
63. `const selBottom = inSel && selectionBounds && r === selectionBounds.r2;` Bottom edge.
64. `const selLeft = inSel && selectionBounds && c === selectionBounds.c1;` Left edge.
65. `const selRight = inSel && selectionBounds && c === selectionBounds.c2;` Right edge.
66. `const copyTop = inCopy && copiedBounds && r === copiedBounds.r1;` Copy top edge.
67. `const copyBottom = inCopy && copiedBounds && r === copiedBounds.r2;` Copy bottom edge.
68. `const copyLeft = inCopy && copiedBounds && c === copiedBounds.c1;` Copy left edge.
69. `const copyRight = inCopy && copiedBounds && c === copiedBounds.c2;` Copy right edge.
70. `const isCheckbox = col.type === "checkbox";` Checkbox cell.
71. `const isSelect = col.type === "select";` Select cell.
72. `const checked = row[col.key] === true || row[col.key] === "true";` Checkbox checked state.
73. `return (` Start cell.
74. `<div` Cell container.
75. `key={col.key + String(idx ?? c)}` React key.
76. `ref={isActive ? activeCellRef : null}` Active cell ref.
77. `data-row={r}` Row index attr.
78. `data-col={c}` Col index attr.
79. `className={[ "xontable-cell", isActive ? "is-active" : "", inSel ? "is-range" : "", selTop ? "is-range-top" : "", selRight ? "is-range-right" : "", selBottom ? "is-range-bottom" : "", selLeft ? "is-range-left" : "", inCopy ? "is-copied-range" : "", copyTop ? "is-copied-top" : "", copyRight ? "is-copied-right" : "", copyBottom ? "is-copied-bottom" : "", copyLeft ? "is-copied-left" : "", isCheckbox ? "is-checkbox" : "", isSelect ? "is-select" : "", invalid ? "is-invalid" : "", preview ? "is-fill-preview" : "", ].join(" ")}` Compose classes.
80. `style={{ width: getColWidth(c) }}` Column width.
81. `title={invalid ? (getError(r, c) ?? "") : ""}` Tooltip for error.
82. `onMouseDown={(ev) => onCellMouseDown(r, c, ev)}` Mouse down.
83. `onMouseEnter={(ev) => onCellMouseEnter(r, c, ev)}` Mouse enter.
84. `onDoubleClick={() => onCellDoubleClick(r, c)}` Double click.
85. `>` End open.
86. `{isCheckbox ? (` Checkbox render.
87. `<input` Checkbox.
88. `type="checkbox"` Checkbox type.
89. `className="xontable-checkbox"` Checkbox class.
90. `checked={checked}` Controlled state.
91. `onChange={() => onCheckboxToggle(r, c)}` Toggle handler.
92. `onClick={(ev) => ev.stopPropagation()}` Prevent cell click.
93. `onMouseDown={(ev) => ev.stopPropagation()}` Prevent selection start.
94. `/>` End input.
95. `) : (` Else render value.
96. `getValue(r, c)` Cell text.
97. `)}` End conditional.
98. `{isSelect && !readOnly && !isEditing && (` Dropdown trigger.
99. `<button` Trigger.
100. `type="button"` Button type.
101. `className="xontable-select-trigger"` Button class.
102. `title="Open"` Tooltip.
103. `onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); onSelectOpen(r, c); }}` Open select.
104. `/>` End button.
105. `)}` End conditional.
106. `{isActive && !isEditing && !readOnly && (` Fill handle.
107. `<div className="xontable-fill-handle" onMouseDown={(ev) => onFillStart(r, c, ev)} title="Drag to fill" />` Fill handle.
108. `)}` End fill handle.
109. `</div>` End cell.
110. `);` End return.
111. `})}` End cell map.
112. `</div>` End row.
113. `))}` End rows.
114. `</div>` End grid.
115. `);` End JSX.
116. `}` Ends component.
### File: `packages/xontable/src/XOnTable.tsx`

1. `import React from "react";` React import.
2. `import "./styles/xontable.css";` Global styles import.
3. `import type { XOnTableProps } from "./types";` Props type.
4. `import { SelectMenu } from "./components/SelectMenu";` Select menu component.
5. `import { XOnTableGrid } from "./components/XOnTableGrid";` Grid component.
6. `import { useClipboardCatcher } from "./hooks/useClipboardCatcher";` Clipboard hook.
7. `import { useColumnFilters } from "./hooks/useColumnFilters";` Filters hook.
8. `import { useColumnGroups } from "./hooks/useColumnGroups";` Groups hook.
9. `import { useColumnResize } from "./hooks/useColumnResize";` Resize hook.
10. `import { useEditorOverlay } from "./hooks/useEditorOverlay";` Editor hook.
11. `import { useFillHandle } from "./hooks/useFillHandle";` Fill handle hook.
12. `import { useGridKeydown } from "./hooks/useGridKeydown";` Keydown hook.
13. `import { useOutsideClick } from "./hooks/useOutsideClick";` Outside click hook.
14. `import { useRangeSelection } from "./hooks/useRangeSelection";` Selection hook.
15. `import { useSelectOptions } from "./hooks/useSelectOptions";` Select options hook.
16. `import { useTableModel } from "./hooks/useTableModel";` Data model hook.
17. Blank line.
18. `type CellUpdate = { r: number; c: number; value: any };` Update type.
19. `const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));` Clamp helper.
20. Blank line.
21. `export function XOnTable<Row extends Record<string, any>>(props: XOnTableProps<Row>) {` Component start.
22. `const { columns, rows, rowIdKey = "id" as keyof Row, onChange, readOnly = false, theme = "light" } = props;` Props with defaults.
23. `const activeCellRef = React.useRef<HTMLDivElement | null>(null);` Active cell ref.
24. `const filters = useColumnFilters(columns, rows);` Filters hook.
25. `const { visibleColumns, groupHeaders, getColWidth, setColWidth, toggleGroup, resetWidths, getOrigIndex } = useColumnGroups<Row>({ columns });` Grouping hook.
26. `const { getOptions, ensureOptions, isLoading } = useSelectOptions(columns);` Select options hook.
27. `const selection = useRangeSelection();` Selection hook.
28. `const [copiedBounds, setCopiedBounds] = React.useState<{ r1: number; r2: number; c1: number; c2: number } | null>(null);` Copied range state.
29. `React.useEffect(() => { resetWidths(); }, [columns, resetWidths]);` Reset widths when columns change.
30. Blank line.
31. `const { data, active, setActive, getValue, updateCells, moveActive, rowCount, colCount, hasError, getError, setCellErrorView, undo, redo } = useTableModel<Row>({ columns: visibleColumns.map((v) => v.col), rows, rowFilter: filters.rowFilter, onChange });` Data model hook.
32. `React.useEffect(() => { if (active.c >= colCount) setActive({ r: active.r, c: Math.max(0, colCount - 1) }); }, [active, colCount, setActive]);` Clamp active column on column count change.
33. `const activeCol = visibleColumns[active.c]?.col; const activeRow = data[active.r];` Active column/row.
34. Blank line.
35. `const validateSelect = React.useCallback((r: number, c: number, value: string, row: Row | undefined) => {` Validate select.
36. `const col = visibleColumns[c]?.col; if (!col || col.type !== "select" || !row) return null;` Guard.
37. `const opts = getOptions(row, col); const match = opts.find((o) => o.value === value || o.label === value) ?? null;` Find match.
38. `if (!match && value.trim() !== "") { setCellErrorView(r, c, "Invalid option"); return null; }` Mark invalid if no match.
39. `setCellErrorView(r, c, null); return match;` Clear error and return match.
40. `}, [getOptions, setCellErrorView, visibleColumns]);` Dependencies.
41. `const normalizeSelectValue = React.useCallback((r: number, c: number, value: string, row: Row | undefined) => { const match = validateSelect(r, c, value, row); return match ? match.value : value; }, [validateSelect]);` Normalize select to option value.
42. `const ensureSelect = React.useCallback((r: number, c: number, row: Row | undefined) => { const col = visibleColumns[c]?.col; if (!col || col.type !== "select" || !row) return; ensureOptions(row, col); }, [ensureOptions, visibleColumns]);` Ensure options are loaded.
43. Blank line.
44. `const { startResize } = useColumnResize({ colCount, getWidth: getColWidth, setWidth: setColWidth, minWidth: 60 });` Resize hook.
45. `const measureRef = React.useRef<HTMLDivElement | null>(null); React.useEffect(() => () => { if (measureRef.current) measureRef.current.remove(); }, []);` Measurement element cleanup.
46. `const measureText = React.useCallback((text: string) => { let el = measureRef.current; if (!el) { el = document.createElement("div"); el.className = "xontable-cell xontable-measure"; document.body.appendChild(el); measureRef.current = el; } el.textContent = text || ""; return Math.ceil(el.getBoundingClientRect().width); }, []);` Measure text width.
47. `const autoFitCol = React.useCallback((visibleIndex: number) => { const orig = getOrigIndex(visibleIndex); if (orig == null) return; let max = measureText(columns[orig]?.label ?? ""); for (let r = 0; r < data.length; r++) { const w = measureText(getValue(r, visibleIndex)); if (w > max) max = w; } setColWidth(visibleIndex, Math.min(600, Math.max(60, max + 15))); }, [columns, data.length, getOrigIndex, getValue, measureText, setColWidth]);` Auto-fit column width.
48. Blank line.
49. `const { isEditing, draft, setDraft, editorRect, editorRef, startEdit, commitEdit, onEditorKeyDown } = useEditorOverlay({` Editor overlay hook.
50. `active, activeCellRef, getValue,` Pass active and value getter.
51. `onCommit: (value) => {` Commit handler.
52. `const row = data[active.r]; const col = visibleColumns[active.c]?.col;` Resolve row/col.
53. `const v = col?.type === "select" ? normalizeSelectValue(active.r, active.c, value, row) : value;` Normalize select.
54. `updateCells([{ r: active.r, c: active.c, value: v }], { type: "edit", cell: active });` Apply update.
55. `},` End commit.
56. `onEnter: (dir) => moveActive(dir, 0), onTab: (dir) => moveActive(0, dir),` Navigation after commit.
57. `});` End hook.
58. Blank line.
59. `const startEditCell = React.useCallback((initial?: string) => { if (readOnly) return; ensureSelect(active.r, active.c, activeRow); startEdit(initial); }, [active.c, active.r, activeRow, ensureSelect, readOnly, startEdit]);` Start editing active cell.
60. `const toggleCheckbox = React.useCallback((r: number, c: number) => { if (readOnly) return; const col = visibleColumns[c]?.col; const row = data[r]; if (!col || col.type !== "checkbox" || !row) return; const checked = row[col.key] === true || row[col.key] === "true"; updateCells([{ r, c, value: !checked }], { type: "edit", cell: { r, c } }); }, [data, readOnly, updateCells, visibleColumns]);` Toggle checkbox value.
61. `const clearRange = React.useCallback(() => { const b = selection.getBounds(); if (!b) { updateCells([{ r: active.r, c: active.c, value: "" }], { type: "edit", cell: active }); return; } const updates: CellUpdate[] = []; for (let r = b.r1; r <= b.r2; r++) for (let c = b.c1; c <= b.c2; c++) updates.push({ r, c, value: "" }); updateCells(updates, { type: "edit", cell: active }); }, [active, selection, updateCells]);` Clear selected range.
62. Blank line.
63. `const { clipRef, focusClipboard, onCopy, onPaste } = useClipboardCatcher({` Clipboard hook.
64. `isEditing,` Disable during edit.
65. `getCopyBlock: () => { const b = selection.getBounds(); if (!b) return [[getValue(active.r, active.c)]]; const block: string[][] = []; for (let r = b.r1; r <= b.r2; r++) { const row: string[] = []; for (let c = b.c1; c <= b.c2; c++) row.push(getValue(r, c)); block.push(row); } return block; },` Build copy block.
66. `onCopy: () => setCopiedBounds(selection.getBounds() ?? { r1: active.r, r2: active.r, c1: active.c, c2: active.c }),` Store copied bounds.
67. `onPasteBlock: (block) => { if (readOnly) return; const updates: CellUpdate[] = []; for (let rOff = 0; rOff < block.length; rOff++) for (let cOff = 0; cOff < block[rOff].length; cOff++) { const r = active.r + rOff; const c = active.c + cOff; if (r < rowCount && c < colCount) updates.push({ r, c, value: block[rOff][cOff] }); } updateCells(updates, { type: "paste", cell: active }); updates.forEach((u) => validateSelect(u.r, u.c, u.value, data[u.r])); },` Paste handler with validation.
68. `});` End clipboard hook.
69. `React.useEffect(() => { if (!isEditing) focusClipboard(); }, [focusClipboard, isEditing]);` Focus clipboard when not editing.
70. `const openSelectAt = React.useCallback((r: number, c: number) => { if (readOnly) return; setActive({ r, c }); selection.startSelection({ r, c }); focusClipboard(); const row = data[r]; ensureSelect(r, c, row); requestAnimationFrame(() => startEdit()); }, [data, ensureSelect, focusClipboard, readOnly, selection, setActive, startEdit]);` Open select via icon.
71. Blank line.
72. `const { startDrag, isPreview } = useFillHandle({` Fill handle hook.
73. `onApply: (startR, startC, endR, endC) => {` Fill apply.
74. `if (readOnly) return; const value = getValue(startR, startC); const updates: CellUpdate[] = [];` Read value.
75. `const dr = Math.abs(endR - startR); const dc = Math.abs(endC - startC);` Direction.
76. `if (dc >= dr) { const from = Math.min(startC, endC); const to = Math.max(startC, endC); for (let c = from; c <= to; c++) updates.push({ r: startR, c, value }); }` Horizontal fill.
77. `else { const from = Math.min(startR, endR); const to = Math.max(startR, endR); for (let r = from; r <= to; r++) updates.push({ r, c: startC, value }); }` Vertical fill.
78. `updateCells(updates, { type: "fill", cell: { r: startR, c: startC } }); updates.forEach((u) => validateSelect(u.r, u.c, u.value, data[u.r])); focusClipboard();` Commit and validate.
79. `},` End apply.
80. `});` End hook.
81. Blank line.
82. `const onShiftMove = React.useCallback((dr: number, dc: number) => { const next = { r: clamp(active.r + dr, 0, rowCount - 1), c: clamp(active.c + dc, 0, colCount - 1) }; if (!selection.selection) selection.startSelection(active); selection.updateSelection(next); setActive(next); }, [active, colCount, rowCount, selection, setActive]);` Shift+arrow range selection.
83. Blank line.
84. `const onGridKeyDown = useGridKeydown({` Keydown hook.
85. `active, rowCount, colCount, isEditing, moveActive, moveTo: (r, c) => setActive({ r, c }),` Basic navigation.
86. `startEdit: readOnly ? () => {} : startEditCell,` Start edit handler.
87. `clearCell: () => { if (!readOnly) clearRange(); },` Clear handler.
88. `undo: () => { if (!readOnly) undo(); }, redo: () => { if (!readOnly) redo(); },` Undo/redo.
89. `onShiftMove,` Range selection.
90. `});` End hook.
91. `const onGridKeyDownWithCopy = React.useCallback((e: React.KeyboardEvent<HTMLElement>) => { const target = e.target as HTMLElement | null; if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return; const isCopy = (e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C"); if (isCopy) setCopiedBounds(selection.getBounds() ?? { r1: active.r, r2: active.r, c1: active.c, c2: active.c }); else setCopiedBounds(null); onGridKeyDown(e); }, [active.c, active.r, onGridKeyDown, selection]);` Keydown wrapper with copy tracking.
92. Blank line.
93. `useOutsideClick({ isOpen: filters.filterOpenKey != null, onClose: filters.closeFilter });` Close filter on outside click.
94. Blank line.
95. `return (` Start JSX.
96. `<div className={
\`xontable-wrap theme-${theme}\`}>` Root wrapper.
97. `<textarea ref={clipRef} className="xontable-clip" aria-hidden="true" tabIndex={-1} onCopy={onCopy} onPaste={onPaste} onKeyDown={onGridKeyDownWithCopy} readOnly />` Hidden clipboard textarea.
98. `<div` Surface wrapper.
99. `className="xontable-surface"` Surface class.
100. `tabIndex={0}` Focusable.
101. `onFocus={(e) => { const target = e.target as HTMLElement | null; if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return; focusClipboard(); }}` Focus handler that avoids stealing input focus.
102. `onKeyDown={onGridKeyDownWithCopy}` Keydown handler.
103. `>` End surface open.
104. `<XOnTableGrid` Grid component.
105. `columns={visibleColumns} groups={groupHeaders.some((g) => g.label) ? groupHeaders : undefined} rowNumberWidth={44}` Column data and group headers.
106. `data={data} rowIdKey={rowIdKey} active={active} activeCol={active.c} isEditing={isEditing} readOnly={readOnly}` Grid state.
107. `selectionBounds={selection.getBounds()} copiedBounds={copiedBounds}` Selection and copy ranges.
108. `getColWidth={getColWidth} getValue={getValue} hasError={hasError} getError={getError} isPreview={isPreview} activeCellRef={activeCellRef}` Accessors and refs.
109. `onCellMouseDown={(r, c, ev) => { ev.preventDefault(); setActive({ r, c }); selection.startSelection({ r, c }); setCopiedBounds(null); focusClipboard(); if (filters.filterOpenKey) filters.closeFilter(); }}` Cell select handler.
110. `onCellMouseEnter={(r, c) => { if (selection.isSelecting) selection.updateSelection({ r, c }); }}` Drag selection.
111. `onCellDoubleClick={(r, c) => { setActive({ r, c }); startEditCell(); }}` Start edit on double click.
112. `onCheckboxToggle={toggleCheckbox}` Checkbox handler.
113. `onSelectOpen={openSelectAt}` Open select handler.
114. `onFillStart={(r, c, ev) => { ev.preventDefault(); ev.stopPropagation(); startDrag(r, c); }}` Fill handle start.
115. `onResizeStart={(c, ev) => { ev.preventDefault(); ev.stopPropagation(); startResize(c, ev.clientX); }}` Resize start.
116. `onResizeDoubleClick={(c, ev) => { ev.preventDefault(); ev.stopPropagation(); autoFitCol(c); }}` Auto fit.
117. `onGroupToggle={toggleGroup} filterOpenKey={filters.filterOpenKey} filterSearch={filters.filterSearch}` Group and filter props.
118. `getFilterOptions={filters.getFilterOptions} isFilterChecked={filters.isFilterChecked} isFilterAllChecked={filters.isAllChecked}` Filter accessors.
119. `onFilterOpen={filters.openFilter} onFilterSearch={filters.setFilterSearch}` Filter handlers.
120. `onFilterToggle={filters.toggleFilterValue} onFilterToggleAll={filters.toggleAll}` Filter toggles.
121. `/>` End grid.
122. `</div>` End surface.
123. `{isEditing && editorRect && (` Render overlay editor.
124. `<input ref={editorRef} className="xontable-editor" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onEditorKeyDown} onBlur={() => { commitEdit(); validateSelect(active.r, active.c, draft, activeRow); }} style={{ position: "fixed", left: editorRect.left, top: editorRect.top, width: editorRect.width, height: editorRect.height }} />` Overlay input.
125. `)}` End editor.
126. `<SelectMenu isOpen={Boolean(isEditing && activeCol?.type === "select")} rect={editorRect} options={activeRow && activeCol ? getOptions(activeRow, activeCol) : []} loading={Boolean(activeRow && activeCol && isLoading(activeRow, activeCol))} filter={draft} onSelect={(v) => { setDraft(v); commitEdit(v); validateSelect(active.r, active.c, v, activeRow); }} />` Select dropdown.
127. `</div>` End root.
128. `);` End JSX.
129. `}` Ends component.

### File: `packages/xontable/src/styles/xontable.css`

1. `@import "./xontable.base.css";` Import base styles.
2. `@import "./xontable.filter.css";` Import filter styles.
3. `@import "./xontable.theme.css";` Import theme styles.

### File: `packages/xontable/src/styles/xontable.base.css`

1. `.xontable-wrap { display: block; width: 100%; height: 100%; border: 1px solid #e3e5ea; border-radius: 8px; overflow: hidden; background: #fff; --xontable-range: #1a73e8; --xontable-copy: #1a1a1a; }` Root container styles and CSS variables.
2. `.xontable-surface { outline: none; width: 100%; height: 100%; overflow: auto; }` Scrollable surface.
3. `.xontable { border: 0; display: block; width: 100%; height: 100%; font-family: "Segoe UI", Tahoma, sans-serif; font-size: 13px; user-select: none; background: transparent; }` Grid base.
4. `.xontable-row { display: flex; }` Row layout.
5. `.xontable-cell { position: relative; height: 24px; border-right: 1px solid #e6e8ee; border-bottom: 1px solid #e6e8ee; display: flex; align-items: center; padding: 2px 6px 2px 8px; background: #fff; box-sizing: border-box; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }` Cell layout.
6. `.xontable-cell.is-select { padding-right: 22px; }` Extra padding for select arrow.
7. `.xontable-select-trigger { position: absolute; right: 4px; top: 50%; width: 16px; height: 16px; border: 0; background: transparent; display: flex; align-items: center; justify-content: center; padding: 0; cursor: pointer; transform: translateY(-50%); }` Select button.
8. `.xontable-select-trigger::after { content: ""; width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid #6b7280; transform: translateY(1px); opacity: 0.85; }` Triangle icon.
9. `.xontable-cell.is-checkbox { justify-content: center; padding: 0; }` Center checkbox.
10. `.xontable-checkbox { width: 14px; height: 14px; accent-color: #1a73e8; }` Checkbox styling.
11. `.xontable-measure { position: fixed; left: -9999px; top: -9999px; height: auto; font-family: "Segoe UI", Tahoma, sans-serif; font-size: 13px; overflow: visible; text-overflow: clip; white-space: nowrap; pointer-events: none; visibility: hidden; }` Hidden measure element.
12. `.xontable-head-cell { font-weight: 600; background: #f6f7f9; position: relative; gap: 6px; overflow: visible; }` Header cell.
13. `.xontable-head-label { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; }` Header label.
14. `.xontable-rownum-cell { justify-content: center; color: #6b7280; background: #f7f7f9; font-weight: 600; }` Row number cell.
15. `.xontable-group-row { background: #f6f6f6; }` Group row background.
16. `.xontable-group-cell { justify-content: space-between; gap: 6px; font-weight: 600; color: #333; background: #f6f6f6; }` Group cell.
17. `.xontable-group-label { overflow: hidden; text-overflow: ellipsis; }` Group label.
18. `.xontable-group-toggle { width: 20px; height: 20px; min-width: 20px; min-height: 20px; border: 0; background: transparent; display: flex; align-items: center; justify-content: center; padding: 0; box-sizing: border-box; cursor: pointer; }` Group toggle.
19. `.xontable-group-toggle svg, .xontable-filter-btn svg { display: block; }` Icon display fix.
20. `.xontable-col-resizer { position: absolute; top: 0; right: -3px; width: 6px; height: 100%; cursor: col-resize; }` Resize handle.
21. `.xontable-col-resizer::after { content: ""; position: absolute; left: 2px; top: 0; width: 2px; height: 100%; background: rgba(0, 0, 0, 0.08); }` Resize line.
22. `.xontable-cell.is-active { outline: 2px solid #0b65d4; outline-offset: -2px; }` Active cell outline.
23. `.xontable-cell.is-range { background: #eef9ee; --rs-top: 0px; --rs-right: 0px; --rs-bottom: 0px; --rs-left: 0px; box-shadow: inset 0 var(--rs-top) 0 0 var(--xontable-range), inset calc(var(--rs-right) * -1) 0 0 0 var(--xontable-range), inset 0 calc(var(--rs-bottom) * -1) 0 0 var(--xontable-range), inset var(--rs-left) 0 0 0 var(--xontable-range); }` Range selection fill and outline.
24. `.xontable-cell.is-range-top { --rs-top: 1px; }` Top range border.
25. `.xontable-cell.is-range-right { --rs-right: 1px; }` Right range border.
26. `.xontable-cell.is-range-bottom { --rs-bottom: 1px; }` Bottom range border.
27. `.xontable-cell.is-range-left { --rs-left: 1px; }` Left range border.
28. `.xontable-cell.is-copied-range { --ct: 0px; --cr: 0px; --cb: 0px; --cl: 0px; background-image: repeating-linear-gradient(90deg, var(--xontable-copy) 0 4px, transparent 4px 6px), repeating-linear-gradient(180deg, var(--xontable-copy) 0 4px, transparent 4px 6px), repeating-linear-gradient(90deg, var(--xontable-copy) 0 4px, transparent 4px 6px), repeating-linear-gradient(180deg, var(--xontable-copy) 0 4px, transparent 4px 6px); background-size: var(--ct) 2px, 2px var(--cr), var(--cb) 2px, 2px var(--cl); background-position: left top, right top, left bottom, left top; background-repeat: repeat-x, repeat-y, repeat-x, repeat-y; animation: xontable-march 0.8s linear infinite; opacity: 1; }` Marching ants for copied range.
29. `.xontable-cell.is-copied-top { --ct: 100%; }` Copy top edge.
30. `.xontable-cell.is-copied-right { --cr: 100%; }` Copy right edge.
31. `.xontable-cell.is-copied-bottom { --cb: 100%; }` Copy bottom edge.
32. `.xontable-cell.is-copied-left { --cl: 100%; }` Copy left edge.
33. `.xontable-cell.is-copied-top { border-top-color: transparent; }` Hide underlying border top.
34. `.xontable-cell.is-copied-right { border-right-color: transparent; }` Hide underlying border right.
35. `.xontable-cell.is-copied-bottom { border-bottom-color: transparent; }` Hide underlying border bottom.
36. `.xontable-cell.is-copied-left { border-left-color: transparent; }` Hide underlying border left.
37. Blank line for readability.
38. `@keyframes xontable-march {` Marching ants animation.
39. `0% { background-position: 0 0, 100% 0, 0 100%, 0 0; }` Start positions.
40. `100% { background-position: 6px 0, 100% 6px, 6px 100%, 0 6px; }` End positions.
41. `}` End keyframes.
42. `.xontable-head-cell.is-active-col-head,` Start active column/row color.
43. `.xontable-rownum-cell.is-active-rownum { background: #cfe3ff; }` Active header highlight.
44. `.xontable-cell.is-invalid { background: #ffe5e5; border: 1px solid #d92d2d; box-shadow: inset 0 0 0 1px #d92d2d; }` Error style.
45. `.xontable-cell.is-invalid:hover { background: #ffd6d6; }` Error hover.
46. `.xontable-cell.is-fill-preview { background: #e8f0fe; }` Fill preview.
47. `.xontable-fill-handle { position: absolute; width: 14px; height: 14px; right: -7px; bottom: -7px; background: #0b65d4; border: 1px solid #fff; border-radius: 4px; cursor: crosshair; }` Fill handle dot.
48. `.xontable-editor { box-sizing: border-box; border: 2px solid #1a73e8; padding: 2px 6px 2px 8px; font: inherit; background: #fff; outline: none; line-height: 1.2; }` Editor input styling.
49. `.xontable-clip { position: fixed; left: -9999px; top: -9999px; width: 1px; height: 1px; opacity: 0; }` Hidden clipboard textarea.
50. `.xontable-select-menu { background: #fff; border: 1px solid #e1e4ea; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); border-radius: 4px; padding: 4px 0; z-index: 30; max-height: 220px; overflow: auto; }` Select menu styling.
51. `.xontable-select-item { width: 100%; text-align: left; padding: 6px 10px; border: 0; background: transparent; cursor: pointer; font-size: 12px; }` Select item styling.
52. `.xontable-select-item:hover, .xontable-select-item.is-active { background: #e9f1ff; }` Hover and active states.

### File: `packages/xontable/src/styles/xontable.filter.css`

1. `.xontable-filter-btn {` Filter button.
2. `width: 18px;` Width.
3. `height: 18px;` Height.
4. `border: 0;` No border.
5. `background: transparent;` Transparent background.
6. `cursor: pointer;` Pointer cursor.
7. `display: inline-flex;` Flex container.
8. `align-items: center;` Vertical center.
9. `justify-content: center;` Horizontal center.
10. `padding: 0;` No padding.
11. `}` End filter button.
12. Blank line.
13. `.xontable-filter-menu {` Filter menu wrapper.
14. `position: absolute;` Positioned relative to header.
15. `top: 100%;` Below header.
16. `right: 0;` Align right.
17. `margin-top: 4px;` Offset.
18. `width: 190px;` Fixed width.
19. `background: #fff;` White background.
20. `border: 1px solid #e6e6e6;` Border.
21. `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);` Shadow.
22. `z-index: 20;` Layer above grid.
23. `padding: 8px;` Internal padding.
24. `border-radius: 8px;` Rounded corners.
25. `}` End menu.
26. Blank line.
27. `.xontable-filter-search {` Search input.
28. `width: 100%;` Full width.
29. `padding: 6px 8px;` Padding.
30. `border: 1px solid #e0e0e0;` Border.
31. `border-radius: 6px;` Rounded corners.
32. `font-size: 12px;` Font size.
33. `box-sizing: border-box;` Box model.
34. `margin-bottom: 6px;` Spacing below.
35. `}` End search input.
36. Blank line.
37. `.xontable-filter-actions {` Actions row.
38. `display: flex;` Flex layout.
39. `gap: 6px;` Gap.
40. `margin-bottom: 6px;` Spacing.
41. `}` End actions.
42. Blank line.
43. `.xontable-filter-toggle {` Toggle label.
44. `display: flex;` Flex layout.
45. `align-items: center;` Center align.
46. `gap: 6px;` Gap.
47. `font-size: 12px;` Font size.
48. `cursor: pointer;` Pointer.
49. `user-select: none;` No selection.
50. `}` End toggle.
51. Blank line.
52. `.xontable-filter-list {` Options list.
53. `max-height: 160px;` Max height.
54. `overflow: auto;` Scroll.
55. `display: flex;` Flex layout.
56. `flex-direction: column;` Column layout.
57. `gap: 4px;` Gap.
58. `}` End list.
59. Blank line.
60. `.xontable-filter-item {` Option row.
61. `display: flex;` Flex layout.
62. `align-items: center;` Center align.
63. `gap: 6px;` Gap.
64. `font-size: 12px;` Font size.
65. `}` End item.

### File: `packages/xontable/src/styles/xontable.theme.css`

1. `.xontable-wrap.theme-dark { border-color: #3a3a3a; background: #1e1f22; --xontable-range: #8ab4f8; --xontable-copy: #e6e6e6; }` Dark theme base and variables.
2. `.xontable-wrap.theme-dark .xontable { color: #e6e6e6; background: transparent; }` Dark theme text.
3. Blank line.
4. `.xontable-wrap.theme-dark .xontable-cell {` Cell colors.
5. `border-color: #3a3a3a;` Border color.
6. `background: #1e1f22;` Background.
7. `}` End cell.
8. `.xontable-wrap.theme-dark .xontable-select-trigger::after { border-top-color: #b6bcc5; }` Dark theme arrow.
9. `.xontable-wrap.theme-dark .xontable-checkbox { accent-color: #8ab4f8; }` Dark theme checkbox.
10. Blank line.
11. `.xontable-wrap.theme-dark .xontable-cell.is-range { background: #1f3526; }` Dark selection.
12. `.xontable-wrap.theme-dark .xontable-cell.is-invalid { background: #4a1f1f; border-color: #e05b5b; box-shadow: inset 0 0 0 1px #e05b5b; }` Dark invalid.
13. `.xontable-wrap.theme-dark .xontable-cell.is-copied { outline: 1px dotted #7ad27a; outline-offset: -1px; }` Dark copied outline (legacy).
14. Blank line.
15. `.xontable-wrap.theme-dark .xontable-row.is-zebra .xontable-cell {` Zebra row background.
16. `background: #232428;` Zebra color.
17. `}` End zebra.
18. Blank line.
19. `.xontable-wrap.theme-dark .xontable-head-cell,` Dark header.
20. `.xontable-wrap.theme-dark .xontable-rownum-cell,` Dark row number.
21. `.xontable-wrap.theme-dark .xontable-group-cell {` Dark group.
22. `background: #2b2d31;` Dark header background.
23. `color: #e6e6e6;` Header text.
24. `}` End header styles.
25. Blank line.
26. `.xontable-wrap.theme-dark .xontable-head-cell.is-active-col-head,` Active header in dark.
27. `.xontable-wrap.theme-dark .xontable-rownum-cell.is-active-rownum {` Active row number.
28. `background: #344769;` Highlight color.
29. `}` End active highlight.

## End of Book

This completes the line-by-line explanation of the xontable package.
