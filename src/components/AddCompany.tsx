import React, { useState } from "react";
import {
  TextField,
  PrimaryButton,
  Stack,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_CONFIG from "../config/api";
import { colors } from "../styling/theme";

interface CompanyFormData {
  nameOfCompany: string;
  companyId: string;
  segment: string;
  companyContacts: string;
  contactemail: string;
}

const AddCompany: React.FC = () => {
  const [formData, setFormData] = useState<CompanyFormData>({
    nameOfCompany: "",
    companyId: "",
    segment: "",
    companyContacts: "",
    contactemail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: keyof CompanyFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      // Get the token from localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error("User not authenticated");
      }

      const userData = JSON.parse(storedUser);
      const token = userData.access_token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.createCompany}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create company");
      }

      const data = await response.json();
      console.log("Company created successfully:", data);
      setSuccess(true);

      // Reset form after successful submission
      setFormData({
        nameOfCompany: "",
        companyId: "",
        segment: "",
        companyContacts: "",
        contactemail: "",
      });

      // Redirect to companies list after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Error creating company:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <h2>Add New Company</h2>

      {error && (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          dismissButtonAriaLabel="Close"
          style={{ marginBottom: "20px" }}
        >
          {error}
        </MessageBar>
      )}

      {success && (
        <MessageBar
          messageBarType={MessageBarType.success}
          isMultiline={false}
          dismissButtonAriaLabel="Close"
          style={{ marginBottom: "20px" }}
        >
          Company created successfully! Redirecting...
        </MessageBar>
      )}

      <form onSubmit={handleSubmit}>
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Company Name"
            required
            value={formData.nameOfCompany}
            onChange={(_, newValue) =>
              handleChange("nameOfCompany", newValue || "")
            }
          />

          <TextField
            label="Company ID"
            required
            value={formData.companyId}
            onChange={(_, newValue) =>
              handleChange("companyId", newValue || "")
            }
          />

          <TextField
            label="Segment"
            value={formData.segment}
            onChange={(_, newValue) => handleChange("segment", newValue || "")}
          />

          <TextField
            label="Company Contacts"
            value={formData.companyContacts}
            onChange={(_, newValue) =>
              handleChange("companyContacts", newValue || "")
            }
            multiline
            rows={3}
          />

          <TextField
            label="Contact Email"
            type="email"
            value={formData.contactemail}
            onChange={(_, newValue) =>
              handleChange("contactemail", newValue || "")
            }
          />

          <PrimaryButton
            type="submit"
            text={isSubmitting ? "Creating..." : "Create Company"}
            disabled={isSubmitting}
            style={{ marginTop: "20px" }}
          />
        </Stack>
      </form>
    </div>
  );
};

export default AddCompany;
