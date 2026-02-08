import { useCallback, useEffect, useState } from "react";
import type { CellPos } from "../types";

type Selection = { start: CellPos; end: CellPos };

type RangeSelectionApi = {
  selection: Selection | null;
  isSelecting: boolean;
  startSelection: (pos: CellPos) => void;
  updateSelection: (pos: CellPos) => void;
  stopSelection: () => void;
  clearSelection: () => void;
  isSelected: (r: number, c: number) => boolean;
  getBounds: () => { r1: number; r2: number; c1: number; c2: number } | null;
};

export function useRangeSelection(): RangeSelectionApi {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const startSelection = useCallback((pos: CellPos) => {
    setSelection({ start: pos, end: pos });
    setIsSelecting(true);
  }, []);

  const updateSelection = useCallback((pos: CellPos) => {
    setSelection((prev) => (prev ? { ...prev, end: pos } : null));
  }, []);

  const stopSelection = useCallback(() => setIsSelecting(false), []);
  const clearSelection = useCallback(() => setSelection(null), []);

  const getBounds = useCallback(() => {
    if (!selection) return null;
    const r1 = Math.min(selection.start.r, selection.end.r);
    const r2 = Math.max(selection.start.r, selection.end.r);
    const c1 = Math.min(selection.start.c, selection.end.c);
    const c2 = Math.max(selection.start.c, selection.end.c);
    return { r1, r2, c1, c2 };
  }, [selection]);

  const isSelected = useCallback(
    (r: number, c: number) => {
      if (!selection) return false;
      const b = getBounds();
      if (!b) return false;
      return r >= b.r1 && r <= b.r2 && c >= b.c1 && c <= b.c2;
    },
    [getBounds, selection],
  );

  useEffect(() => {
    if (!isSelecting) return;
    const onUp = () => setIsSelecting(false);
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, [isSelecting]);

  return {
    selection,
    isSelecting,
    startSelection,
    updateSelection,
    stopSelection,
    clearSelection,
    isSelected,
    getBounds,
  };
}
