import { useCallback } from "react";
import type { KeyboardEvent } from "react";
import type { CellPos } from "../types";

type GridKeydownOptions = {
  active: CellPos;
  rowCount: number;
  colCount: number;
  isEditing: boolean;
  moveActive: (dr: number, dc: number) => void;
  moveTo: (r: number, c: number) => void;
  startEdit: (initial?: string) => void;
  clearCell: () => void;
  undo: () => void;
  redo: () => void;
  onShiftMove?: (dr: number, dc: number) => void;
};

export function useGridKeydown(options: GridKeydownOptions) {
  const {
    active,
    rowCount,
    colCount,
    isEditing,
    moveActive,
    moveTo,
    startEdit,
    clearCell,
    undo,
    redo,
    onShiftMove,
  } = options;

  return useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (isEditing) return;
      const isCtrl = e.ctrlKey || e.metaKey;
      const lastRow = Math.max(0, rowCount - 1);
      const lastCol = Math.max(0, colCount - 1);

      if (isCtrl && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (isCtrl && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        redo();
        return;
      }

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case "ArrowUp":
          if (e.shiftKey && onShiftMove) onShiftMove(-1, 0);
          else if (isCtrl) moveTo(0, active.c);
          else moveActive(-1, 0);
          break;
        case "ArrowDown":
          if (e.shiftKey && onShiftMove) onShiftMove(1, 0);
          else if (isCtrl) moveTo(lastRow, active.c);
          else moveActive(1, 0);
          break;
        case "ArrowLeft":
          if (e.shiftKey && onShiftMove) onShiftMove(0, -1);
          else if (isCtrl) moveTo(active.r, 0);
          else moveActive(0, -1);
          break;
        case "ArrowRight":
          if (e.shiftKey && onShiftMove) onShiftMove(0, 1);
          else if (isCtrl) moveTo(active.r, lastCol);
          else moveActive(0, 1);
          break;
        case "Tab":
          e.preventDefault();
          moveActive(0, e.shiftKey ? -1 : 1);
          break;
        case "Enter":
          e.preventDefault();
          startEdit();
          break;
        case "F2":
          e.preventDefault();
          startEdit();
          break;
        case "Home":
          e.preventDefault();
          if (isCtrl) moveTo(0, 0);
          else moveTo(active.r, 0);
          break;
        case "End":
          e.preventDefault();
          if (isCtrl) moveTo(lastRow, lastCol);
          else moveTo(active.r, lastCol);
          break;
        case "Backspace":
        case "Delete":
          e.preventDefault();
          clearCell();
          break;
        default:
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            startEdit(e.key);
          }
          break;
      }
    },
    [
      active,
      clearCell,
      colCount,
      isEditing,
      moveActive,
      moveTo,
      redo,
      rowCount,
      startEdit,
      undo,
    ],
  );
}
