import { useCallback, useEffect, useRef } from "react";
import type { ClipboardEvent } from "react";
import { parseTSV, toTSV } from "../utils";

type ClipboardCatcherOptions = {
  isEditing: boolean;
  getCopyBlock: () => string[][];
  onPasteBlock: (block: string[][]) => void;
  onCopy?: () => void;
  isPasteArmed?: () => boolean;
};

export function useClipboardCatcher(options: ClipboardCatcherOptions) {
  const { isEditing, getCopyBlock, onPasteBlock, onCopy: onCopyCb, isPasteArmed } = options;
  const clipRef = useRef<HTMLTextAreaElement | null>(null);
  const lastPasteAt = useRef(0);
  const parseHtmlTable = useCallback((html: string) => {
    if (typeof DOMParser === "undefined") return [] as string[][];
    const doc = new DOMParser().parseFromString(html, "text/html");
    const rows = Array.from(doc.querySelectorAll("tr"));
    if (rows.length === 0) return [];
    return rows.map((row) => Array.from(row.querySelectorAll("th,td")).map((cell) => cell.textContent ?? ""));
  }, []);

  const focusClipboard = useCallback(() => {
    clipRef.current?.focus();
    clipRef.current?.select();
  }, []);

  const onCopy = useCallback(
    (e: ClipboardEvent) => {
      if (isEditing) return;
      e.preventDefault();
      const block = getCopyBlock();
      e.clipboardData.setData("text/plain", toTSV(block));
      onCopyCb?.();
    },
    [getCopyBlock, isEditing, onCopyCb],
  );

  const handlePaste = useCallback((text: string, html: string) => {
    const textBlock = text ? parseTSV(text) : [];
    const htmlBlock = html ? parseHtmlTable(html) : [];
    const hasTextGrid = textBlock.length > 1 || (textBlock[0]?.length ?? 0) > 1;
    const block = hasTextGrid ? textBlock : (htmlBlock.length ? htmlBlock : textBlock);
    if (block.length === 0) return;
    onPasteBlock(block);
  }, [onPasteBlock, parseHtmlTable]);

  const onPaste = useCallback(
    (e: ClipboardEvent) => {
      if (isEditing) return;
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      const isClip = Boolean(target && target.classList.contains("xontable-clip"));
      if (isInput && !isClip) return;
      e.preventDefault();
      lastPasteAt.current = Date.now();
      handlePaste(e.clipboardData.getData("text/plain"), e.clipboardData.getData("text/html"));
    },
    [handlePaste, isEditing],
  );

  const onInput = useCallback(() => {
    if (isEditing) return;
    const el = clipRef.current;
    if (!el) return;
    const text = el.value;
    if (!text) return;
    el.value = "";
    handlePaste(text, "");
  }, [handlePaste, isEditing]);

  useEffect(() => {
    const handler = (e: Event) => {
      if (isEditing) return;
      if (Date.now() - lastPasteAt.current < 80) return;
      if (isPasteArmed && !isPasteArmed()) return;
      const ce = e as unknown as ClipboardEvent;
      const text = ce.clipboardData?.getData("text/plain") ?? "";
      const html = ce.clipboardData?.getData("text/html") ?? "";
      if (!text && !html) return;
      lastPasteAt.current = Date.now();
      handlePaste(text, html);
    };
    window.addEventListener("paste", handler as EventListener, true);
    return () => window.removeEventListener("paste", handler as EventListener, true);
  }, [handlePaste, isEditing, isPasteArmed]);

  return { clipRef, focusClipboard, onCopy, onPaste, onInput };
}
