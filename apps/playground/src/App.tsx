import React from "react";
import { XOnTable, type ColumnDef } from "xontable";

type Row = { id: string; name: string; group: string; subgroup: string; city: string; active: boolean };

const groupOptions = [
  { value: "food", label: "Food" },
  { value: "tech", label: "Tech" },
];

const subgroupOptions: Record<string, { value: string; label: string }[]> = {
  food: [
    { value: "fruits", label: "Fruits" },
    { value: "snacks", label: "Snacks" },
  ],
  tech: [
    { value: "mobile", label: "Mobile" },
    { value: "laptop", label: "Laptop" },
  ],
};

const cityOptions = [
  { value: "toronto", label: "Toronto" },
  { value: "london", label: "London" },
  { value: "tokyo", label: "Tokyo" },
];

const columns: ColumnDef<Row>[] = [
  { key: "name", label: "Name", width: 180, group: "User", editable: true },
  { key: "active", label: "Active", width: 80, group: "User", type: "checkbox", editable: true },
  {
    key: "group",
    label: "Group",
    width: 140,
    group: "Account Details",
    type: "select",
    getOptions: async () => groupOptions,
    editable: true,
  },
  {
    key: "subgroup",
    label: "Subgroup",
    width: 160,
    group: "Account Details",
    type: "select",
    dependsOn: "group",
    getOptions: async (row) => subgroupOptions[row.group] ?? [],
    editable: true,
  },
  {
    key: "city",
    label: "City",
    width: 140,
    group: "Login info",
    type: "select",
    options: cityOptions,
    editable: true,
  },
];

export default function App() {
  const [rows, setRows] = React.useState<Row[]>([
    { id: "1", name: "Rice", active: true, group: "food", subgroup: "fruits", city: "toronto" },
    { id: "2", name: "Eggs", active: false, group: "food", subgroup: "snacks", city: "london" },
    { id: "3", name: "Phone", active: true, group: "tech", subgroup: "mobile", city: "tokyo" },
  ]);

  return (
    <div style={{ padding: 20 }}>
      <XOnTable columns={columns} rows={rows} onChange={(next) => setRows(next)} />
    </div>
  );
}
