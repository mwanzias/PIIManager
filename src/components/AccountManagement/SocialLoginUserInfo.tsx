import React, { useState } from "react";
import {
  TextField,
  PrimaryButton,
  Stack,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import { Card, CardHeader, Text } from "@fluentui/react-components";
import { useAuth } from "../../context/AuthContext";

interface SocialLoginUserInfoProps {
  onComplete: () => void;
}

const SocialLoginUserInfo: React.FC<SocialLoginUserInfoProps> = ({
  onComplete,
}) => {
  const { user, updateUser } = useAuth();
  const [idNumber, setIdNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate phone number (simple validation for demo)
    if (!/^\d{9,12}$/.test(phoneNumber)) {
      setError("Please enter a valid phone number (9-12 digits)");
      return;
    }

    // Validate ID number (simple validation for demo)
    if (!/^\d{6,10}$/.test(idNumber)) {
      setError("Please enter a valid ID number (6-10 digits)");
      return;
    }

    try {
      // In a real app, you would send this data to your backend
      // For now, we'll just update the user in the context
      updateUser({
        idNumber,
        phoneNumber,
      });

      setSuccess(true);

      // Wait a moment before calling onComplete
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (error) {
      console.error("Error updating user info:", error);
      setError("Failed to update your information. Please try again.");
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
      <CardHeader
        header={
          <Text size={600} weight="semibold">
            Complete Your Profile
          </Text>
        }
      />

      <div style={{ padding: 24 }}>
        <Text>
          Since you signed in with {user?.socialLogin}, we need some additional
          information to complete your profile.
        </Text>

        {success ? (
          <MessageBar
            messageBarType={MessageBarType.success}
            style={{ marginTop: 16 }}
          >
            Your information has been saved successfully!
          </MessageBar>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack tokens={{ childrenGap: 16 }} style={{ marginTop: 16 }}>
              <TextField
                label="ID Number"
                value={idNumber}
                onChange={(e, newValue) => setIdNumber(newValue || "")}
                required
                placeholder="Enter your ID number"
              />

              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={(e, newValue) => setPhoneNumber(newValue || "")}
                required
                placeholder="Enter your phone number"
              />

              {error && (
                <MessageBar
                  messageBarType={MessageBarType.error}
                  isMultiline={false}
                >
                  {error}
                </MessageBar>
              )}

              <PrimaryButton type="submit" text="Save Information" />
            </Stack>
          </form>
        )}
      </div>
    </Card>
  );
};

export default SocialLoginUserInfo;
