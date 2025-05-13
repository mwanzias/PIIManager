import React from "react";
import { Button, Card, CardHeader, Text } from "@fluentui/react-components";

interface VerificationStatus {
  email: { value: string; verified: boolean };
  phone: { value: string; verified: boolean };
  idNumber: { value: string; verified: boolean };
}

interface VerifyUserPanelProps {
  onVerify: (type: "email" | "phone" | "idNumber") => void;
  onProceed: () => void;
  userStatus: VerificationStatus;
}

const VerifyUserPanel: React.FC<VerifyUserPanelProps> = ({
  onVerify,
  onProceed,
  userStatus,
}) => {
  const allVerified =
    userStatus.email.verified &&
    userStatus.phone.verified &&
    userStatus.idNumber.verified;

  const [emailVerified, setEmailVerified] = React.useState(false);
  const [phoneVerified, setPhoneVerified] = React.useState(false);
  const [idNumberVerified, setIdNumberVerified] = React.useState(false);

  const renderCard = (label: string, field: keyof VerificationStatus) => {
    const { value, verified } = userStatus[field];
    return (
      <Card style={{ marginBottom: 16, width: "100%" }}>
        <CardHeader
          header={
            <Text>
              {label}: {value}
            </Text>
          }
          description={`Verified: ${verified ? "Yes" : "No"}`}
        />
        {!verified && (
          <div style={{ marginTop: 8 }}>
            <Button appearance="primary" onClick={() => onVerify(field)}>
              Verify {label}
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Verify Your Details</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {renderCard("Email", "email")}
        {renderCard("Phone Number", "phone")}
        {renderCard("ID Number", "idNumber")}
      </div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}
      >
        <Button
          onClick={onProceed}
          appearance="primary"
          disabled={!allVerified}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default VerifyUserPanel;
