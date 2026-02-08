import React from "react";

type Option = { value: string; label: string };

type SelectMenuProps = {
  isOpen: boolean;
  rect: DOMRect | null;
  options: Option[];
  loading: boolean;
  filter: string;
  onSelect: (value: string) => void;
};

export function SelectMenu(props: SelectMenuProps) {
  const { isOpen, rect, options, loading, filter, onSelect } = props;
  if (!isOpen || !rect) return null;
  const q = filter.toLowerCase();
  const list = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  const current = filter.trim();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(rect.width, vw - 16);
  const left = Math.min(Math.max(8, rect.left), vw - width - 8);
  const maxH = Math.min(220, vh - rect.bottom - 12);
  const placeAbove = maxH < 120;
  const top = placeAbove ? Math.max(8, rect.top - 6) : rect.bottom + 2;

  const renderLabel = (label: string) => {
    if (!q) return label;
    const idx = label.toLowerCase().indexOf(q);
    if (idx < 0) return label;
    const before = label.slice(0, idx);
    const match = label.slice(idx, idx + q.length);
    const after = label.slice(idx + q.length);
    return (
      <>
        {before}
        <strong>{match}</strong>
        {after}
      </>
    );
  };

  return (
    <div
      className="xontable-select-menu"
      style={{
        position: "fixed",
        left,
        top,
        width,
        maxHeight: placeAbove ? Math.min(220, rect.top - 12) : maxH,
        transform: placeAbove ? "translateY(-100%)" : "none",
      }}
    >
      {loading && <div className="xontable-select-item">Loading...</div>}
      {!loading && list.length === 0 && (
        <div className="xontable-select-item">No results</div>
      )}
      {!loading && list.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={[
            "xontable-select-item",
            current && (opt.value === current || opt.label === current) ? "is-active" : "",
          ].join(" ")}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSelect(opt.value)}
          title={opt.label}
        >
          {renderLabel(opt.label)}
        </button>
      ))}
    </div>
  );
}
