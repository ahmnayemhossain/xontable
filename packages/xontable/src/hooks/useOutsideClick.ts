import { useEffect } from "react";

type OutsideClickOptions = {
  isOpen: boolean;
  onClose: () => void;
};

export function useOutsideClick(options: OutsideClickOptions) {
  const { isOpen, onClose } = options;

  useEffect(() => {
    if (!isOpen) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(".xontable-filter-menu") || target.closest(".xontable-filter-btn")) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);
}
