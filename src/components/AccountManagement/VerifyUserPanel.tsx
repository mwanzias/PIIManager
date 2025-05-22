import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  Badge,
  Card,
  CardHeader,
  makeStyles,
  shorthands,
  tokens,
  Divider,
} from "@fluentui/react-components";
import {
  CheckmarkCircle24Regular,
  Warning24Regular,
} from "@fluentui/react-icons";
import VerifyDetails from "./VerifyDetails";
import MFASetup from "./MFASetup";
import API_CONFIG from "../../config/api";

const useStyles = makeStyles({
  // Container styles
  container: {
    padding: tokens.spacingVerticalXXL,
  },
  card: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  cardContent: {
    padding: tokens.spacingVerticalXXL,
  },
  verificationRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding("12px", "16px"),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease-in-out",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
    "@media (max-width: 640px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: tokens.spacingVerticalS,
    },
  },
  label: {
    width: "140px",
    fontWeight: tokens.fontWeightSemibold,
    "@media (max-width: 640px)": {
      width: "100%",
    },
  },
  valueContainer: {
    flex: 1,
    "@media (max-width: 640px)": {
      width: "100%",
    },
  },
  statusContainer: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    "@media (max-width: 640px)": {
      width: "100%",
      justifyContent: "space-between",
      marginTop: tokens.spacingVerticalS,
    },
  },
  verificationSection: {
    marginTop: tokens.spacingVerticalXXL,
  },
});

interface VerifyUserPanelProps {
  emailAddress: string;
  emailVerified: boolean;
  phoneNumber: number;
  phoneVerified: boolean;
  onVerify: (type: "email" | "phone" | "mfa") => void;
}

