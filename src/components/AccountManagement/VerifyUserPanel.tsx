import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  Badge,
  Tooltip,
  Card,
  CardHeader,
} from "@fluentui/react-components";
import { Stack } from "@fluentui/react";
import {
  CheckmarkCircle24Regular,
  Warning24Regular,
} from "@fluentui/react-icons";
import VerifyDetails from "./VerifyDetails";

interface VerifyUserPanelProps {
  emailAddress: string;
  emailVerified: boolean;
  phoneNumber: number;
  phoneVerified: boolean;
  onVerify: (type: "email" | "phone") => void;
}

const VerifyUserPanel: React.FC<VerifyUserPanelProps> = ({
  emailAddress,
  emailVerified,
  phoneNumber,
  phoneVerified,
  onVerify,
}) => {
  const [emailStatus, setEmailStatus] = useState(emailVerified);
  const [phoneStatus, setPhoneStatus] = useState(phoneVerified);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmailStatus(emailVerified);
      setPhoneStatus(phoneVerified);
    }, 3000);
    return () => clearInterval(interval);
  }, [emailVerified, phoneVerified]);

  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  };

  const labelStyle: React.CSSProperties = {
    width: "140px",
    fontWeight: 600,
  };

  const [startEmailVerification, setStartEmailVerification] = useState(false);
  const [startPhoneVerification, setStartPhoneVerification] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [phoneVerificationCode, setPhoneVerificationCode] = useState("");

  const handleEmailVerification = () => {
    setStartEmailVerification(true);
  };

  const handleVerificationCode = (code: string, toVerify: string) => {
    if (startEmailVerification) {
      setEmailVerificationCode(code);
      onVerify("email");
      setStartEmailVerification(false);
    } else if (startPhoneVerification) {
      setPhoneVerificationCode(code);
      onVerify("phone");
      setStartPhoneVerification(false);
    }
  };

  const handlePhoneVerification = () => {
    setStartPhoneVerification(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ maxWidth: 800, margin: "0 auto" }}>
        <CardHeader
          header={
            <Text size={600} weight="semibold">
              Verification Summary
            </Text>
          }
        />

        <Stack tokens={{ childrenGap: 20 }} style={{ padding: 24 }}>
          <div style={rowStyle}>
            <Text style={labelStyle}>Email:</Text>
            <Text>{emailAddress}</Text>
            <Badge
              appearance={emailStatus ? "filled" : "outline"}
              color={emailStatus ? "success" : "warning"}
              icon={
                emailStatus ? (
                  <CheckmarkCircle24Regular />
                ) : (
                  <Warning24Regular
                    style={{
                      fontWeight: 700,
                      strokeWidth: 4,
                      color: "#cc3300",
                    }}
                  />
                )
              }
            >
              {emailStatus ? "Verified" : "Not Verified"}
            </Badge>

            <Button
              disabled={emailStatus}
              onClick={handleEmailVerification}
              appearance="primary"
            >
              Verify
            </Button>
          </div>

          <div style={rowStyle}>
            <Text style={labelStyle}>Phone Number:</Text>
            <Text>{phoneNumber}</Text>

            <Badge
              appearance={phoneStatus ? "filled" : "outline"}
              color={phoneStatus ? "success" : "warning"}
              icon={
                phoneStatus ? (
                  <CheckmarkCircle24Regular />
                ) : (
                  <Warning24Regular color="red" />
                )
              }
            >
              {phoneStatus ? "Verified" : "Not Verified"}
            </Badge>
            <Button
              disabled={phoneStatus}
              onClick={handlePhoneVerification}
              appearance="secondary"
            >
              Verify
            </Button>
          </div>
        </Stack>
      </Card>
      <div style={{ marginTop: 24 }}>
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
      </div>
    </div>
  );
};

export default VerifyUserPanel;
