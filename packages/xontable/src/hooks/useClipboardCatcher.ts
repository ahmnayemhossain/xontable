import { useCallback, useRef } from "react";
import type { ClipboardEvent } from "react";
import { parseTSV, toTSV } from "../utils";

type ClipboardCatcherOptions = {
  isEditing: boolean;
  getCopyBlock: () => string[][];
  onPasteBlock: (block: string[][]) => void;
  onCopy?: () => void;
};

export function useClipboardCatcher(options: ClipboardCatcherOptions) {
  const { isEditing, getCopyBlock, onPasteBlock, onCopy: onCopyCb } = options;
  const clipRef = useRef<HTMLTextAreaElement | null>(null);

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

  const onPaste = useCallback(
    (e: ClipboardEvent) => {
      if (isEditing) return;
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      const block = parseTSV(text);
      if (block.length === 0) return;
      onPasteBlock(block);
    },
    [isEditing, onPasteBlock],
  );

  return { clipRef, focusClipboard, onCopy, onPaste };
}
