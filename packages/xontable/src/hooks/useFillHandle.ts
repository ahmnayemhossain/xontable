import { useCallback, useEffect, useState } from "react";

type DragState = {
  startR: number;
  startC: number;
  endR: number;
  endC: number;
};

type FillHandleOptions = {
  onApply: (startR: number, startC: number, endR: number, endC: number) => void;
  getSourceBounds?: () => { r1: number; r2: number; c1: number; c2: number } | null;
};

export function useFillHandle(options: FillHandleOptions) {
  const { onApply, getSourceBounds } = options;
  const [drag, setDrag] = useState<DragState | null>(null);

  const startDrag = useCallback((r: number, c: number) => {
    setDrag({ startR: r, startC: c, endR: r, endC: c });
  }, []);

  useEffect(() => {
    if (!drag) return;

    const onMove = (e: MouseEvent) => {
      const el = document.elementFromPoint(
        e.clientX,
        e.clientY,
      ) as HTMLElement | null;
      const cell = el?.closest("[data-row][data-col]") as HTMLElement | null;
      if (!cell) return;
      const r = Number(cell.dataset.row);
      const c = Number(cell.dataset.col);
      if (Number.isNaN(r) || Number.isNaN(c)) return;
      setDrag((prev) => (prev ? { ...prev, endR: r, endC: c } : prev));
    };

    const onUp = () => {
      onApply(drag.startR, drag.startC, drag.endR, drag.endC);
      setDrag(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag, onApply]);

  const isPreview = useCallback(
    (r: number, c: number) => {
      if (!drag) return false;
      const b = getSourceBounds ? getSourceBounds() : null;
      const dr = Math.abs(drag.endR - drag.startR);
      const dc = Math.abs(drag.endC - drag.startC);
      if (b) {
        if (dc >= dr) { const from = Math.min(b.c1, drag.endC); const to = Math.max(b.c2, drag.endC); return r >= b.r1 && r <= b.r2 && c >= from && c <= to; }
        const from = Math.min(b.r1, drag.endR); const to = Math.max(b.r2, drag.endR); return c >= b.c1 && c <= b.c2 && r >= from && r <= to;
      }
      if (dc >= dr) { if (r !== drag.startR) return false; const from = Math.min(drag.startC, drag.endC); const to = Math.max(drag.startC, drag.endC); return c >= from && c <= to; }
      if (c !== drag.startC) return false; const from = Math.min(drag.startR, drag.endR); const to = Math.max(drag.startR, drag.endR); return r >= from && r <= to;
    },
    [drag, getSourceBounds],
  );

  return { drag, startDrag, isPreview };
}
