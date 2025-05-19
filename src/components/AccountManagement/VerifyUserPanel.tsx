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
  onVerify: (type: "email" | "phone") => void;
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

  useEffect(() => {
    const interval = setInterval(() => {
      setEmailStatus(emailVerified);
      setPhoneStatus(phoneVerified);
    }, 3000);
    return () => clearInterval(interval);
  }, [emailVerified, phoneVerified]);

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
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          header={
            <Text size={600} weight="semibold">
              Verification Summary
            </Text>
          }
        />

        <div className={styles.cardContent} style={{ display: "flex", flexDirection: "column", gap: tokens.spacingVerticalL }}>
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
      </div>
    </div>
  );
};

export default VerifyUserPanel;
