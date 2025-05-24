import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API_CONFIG from "../../config/api";
import { Button } from "@fluentui/react-button";
import { Edit24Regular } from "@fluentui/react-icons";
import { Badge } from "@fluentui/react-badge";
import {
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
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

// Interface for the API response
interface PermissionWithCompany {
  id: number;
  user_id: number;
  company_id: number;
  email_allowed: boolean;
  id_number_allowed: boolean;
  phone_number_allowed: boolean;
  created_at: string;
  updated_at: string;
  company_name: string;
  company_id_str: string;
}

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
  const { user } = useAuth();
  const [editingItems, setEditingItems] = useState(false);
  const [editingCompany, setEditingCompany] = useState<displayItem>([] as any);
  const [items, setItems] = useState<displayItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAllowedCompanies();
  }, []);

  const fetchAllowedCompanies = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the token from localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error("User not authenticated");
      }

      const userData = JSON.parse(storedUser);
      const token = userData.token || userData.access_token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getUserPermissions}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to fetch allowed companies"
        );
      }

      const data: PermissionWithCompany[] = await response.json();

      // Transform API data to displayItem format
      const transformedItems: displayItem[] = data.map((permission) => ({
        name: {
          label: permission.company_name,
          companyname: permission.company_name,
        },
        sector: {
          label: "Company",
          sectorname: permission.company_id_str,
        },
        allowed: {
          dataaccess: [
            { dataname: "idnumber", allowed: permission.id_number_allowed },
            { dataname: "email address", allowed: permission.email_allowed },
            {
              dataname: "phone number",
              allowed: permission.phone_number_allowed,
            },
          ],
        },
      }));

      setItems(transformedItems);
    } catch (err) {
      console.error("Error fetching allowed companies:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      // Set empty array if there's an error
      setItems([]);
    } finally {
      setLoading(false);
    }
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
      renderHeaderCell: () => "Actions",
      renderCell: (item) => {
        // Find the company ID from the name
        const companyData = items.find(
          (company) => company.name.companyname === item.name.companyname
        );
        const companyId = companyData
          ? parseInt(companyData.sector.sectorname.split("-")[0].trim())
          : null;

        return (
          <TableCellLayout>
            <Button
              appearance="primary"
              shape="circular"
              style={{
                borderRadius: "9999px",
                padding: "6px 12px",
                backgroundColor: colors.error,
              }}
              onClick={() => handleRevokePermissions(companyId)}
              disabled={!companyId}
            >
              Revoke Access
            </Button>
          </TableCellLayout>
        );
      },
    }),
  ];

  const handleCompanyEditSave = () => {
    setEditingItems(false);
    setEditingCompany({} as displayItem);
    // Refresh the list after editing
    fetchAllowedCompanies();
  };

  const handleRevokePermissions = async (companyId: number | null) => {
    if (!companyId) {
      setError("Invalid company ID");
      return;
    }

    setRevoking(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Get the token from localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error("User not authenticated");
      }

      const userData = JSON.parse(storedUser);
      const token = userData.token || userData.access_token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.revokeCompanyPermissions}/${companyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to revoke permissions");
      }

      setSuccessMessage(`Successfully revoked all permissions for the company`);

      // Refresh the list after revoking
      fetchAllowedCompanies();
    } catch (err) {
      console.error("Error revoking permissions:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <Spinner
            size={SpinnerSize.large}
            label="Loading allowed companies..."
          />
        </div>
      ) : error ? (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={true}
          dismissButtonAriaLabel="Close"
        >
          Error loading allowed companies: {error}
        </MessageBar>
      ) : items.length === 0 ? (
        <MessageBar messageBarType={MessageBarType.info} isMultiline={true}>
          You haven't allowed any companies to access your data yet.
        </MessageBar>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default AllowedCompanies;
// This component is a placeholder for the AllowedCompanies functionality.
