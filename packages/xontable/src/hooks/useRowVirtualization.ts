import { useCallback, useEffect, useMemo, useState } from "react";
import type { RefObject } from "react";

type Options = {
  rowCount: number;
  rowHeight: number;
  overscan?: number;
  containerRef: RefObject<HTMLElement | null>;
};

type Result = {
  start: number;
  end: number;
  paddingTop: number;
  paddingBottom: number;
};

export function useRowVirtualization(options: Options): Result {
  const { rowCount, rowHeight, overscan = 6, containerRef } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const [viewport, setViewport] = useState(0);

  const measure = useCallback(() => {
    const el = containerRef.current;
    setViewport(el ? el.clientHeight : 0);
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setScrollTop(el.scrollTop);
    onScroll();
    measure();
    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, measure]);

  return useMemo(() => {
    if (rowCount <= 0 || viewport <= 0) return { start: 0, end: -1, paddingTop: 0, paddingBottom: 0 };
    const visible = Math.ceil(viewport / rowHeight) + overscan * 2;
    const rawStart = Math.floor(scrollTop / rowHeight) - overscan;
    const start = Math.max(0, rawStart);
    const end = Math.min(rowCount - 1, start + visible - 1);
    return {
      start,
      end,
      paddingTop: start * rowHeight,
      paddingBottom: Math.max(0, (rowCount - end - 1) * rowHeight),
    };
  }, [overscan, rowCount, rowHeight, scrollTop, viewport]);
}
