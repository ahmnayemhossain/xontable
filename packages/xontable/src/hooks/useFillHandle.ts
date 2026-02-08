import { useCallback, useEffect, useState } from "react";

type DragState = {
  startR: number;
  startC: number;
  endR: number;
  endC: number;
};

type FillHandleOptions = {
  onApply: (startR: number, startC: number, endR: number, endC: number) => void;
};

export function useFillHandle(options: FillHandleOptions) {
  const { onApply } = options;
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
      const dr = Math.abs(drag.endR - drag.startR);
      const dc = Math.abs(drag.endC - drag.startC);
      if (dc >= dr) {
        if (r !== drag.startR) return false;
        const from = Math.min(drag.startC, drag.endC);
        const to = Math.max(drag.startC, drag.endC);
        return c >= from && c <= to;
      }
      if (c !== drag.startC) return false;
      const from = Math.min(drag.startR, drag.endR);
      const to = Math.max(drag.startR, drag.endR);
      return r >= from && r <= to;
    },
    [drag],
  );

  return { drag, startDrag, isPreview };
}
