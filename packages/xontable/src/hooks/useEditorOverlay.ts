import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";
import type { CellPos } from "../types";

type EditorOptions = {
  active: CellPos;
  activeCellRef: RefObject<HTMLDivElement | null>;
  getValue: (r: number, c: number) => string;
  onCommit: (value: string) => void;
  onCancel?: () => void;
  onTab?: (dir: number) => void;
  onEnter?: (dir: number) => void;
};

export function useEditorOverlay(options: EditorOptions) {
  const { active, activeCellRef, getValue, onCommit, onCancel, onTab, onEnter } =
    options;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [editorRect, setEditorRect] = useState<DOMRect | null>(null);
  const [selectAll, setSelectAll] = useState(true);
  const editorRef = useRef<HTMLInputElement | null>(null);

  const measureRect = useCallback(() => {
    const el = activeCellRef.current;
    if (!el) return;
    setEditorRect(el.getBoundingClientRect());
    requestAnimationFrame(() => {
      const input = editorRef.current;
      if (!input) return;
      input.focus();
      if (selectAll) {
        input.select();
      } else {
        const len = input.value.length;
        input.setSelectionRange(len, len);
      }
    });
  }, [activeCellRef, selectAll]);

  const startEdit = useCallback(
    (initialValue?: string) => {
      const current = getValue(active.r, active.c);
      setDraft(initialValue ?? current);
      setSelectAll(initialValue == null);
      setIsEditing(true);
      requestAnimationFrame(measureRect);
    },
    [active, getValue, measureRect],
  );

  const finish = useCallback(() => {
    setIsEditing(false);
    setEditorRect(null);
  }, []);

  const commitEdit = useCallback((value?: string) => {
    onCommit(value ?? draft);
    finish();
  }, [draft, finish, onCommit]);

  const cancelEdit = useCallback(() => {
    onCancel?.();
    finish();
  }, [finish, onCancel]);

  const onEditorKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commitEdit();
        onEnter?.(e.shiftKey ? -1 : 1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelEdit();
      } else if (e.key === "Tab") {
        e.preventDefault();
        commitEdit();
        onTab?.(e.shiftKey ? -1 : 1);
      }
    },
    [cancelEdit, commitEdit, onEnter, onTab],
  );

  return {
    isEditing,
    draft,
    setDraft,
    editorRect,
    editorRef,
    startEdit,
    commitEdit,
    cancelEdit,
    onEditorKeyDown,
  };
}
