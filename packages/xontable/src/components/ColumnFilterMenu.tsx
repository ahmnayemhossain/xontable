import React from "react";

type ColumnFilterMenuProps = {
  isOpen: boolean;
  search: string;
  options: string[];
  allChecked: boolean;
  isChecked: (value: string) => boolean;
  onSearchChange: (value: string) => void;
  onToggle: (value: string) => void;
  onToggleAll: () => void;
};

export function ColumnFilterMenu(props: ColumnFilterMenuProps) {
  const {
    isOpen,
    search,
    options,
    allChecked,
    isChecked,
    onSearchChange,
    onToggle,
    onToggleAll,
  } = props;

  if (!isOpen) return null;

  return (
    <div className="xontable-filter-menu">
      <input
        className="xontable-filter-search"
        name="xontable-filter-search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        placeholder="Search"
      />
      <div className="xontable-filter-actions">
        <label className="xontable-filter-toggle">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={onToggleAll}
          />
          <span>All</span>
        </label>
      </div>
      <div className="xontable-filter-list">
        {options.map((opt) => (
          <label key={opt} className="xontable-filter-item">
            <input
              type="checkbox"
              checked={isChecked(opt)}
              onChange={() => onToggle(opt)}
            />
            <span title={opt}>{opt || "(blank)"}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
