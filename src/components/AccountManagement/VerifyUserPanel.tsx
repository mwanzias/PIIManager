import React, { useEffect, useState } from "react";
import { Stack } from "@fluentui/react";
import {
  Button,
  Text,
  Badge,
  Tooltip,
  Card,
  CardHeader,
  // Stack,
} from "@fluentui/react-components";
import {
  CheckmarkCircle24Regular,
  Warning24Regular,
} from "@fluentui/react-icons";

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

        <Stack tokens={{ childrenGap: 16 }} style={{ padding: 24 }}>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
            <Text weight="semibold" style={{ width: 120 }}>
              Email:
            </Text>
            <Text>{emailAddress}</Text>
            <Tooltip
              content={
                emailStatus
                  ? "Email has been verified"
                  : "Email is not yet verified"
              }
              relationship={"label"}
            >
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
            </Tooltip>
            <Button
              disabled={emailStatus}
              onClick={() => onVerify("email")}
              appearance="primary"
            >
              Verify
            </Button>
          </Stack>

          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
            <Text weight="semibold" style={{ width: 120 }}>
              Phone Number:
            </Text>
            <Text>{phoneNumber}</Text>
            <Tooltip
              content={
                phoneStatus
                  ? "Phone number has been verified"
                  : "Phone number is not yet verified"
              }
              relationship={"label"}
            >
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
            </Tooltip>
            <Button
              disabled={phoneStatus}
              onClick={() => onVerify("phone")}
              appearance="primary"
            >
              Verify
            </Button>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
};

export default VerifyUserPanel;
