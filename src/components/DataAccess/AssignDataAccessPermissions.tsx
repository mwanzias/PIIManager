import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API_CONFIG from "../../config/api";
import {
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  Checkbox,
  TextField,
  PrimaryButton,
  DefaultButton,
  Stack,
  Label,
  IDropdownOption,
  Dropdown,
} from "@fluentui/react";
import { colors } from "../../styling/theme";

interface Company {
  id: number;
  nameOfCompany: string;
  companyId: string;
  segment: string;
}

const AssignDataAccessPermissions: React.FC = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [emailAllowed, setEmailAllowed] = useState<boolean>(false);
  const [idNumberAllowed, setIdNumberAllowed] = useState<boolean>(false);
  const [phoneNumberAllowed, setPhoneNumberAllowed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

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

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getCompanies}`,
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

      const data: Company[] = await response.json();
      setCompanies(data);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      // Set empty array if there's an error
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (option) {
      setSelectedCompany(Number(option.key));
      // Reset permissions when company changes
      setEmailAllowed(false);
      setIdNumberAllowed(false);
      setPhoneNumberAllowed(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCompany) {
      setError("Please select a company");
      return;
    }

    if (!emailAllowed && !idNumberAllowed && !phoneNumberAllowed) {
      setError("Please select at least one permission to grant");
      return;
    }

    setSubmitting(true);
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
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.assignPermission}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            company_id: selectedCompany,
            email_allowed: emailAllowed,
            id_number_allowed: idNumberAllowed,
            phone_number_allowed: phoneNumberAllowed,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to assign permissions");
      }

      const data = await response.json();
      setSuccessMessage("Permissions assigned successfully");

      // Reset form
      setSelectedCompany(null);
      setEmailAllowed(false);
      setIdNumberAllowed(false);
      setPhoneNumberAllowed(false);
    } catch (err) {
      console.error("Error assigning permissions:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const companyOptions: IDropdownOption[] = companies.map((company) => ({
    key: company.id,
    text: `${company.nameOfCompany} (${company.companyId})`,
  }));

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ color: colors.primary, marginBottom: "20px" }}>
        Assign Data Access Permissions
      </h2>

      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <Spinner size={SpinnerSize.large} label="Loading companies..." />
        </div>
      ) : error && !successMessage ? (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={true}
          dismissButtonAriaLabel="Close"
          style={{ marginBottom: "20px" }}
        >
          {error}
        </MessageBar>
      ) : null}

      {successMessage && (
        <MessageBar
          messageBarType={MessageBarType.success}
          isMultiline={true}
          dismissButtonAriaLabel="Close"
          style={{ marginBottom: "20px" }}
        >
          {successMessage}
        </MessageBar>
      )}

      <form onSubmit={handleSubmit}>
        <Stack tokens={{ childrenGap: 15 }}>
          <Dropdown
            label="Select Company"
            options={companyOptions}
            selectedKey={selectedCompany}
            onChange={handleCompanyChange}
            placeholder="Select a company"
            required
            disabled={submitting}
          />

          <Label>Select Data to Allow Access</Label>
          <Stack tokens={{ childrenGap: 10 }}>
            <Checkbox
              label="Email Address"
              checked={emailAllowed}
              onChange={(_, checked) => setEmailAllowed(!!checked)}
              disabled={submitting}
            />
            <Checkbox
              label="ID Number"
              checked={idNumberAllowed}
              onChange={(_, checked) => setIdNumberAllowed(!!checked)}
              disabled={submitting}
            />
            <Checkbox
              label="Phone Number"
              checked={phoneNumberAllowed}
              onChange={(_, checked) => setPhoneNumberAllowed(!!checked)}
              disabled={submitting}
            />
          </Stack>

          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <PrimaryButton
              type="submit"
              text="Assign Permissions"
              disabled={submitting}
              style={{
                borderRadius: "9999px",
                padding: "0 20px",
              }}
            />
            <DefaultButton
              text="Reset"
              onClick={() => {
                setSelectedCompany(null);
                setEmailAllowed(false);
                setIdNumberAllowed(false);
                setPhoneNumberAllowed(false);
                setError(null);
                setSuccessMessage(null);
              }}
              disabled={submitting}
              style={{
                borderRadius: "9999px",
                padding: "0 20px",
              }}
            />
          </Stack>
        </Stack>
      </form>
    </div>
  );
};

export default AssignDataAccessPermissions;
