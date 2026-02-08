import { useCallback, useEffect, useState } from "react";

type DragState = { col: number; startX: number; startW: number };

type ResizeOptions = {
  colCount: number;
  getWidth: (c: number) => number;
  setWidth: (c: number, w: number) => void;
  minWidth?: number;
};

export function useColumnResize(options: ResizeOptions) {
  const { colCount, getWidth, setWidth, minWidth = 60 } = options;
  const [drag, setDrag] = useState<DragState | null>(null);

  const startResize = useCallback(
    (col: number, startX: number) => {
      if (col < 0 || col >= colCount) return;
      setDrag({ col, startX, startW: getWidth(col) });
    },
    [colCount, getWidth],
  );

  useEffect(() => {
    if (!drag) return;

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - drag.startX;
      const next = Math.max(minWidth, drag.startW + dx);
      setWidth(drag.col, next);
    };

    const onUp = () => setDrag(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag, minWidth, setWidth]);

  return { startResize, isResizing: Boolean(drag) };
}
