//import { allowedCompaniesProps } from "../../Interfaces/PseudoInterfaces";
import React, { useState } from "react";
import { Button } from "@fluentui/react-button";
import { Edit24Regular } from "@fluentui/react-icons";
import { Badge } from "@fluentui/react-badge";
import { colors } from "../../styling/theme";
import {
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridCellFocusMode,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  TableCellLayout,
  TableColumnDefinition,
  TableColumnId,
} from "@fluentui/react-table";
import CompanyAllowEdit from "./CompanyAllowEdit";

type namecell = {
  label: string;
  companyname: string;
};

type sectorCell = {
  label: string;
  sectorname: string;
};

type dataaccess = {
  dataname: string;
  allowed: boolean;
};

type dataaccessCell = {
  dataaccess: dataaccess[];
};
type allowedCell = {
  label: string;
  accesibledata: dataaccess;
};
type displayItem = {
  name: namecell;
  sector: sectorCell;
  allowed: dataaccessCell;
};

const items: displayItem[] = [
  {
    name: { label: "Naivas SuperMat", companyname: "Naivas SuperMat A" },
    sector: { label: "Technology", sectorname: "Software" },
    allowed: {
      dataaccess: [
        { dataname: "idnumber", allowed: true },
        { dataname: "email address", allowed: false },
        { dataname: "phone number", allowed: true },
      ],
    },
  },
  {
    name: { label: "Company B", companyname: "Finance Inc." },
    sector: { label: "Finance", sectorname: "Banking" },
    allowed: {
      dataaccess: [
        { dataname: "phone number", allowed: true },
        { dataname: "email address", allowed: true },
        { dataname: "idnumber", allowed: false },
      ],
    },
  },
  {
    name: { label: "Company C", companyname: "Health Solutions" },
    sector: { label: "Healthcare", sectorname: "Medical" },
    allowed: {
      dataaccess: [
        { dataname: "phone number", allowed: true },
        { dataname: "email address", allowed: true },
        { dataname: "idnumber", allowed: true },
      ],
    },
  },
];

const getCellFocusMode = (columnId: TableColumnId): DataGridCellFocusMode => {
  switch (columnId) {
    case "singleAction":
      return "none";
    case "actions":
      return "group";
    default:
      return "cell";
  }
};

const AllowedCompanies: React.FC = () => {
  const [editingItems, setEditingItems] = useState(false);
  const [editingCompany, setEditingCompany] = useState<displayItem>([] as any);

  const columns: TableColumnDefinition<displayItem>[] = [
    createTableColumn<displayItem>({
      columnId: "name",
      renderHeaderCell: () => {
        return "Company Name";
      },
      renderCell: (item) => {
        return <TableCellLayout>{item.name.companyname}</TableCellLayout>;
      },
    }),
    createTableColumn<displayItem>({
      columnId: "sector",
      renderHeaderCell: () => {
        return "Company Sector";
      },
      renderCell: (item) => {
        return (
          <TableCellLayout>
            {item.sector.label} - {item.sector.sectorname}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<displayItem>({
      columnId: "allowed",
      renderHeaderCell: () => {
        return "Allowed Data Access";
      },
      renderCell: (item) => {
        const allowedItems = item.allowed.dataaccess.filter(
          (entry) => entry.allowed
        );

        return (
          <TableCellLayout>
            {allowedItems.length > 0
              ? allowedItems.map((entry, index) => (
                  <Badge
                    key={index}
                    appearance="filled"
                    style={{ marginRight: 4 }}
                  >
                    {entry.dataname}
                  </Badge>
                ))
              : "None"}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<displayItem>({
      columnId: "actions",
      renderHeaderCell: () => "Actions",
      renderCell: (item) => (
        <TableCellLayout>
          <Button
            icon={<Edit24Regular />}
            appearance="primary"
            shape="circular"
            style={{
              borderRadius: "9999px",
              padding: "6px 12px",
            }}
            onClick={() => {
              setEditingItems(true);
              setEditingCompany(item);
            }}
          >
            Edit
          </Button>
        </TableCellLayout>
      ),
    }),
    createTableColumn<displayItem>({
      columnId: "blockinfo",
      renderHeaderCell: () => "blockinfo",
      renderCell: (item) => (
        <TableCellLayout>
          <Button
            icon={<Edit24Regular />}
            appearance="primary"
            shape="circular"
            style={{
              borderRadius: "9999px",
              padding: "6px 12px",
            }}
            onClick={() => {
              console.log(
                "This company is to be blocked",
                item.name.companyname
              );
            }}
          >
            Block Access
          </Button>
        </TableCellLayout>
      ),
    }),
  ];

  const handleCompanyEditSave = () => {
    setEditingItems(false);
    setEditingCompany({} as displayItem);
  };

  return (
    <div>
      <DataGrid
        items={items}
        columns={columns}
        sortable
        selectionMode="multiselect"
        getRowId={(item) => item.name.companyname}
        onSelectionChange={(e, data) => console.log(data)}
        style={{ minWidth: "550px" }}
      >
        <DataGridHeader>
          <DataGridRow
            style={{
              backgroundColor: colors.primaryLight, // light blue shade
              textAlign: "center",
            }}
            selectionCell={{
              checkboxIndicator: { "aria-label": "Select all rows" },
            }}
          >
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell
                style={{
                  fontWeight: "bold",
                  color: colors.primary,
                }}
              >
                {renderHeaderCell()}
              </DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<displayItem>>
          {({ item, rowId }) => (
            <DataGridRow<displayItem>
              key={rowId}
              selectionCell={{
                checkboxIndicator: { "aria-label": "Select row" },
              }}
            >
              {({ renderCell, columnId }) => (
                <DataGridCell focusMode={getCellFocusMode(columnId)}>
                  {renderCell(item)}
                </DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {editingItems && (
          <CompanyAllowEdit
            companyname={editingCompany.name.companyname}
            sectorname={editingCompany.sector.sectorname}
            allowed={editingCompany.allowed.dataaccess.map((entry) => {
              return entry.allowed ? entry.dataname : "";
            })}
            onSave={handleCompanyEditSave}
          />
        )}
      </div>
    </div>
  );
};

export default AllowedCompanies;
// This component is a placeholder for the AllowedCompanies functionality.