const VerifyUserPanel: React.FC<VerifyUserPanelProps> = ({
  emailAddress,
  emailVerified,
  phoneNumber,
  phoneVerified,
  onVerify,
}) => {
  const styles = useStyles();
  const [emailStatus, setEmailStatus] = useState(emailVerified);
  const [phoneStatus, setPhoneStatus] = useState(phoneVerified);
  const [showMFASetup, setShowMFASetup] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmailStatus(emailVerified);
      setPhoneStatus(phoneVerified);
    }, 3000);
    return () => clearInterval(interval);
  }, [emailVerified, phoneVerified]);

  useEffect(() => {
    // Show MFA setup when both email and phone are verified
    if (emailStatus && phoneStatus) {
      setShowMFASetup(true);
    }
  }, [emailStatus, phoneStatus]);

  const [startEmailVerification, setStartEmailVerification] = useState(false);
  const [startPhoneVerification, setStartPhoneVerification] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [phoneVerificationCode, setPhoneVerificationCode] = useState("");

  const handleEmailVerification = async () => {
    try {
      // Send a request to the backend to generate a verification token and send an email
      // Pass email as a query parameter instead of in the request body
      const response = await fetch(
        `${
          API_CONFIG.baseUrl
        }/auth/resend-email-verification?email=${encodeURIComponent(
          emailAddress
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert(
          "Verification email sent. Please check your inbox and click the verification link."
        );
      } else {
        const errorData = await response.json();
        alert(
          `Failed to send verification email: ${
            errorData.detail || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("Failed to send verification email. Please try again later.");
    }

    setStartEmailVerification(true);
  };

  const handleVerificationCode = async (code: string, toVerify: string) => {
    try {
      if (startEmailVerification) {
        setEmailVerificationCode(code);

        // Send a request to the backend to verify the email with the code
        // Pass email as a query parameter instead of in the request body
        const response = await fetch(
          `${API_CONFIG.baseUrl}${
            API_CONFIG.endpoints.emailverify
          }?email=${encodeURIComponent(emailAddress)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              otp: code,
            }),
          }
        );

        if (response.ok) {
          alert("Email verified successfully!");
          onVerify("email");
        } else {
          const errorData = await response.json();
          alert(
            `Failed to verify email: ${errorData.detail || "Invalid code"}`
          );
        }

        setStartEmailVerification(false);
      } else if (startPhoneVerification) {
        setPhoneVerificationCode(code);

        // Send a request to the backend to verify the phone with the code
        const response = await fetch(
          `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.phoneverify}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone_number: phoneNumber.toString(),
              otp: code,
            }),
          }
        );

        if (response.ok) {
          alert("Phone number verified successfully!");
          onVerify("phone");
        } else {
          const errorData = await response.json();
          alert(
            `Failed to verify phone number: ${
              errorData.detail || "Invalid code"
            }`
          );
        }

        setStartPhoneVerification(false);
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      alert("Failed to verify code. Please try again later.");
    }
  };

  const handleMFASetupComplete = (preferredMethod: "email" | "phone") => {
    console.log(`MFA setup complete. Preferred method: ${preferredMethod}`);
    // In a real app, you would save this preference to the user's profile
    setShowMFASetup(false);
    // Notify parent component that verification is complete
    onVerify("mfa");
  };

  const handlePhoneVerification = async () => {
    try {
      // Send a request to the backend to generate a verification code and send an SMS
      // Pass phone_number as a query parameter instead of in the request body
      const response = await fetch(
        `${API_CONFIG.baseUrl}${
          API_CONFIG.endpoints.resendPhoneVerification
        }?phone_number=${phoneNumber.toString()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert(
          "Verification code sent. Please check your phone and enter the code."
        );
        setStartPhoneVerification(true);
      } else {
        const errorData = await response.json();
        alert(
          `Failed to send verification code: ${
            errorData.detail || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      alert("Failed to send verification code. Please try again later.");
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          header={
            <Text size={600} weight="semibold">
              Verification Summary
            </Text>
          }
        />

        <div
          className={styles.cardContent}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: tokens.spacingVerticalL,
          }}
        >
          <div className={styles.verificationRow}>
            <Text className={styles.label}>Email:</Text>
            <Text className={styles.valueContainer}>{emailAddress}</Text>
            <div className={styles.statusContainer}>
              <Badge
                appearance={emailStatus ? "filled" : "outline"}
                color={emailStatus ? "success" : "warning"}
                icon={
                  emailStatus ? (
                    <CheckmarkCircle24Regular />
                  ) : (
                    <Warning24Regular />
                  )
                }
              >
                {emailStatus ? "Verified" : "Not Verified"}
              </Badge>

              <Button
                disabled={emailStatus}
                onClick={handleEmailVerification}
                appearance="primary"
                size="small"
              >
                Verify
              </Button>
            </div>
          </div>

          <Divider />

          <div className={styles.verificationRow}>
            <Text className={styles.label}>Phone Number:</Text>
            <Text className={styles.valueContainer}>{phoneNumber}</Text>
            <div className={styles.statusContainer}>
              <Badge
                appearance={phoneStatus ? "filled" : "outline"}
                color={phoneStatus ? "success" : "warning"}
                icon={
                  phoneStatus ? (
                    <CheckmarkCircle24Regular />
                  ) : (
                    <Warning24Regular />
                  )
                }
              >
                {phoneStatus ? "Verified" : "Not Verified"}
              </Badge>
              <Button
                disabled={phoneStatus}
                onClick={handlePhoneVerification}
                appearance="primary"
                size="small"
              >
                Verify
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <div className={styles.verificationSection}>
        {startEmailVerification && (
          <VerifyDetails
            onDataCollection={handleVerificationCode}
            toVerify="email"
          />
        )}
        {startPhoneVerification && (
          <VerifyDetails
            onDataCollection={handleVerificationCode}
            toVerify="phone"
          />
        )}
        {showMFASetup && (
          <MFASetup
            emailAddress={emailAddress}
            phoneNumber={phoneNumber.toString()}
            onComplete={handleMFASetupComplete}
          />
        )}
      </div>
    </div>
  );
};

export default VerifyUserPanel;
