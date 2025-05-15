//import { allowedCompaniesProps } from "../../Interfaces/PseudoInterfaces";

import { Badge } from "@fluentui/react-badge";
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
];

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
  return (
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
            backgroundColor: "#e6f4ff", // light blue shade
          }}
          selectionCell={{
            checkboxIndicator: { "aria-label": "Select all rows" },
          }}
        >
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell
              style={{
                fontWeight: "bold",
                color: "#0078d4",
                // Fluent UI blue
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
  );
};

export default AllowedCompanies;
// This component is a placeholder for the AllowedCompanies functionality.
