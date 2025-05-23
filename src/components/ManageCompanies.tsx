import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
  ContextualMenu,
  IContextualMenuItem,
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  TextField,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Toggle,
  Stack,
  Text,
  SearchBox,
  IDetailsRowProps,
} from "@fluentui/react";
import { useAuth } from "../context/AuthContext";
import API_CONFIG from "../config/api";

interface Company {
  id: number;
  companyId: string;
  nameOfCompany: string;
  segment: string;
  companyContacts: string;
  contactemail: string;
  created_at: string;
  created_by: number;
  updated_at: string | null;
  updated_by: number | null;
  is_suspended: boolean;
  creator_email?: string;
  updater_email?: string;
}

interface CompanyFormData {
  nameOfCompany: string;
  segment: string;
  companyContacts: string;
  contactemail: string;
}

const ManageCompanies: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Ensure only Microsoft login users can access this component
  useEffect(() => {
    if (user && user.socialLogin !== "microsoft") {
      // Redirect non-Microsoft users to the allowed-companies view
      navigate("/dashboard?view=allowed-companies");
    }
  }, [user, navigate]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [contextMenuProps, setContextMenuProps] = useState<{
    target: HTMLElement | MouseEvent;
    items: IContextualMenuItem[];
  } | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<CompanyFormData>({
    nameOfCompany: "",
    segment: "",
    companyContacts: "",
    contactemail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuspended, setShowSuspended] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, [showSuspended]);

  const fetchCompanies = async () => {
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

      console.log("Using token:", token);

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getCompaniesWithUserInfo}?include_suspended=${showSuspended}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch companies");
      }

      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContextMenu = (
    ev: React.MouseEvent<HTMLElement>,
    company: Company
  ) => {
    ev.preventDefault();
    setSelectedCompany(company);

    const menuItems: IContextualMenuItem[] = [
      {
        key: "edit",
        text: "Edit Company",
        iconProps: { iconName: "Edit" },
        onClick: () => handleEditClick(company),
      },
      {
        key: "delete",
        text: "Delete Company",
        iconProps: { iconName: "Delete" },
        onClick: () => handleDeleteClick(company),
      },
      {
        key: "suspend",
        text: company.is_suspended ? "Unsuspend Company" : "Suspend Company",
        iconProps: { iconName: company.is_suspended ? "PlayResume" : "Pause" },
        onClick: () => handleSuspendClick(company),
      },
    ];

    setContextMenuProps({
      target: ev.currentTarget,
      items: menuItems,
    });
  };

  const handleEditClick = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      nameOfCompany: company.nameOfCompany,
      segment: company.segment || "",
      companyContacts: company.companyContacts || "",
      contactemail: company.contactemail || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const handleSuspendClick = (company: Company) => {
    setSelectedCompany(company);
    setIsSuspendDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedCompany) return;

    setIsSubmitting(true);
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

      console.log("Using token for edit:", token);

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.updateCompany}/${selectedCompany.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update company");
      }

      const updatedCompany = await response.json();

      // Update the companies list
      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === updatedCompany.id
            ? { ...company, ...updatedCompany }
            : company
        )
      );

      setSuccessMessage("Company updated successfully");
      setIsEditDialogOpen(false);

      // Refresh the companies list
      fetchCompanies();
    } catch (err) {
      console.error("Error updating company:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCompany) return;

    setIsSubmitting(true);
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

      console.log("Using token for delete:", token);

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.deleteCompany}/${selectedCompany.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete company");
      }

      // Remove the company from the list
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.id !== selectedCompany.id)
      );

      setSuccessMessage("Company deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Error deleting company:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuspendConfirm = async () => {
    if (!selectedCompany) return;

    setIsSubmitting(true);
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

      console.log("Using token for suspend:", token);

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.suspendCompany}/${selectedCompany.id}/suspend`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            is_suspended: !selectedCompany.is_suspended,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update company status");
      }

      const updatedCompany = await response.json();

      // Update the companies list
      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === updatedCompany.id
            ? { ...company, ...updatedCompany }
            : company
        )
      );

      setSuccessMessage(
        `Company ${
          updatedCompany.is_suspended ? "suspended" : "unsuspended"
        } successfully`
      );
      setIsSuspendDialogOpen(false);

      // Refresh the companies list
      fetchCompanies();
    } catch (err) {
      console.error("Error updating company status:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: keyof CompanyFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const columns: IColumn[] = [
    {
      key: "nameOfCompany",
      name: "Company Name",
      fieldName: "nameOfCompany",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "companyId",
      name: "Company ID",
      fieldName: "companyId",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
    },
    {
      key: "segment",
      name: "Segment",
      fieldName: "segment",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
    },
    {
      key: "contactemail",
      name: "Contact Email",
      fieldName: "contactemail",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "status",
      name: "Status",
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: Company) => (
        <span style={{ color: item.is_suspended ? "red" : "green" }}>
          {item.is_suspended ? "Suspended" : "Active"}
        </span>
      ),
    },
    {
      key: "createdBy",
      name: "Created By",
      fieldName: "creator_email",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "updatedBy",
      name: "Last Updated By",
      fieldName: "updater_email",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
    },
  ];

  // Filter companies based on search text
  const filteredCompanies = companies.filter((company) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();
    return (
      company.nameOfCompany.toLowerCase().includes(searchLower) ||
      company.companyId.toLowerCase().includes(searchLower) ||
      (company.segment &&
        company.segment.toLowerCase().includes(searchLower)) ||
      (company.contactemail &&
        company.contactemail.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Companies</h2>

      {successMessage && (
        <MessageBar
          messageBarType={MessageBarType.success}
          isMultiline={false}
          onDismiss={() => setSuccessMessage(null)}
          dismissButtonAriaLabel="Close"
          style={{ marginBottom: "20px" }}
        >
          {successMessage}
        </MessageBar>
      )}

      {error && (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          onDismiss={() => setError(null)}
          dismissButtonAriaLabel="Close"
          style={{ marginBottom: "20px" }}
        >
          {error}
        </MessageBar>
      )}

      <Stack
        horizontal
        horizontalAlign="space-between"
        style={{ marginBottom: "20px" }}
      >
        <SearchBox
          placeholder="Search companies..."
          onChange={(_, newValue) => setSearchText(newValue || "")}
          styles={{ root: { width: 300 } }}
        />
        <Toggle
          label="Show Suspended Companies"
          checked={showSuspended}
          onChange={(_, checked) => setShowSuspended(!!checked)}
        />
      </Stack>

      {loading ? (
        <Spinner size={SpinnerSize.large} label="Loading companies..." />
      ) : (
        <DetailsList
          items={filteredCompanies}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          onItemContextMenu={(item?: any, index?: number, ev?: Event) => {
            if (item && ev) {
              ev.preventDefault();
              const mouseEvent = ev as unknown as React.MouseEvent<HTMLElement>;
              handleContextMenu(mouseEvent, item as Company);
            }
          }}
          onItemInvoked={(item) => {
            // Handle click on row
            handleEditClick(item as Company);
          }}
          styles={{
            root: {
              cursor: "context-menu",
              selectors: {
                ".ms-DetailsRow": {
                  "&:hover": {
                    backgroundColor: "#f3f2f1",
                  },
                },
              },
            },
          }}
        />
      )}

      {/* Context Menu */}
      {contextMenuProps && (
        <ContextualMenu
          items={contextMenuProps.items}
          target={contextMenuProps.target}
          onDismiss={() => setContextMenuProps(null)}
        />
      )}

      {/* Edit Dialog */}
      <Dialog
        hidden={!isEditDialogOpen}
        onDismiss={() => setIsEditDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Edit Company",
        }}
        modalProps={{
          isBlocking: true,
          styles: { main: { maxWidth: 450 } },
        }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Company Name"
            required
            value={formData.nameOfCompany}
            onChange={(_, newValue) =>
              handleFormChange("nameOfCompany", newValue || "")
            }
          />
          <TextField
            label="Segment"
            value={formData.segment}
            onChange={(_, newValue) =>
              handleFormChange("segment", newValue || "")
            }
          />
          <TextField
            label="Company Contacts"
            value={formData.companyContacts}
            onChange={(_, newValue) =>
              handleFormChange("companyContacts", newValue || "")
            }
            multiline
            rows={3}
          />
          <TextField
            label="Contact Email"
            type="email"
            value={formData.contactemail}
            onChange={(_, newValue) =>
              handleFormChange("contactemail", newValue || "")
            }
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton
            onClick={handleEditSubmit}
            text={isSubmitting ? "Saving..." : "Save"}
            disabled={isSubmitting}
          />
          <DefaultButton
            onClick={() => setIsEditDialogOpen(false)}
            text="Cancel"
          />
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        hidden={!isDeleteDialogOpen}
        onDismiss={() => setIsDeleteDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Delete Company",
          subText: `Are you sure you want to delete ${selectedCompany?.nameOfCompany}? This action cannot be undone.`,
        }}
        modalProps={{
          isBlocking: true,
          styles: { main: { maxWidth: 450 } },
        }}
      >
        <DialogFooter>
          <PrimaryButton
            onClick={handleDeleteConfirm}
            text={isSubmitting ? "Deleting..." : "Delete"}
            disabled={isSubmitting}
          />
          <DefaultButton
            onClick={() => setIsDeleteDialogOpen(false)}
            text="Cancel"
          />
        </DialogFooter>
      </Dialog>

      {/* Suspend Confirmation Dialog */}
      <Dialog
        hidden={!isSuspendDialogOpen}
        onDismiss={() => setIsSuspendDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: selectedCompany?.is_suspended
            ? "Unsuspend Company"
            : "Suspend Company",
          subText: selectedCompany?.is_suspended
            ? `Are you sure you want to unsuspend ${selectedCompany?.nameOfCompany}? This will allow them to access assigned data.`
            : `Are you sure you want to suspend ${selectedCompany?.nameOfCompany}? This will prevent them from accessing any assigned data.`,
        }}
        modalProps={{
          isBlocking: true,
          styles: { main: { maxWidth: 450 } },
        }}
      >
        <DialogFooter>
          <PrimaryButton
            onClick={handleSuspendConfirm}
            text={
              isSubmitting
                ? "Processing..."
                : selectedCompany?.is_suspended
                ? "Unsuspend"
                : "Suspend"
            }
            disabled={isSubmitting}
          />
          <DefaultButton
            onClick={() => setIsSuspendDialogOpen(false)}
            text="Cancel"
          />
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ManageCompanies;
