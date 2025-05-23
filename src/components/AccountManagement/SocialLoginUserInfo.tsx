import React, { useState, useEffect } from "react";
import {
  TextField,
  PrimaryButton,
  Stack,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import { Card, CardHeader, Text } from "@fluentui/react-components";
import { useAuth } from "../../context/AuthContext";
import { registerSocialUser } from "../../utils/msalUtils";

interface SocialLoginUserInfoProps {
  onComplete: () => void;
  email?: string;
  provider?: string;
  isNewUser?: boolean;
}

const SocialLoginUserInfo: React.FC<SocialLoginUserInfoProps> = ({
  onComplete,
  email: propEmail,
  provider: propProvider,
  isNewUser: propIsNewUser,
}) => {
  const { user, updateUser, signIn } = useAuth();
  const [idNumber, setIdNumber] = useState<string>(user?.idNumber || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    user?.phone_number || ""
  );
  const [email, setEmail] = useState<string>(propEmail || user?.email || "");
  const [provider, setProvider] = useState<string>(
    propProvider || user?.socialLogin || "microsoft"
  );
  const [isNewUser, setIsNewUser] = useState<boolean>(
    propIsNewUser !== undefined ? propIsNewUser : !user?.idNumber
  );
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // If user data is already available, pre-populate the fields
  useEffect(() => {
    if (user) {
      if (user.idNumber) setIdNumber(user.idNumber);
      if (user.phone_number) setPhoneNumber(user.phone_number);
      if (!email && user.email) setEmail(user.email);
      if (!provider && user.socialLogin) setProvider(user.socialLogin);
    }
  }, [user, email, provider]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate phone number (simple validation for demo)
    if (!/^\d{9,12}$/.test(phoneNumber)) {
      setError("Please enter a valid phone number (9-12 digits)");
      setIsLoading(false);
      return;
    }

    // Validate ID number (simple validation for demo)
    if (!/^\d{6,10}$/.test(idNumber)) {
      setError("Please enter a valid ID number (6-10 digits)");
      setIsLoading(false);
      return;
    }

    try {
      if (isNewUser) {
        // For new users, register them with the backend
        const response = await registerSocialUser(
          email,
          idNumber,
          phoneNumber,
          provider
        );

        // Sign in the user with the response from the backend
        signIn({
          id: response.user_id,
          idNumber: response.id_number,
          email: response.email,
          phone_number: response.phone_number,
          socialLogin: response.provider,
          isEmailVerified: true, // Email is verified through social login
          isPhoneVerified: false, // Phone will need verification
          token: response.access_token,
          pseudo_code: response.pseudo_code,
        });
      } else {
        // For existing users, just update the user in the context
        updateUser({
          idNumber,
          phone_number: phoneNumber,
          isEmailVerified: true, // Ensure email is marked as verified for social login users
        });
      }

      setSuccess(true);
      setIsLoading(false);

      // Wait a moment before calling onComplete
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (error: any) {
      console.error("Error updating user info:", error);
      setIsLoading(false);

      // Check for specific error messages from the backend
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to update your information. Please try again.");
      }
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
      <CardHeader
        header={
          <Text size={600} weight="semibold">
            {isNewUser ? "Complete Your Profile" : "Your Profile Information"}
          </Text>
        }
      />

      <div style={{ padding: 24 }}>
        <Text>
          {isNewUser
            ? `Since you signed in with ${provider}, we need some additional information to complete your profile.`
            : `Your profile information is shown below. You can update it if needed.`}
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
              <TextField label="Email" value={email} disabled={true} readOnly />

              <TextField
                label="ID Number"
                value={idNumber}
                onChange={(e, newValue) => setIdNumber(newValue || "")}
                required
                placeholder="Enter your ID number"
                disabled={isLoading}
              />

              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={(e, newValue) => setPhoneNumber(newValue || "")}
                required
                placeholder="Enter your phone number"
                disabled={isLoading}
              />

              {error && (
                <MessageBar
                  messageBarType={MessageBarType.error}
                  isMultiline={false}
                >
                  {error}
                </MessageBar>
              )}

              {isLoading ? (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <Spinner size={SpinnerSize.medium} label="Processing..." />
                </div>
              ) : (
                <PrimaryButton
                  type="submit"
                  text="Save Information"
                  disabled={isLoading}
                />
              )}
            </Stack>
          </form>
        )}
      </div>
    </Card>
  );
};

export default SocialLoginUserInfo;
