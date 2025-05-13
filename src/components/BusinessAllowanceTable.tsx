import React, { useState } from "react";
import {
  Checkbox,
  PrimaryButton,
  Text,
  TextField,
  Dropdown,
  IDropdownOption,
} from "@fluentui/react";

interface Company {
  id: string;
  name: string;
  natureOfBusiness: string;
  allowEmail: boolean;
  allowPhone: boolean;
  allowIdNumber: boolean;
}

const initialData: Company[] = [
  {
    id: "1",
    name: "Company A",
    natureOfBusiness: "Retail",
    allowEmail: false,
    allowPhone: false,
    allowIdNumber: false,
  },
  {
    id: "2",
    name: "Company B",
    natureOfBusiness: "Services",
    allowEmail: true,
    allowPhone: true,
    allowIdNumber: false,
  },
];

const BusinessAllowanceCardList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(initialData);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

  const handleCheckboxChange = (id: string, key: keyof Company) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: !c[key] } : c))
    );
  };

  const allowAll = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, allowEmail: true, allowPhone: true, allowIdNumber: true }
          : c
      )
    );
  };

  const removeAll = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, allowEmail: false, allowPhone: false, allowIdNumber: false }
          : c
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      await fetch("/api/save-allowance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companies),
      });
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes.");
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.natureOfBusiness.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "allowed" &&
        (company.allowEmail || company.allowPhone || company.allowIdNumber)) ||
      (filter === "disallowed" &&
        !company.allowEmail &&
        !company.allowPhone &&
        !company.allowIdNumber);
    return matchesSearch && matchesFilter;
  });

  const filterOptions: IDropdownOption[] = [
    { key: "all", text: "All" },
    { key: "allowed", text: "With Allowances" },
    { key: "disallowed", text: "Without Allowances" },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <TextField
          label="Search"
          placeholder="Search companies..."
          value={search}
          onChange={(_, newValue) => setSearch(newValue || "")}
        />
        <Dropdown
          label="Filter"
          selectedKey={filter}
          options={filterOptions}
          onChange={(_, option) => setFilter(option?.key as string)}
        />
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "#f3f3f3",
            zIndex: 1,
          }}
        >
          <tr>
            <th style={cellStyle}>Company Name</th>
            <th style={cellStyle}>Nature of Business</th>
            <th style={cellStyle}>Allow Email</th>
            <th style={cellStyle}>Allow Phone</th>
            <th style={cellStyle}>Allow ID</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCompanies.map((company) => (
            <tr key={company.id}>
              <td style={cellStyle}>{company.name}</td>
              <td style={cellStyle}>{company.natureOfBusiness}</td>
              <td style={cellStyle}>
                <Checkbox
                  checked={company.allowEmail}
                  onChange={() =>
                    handleCheckboxChange(company.id, "allowEmail")
                  }
                />
              </td>
              <td style={cellStyle}>
                <Checkbox
                  checked={company.allowPhone}
                  onChange={() =>
                    handleCheckboxChange(company.id, "allowPhone")
                  }
                />
              </td>
              <td style={cellStyle}>
                <Checkbox
                  checked={company.allowIdNumber}
                  onChange={() =>
                    handleCheckboxChange(company.id, "allowIdNumber")
                  }
                />
              </td>
              <td style={cellStyle}>
                <PrimaryButton
                  text="Allow All"
                  onClick={() => allowAll(company.id)}
                />
                <PrimaryButton
                  text="Remove All"
                  onClick={() => removeAll(company.id)}
                  style={{ marginLeft: 8 }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 20 }}>
        <PrimaryButton text="Save Changes" onClick={handleSaveChanges} />
      </div>
    </div>
  );
};

const cellStyle: React.CSSProperties = {
  padding: "8px",
  border: "1px solid #ddd",
  textAlign: "left",
};

export default BusinessAllowanceCardList;
