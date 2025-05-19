import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Text,
  Input,
  Button,
  makeStyles,
  tokens,
  shorthands,
  mergeClasses,
} from "@fluentui/react-components";
import { Info24Regular } from "@fluentui/react-icons";

interface VerificationCompleteProps {
  onDataCollection: (data: string, toVerify: string) => void;
  toVerify: string;
}

const useStyles = makeStyles({
  container: {
    animation: `${tokens.curveAccelerateMid} 0.3s`,
  },
  card: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  cardContent: {
    padding: tokens.spacingVerticalXXL,
  },
  infoBox: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding("16px"),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    marginBottom: tokens.spacingVerticalL,
  },
  infoIcon: {
    marginRight: tokens.spacingHorizontalS,
    color: tokens.colorBrandForeground1,
  },
  inputSection: {
    marginTop: tokens.spacingVerticalL,
  },
  buttonSection: {
    marginTop: tokens.spacingVerticalL,
    display: "flex",
    justifyContent: "flex-end",
  },
});

const VerifyDetails: React.FC<VerificationCompleteProps> = ({
  onDataCollection,
  toVerify,
}) => {
  const styles = useStyles();
  const [verificationCode, setVerificationCode] = useState("");

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          header={
            <Text size={500} weight="semibold">
              {toVerify === "email" ? "Email Verification" : "Phone Verification"}
            </Text>
          }
        />
        <div className={styles.cardContent}>
          <div className={styles.infoBox}>
            <Text>
              <Info24Regular className={styles.infoIcon} />
              {toVerify === "email" ? (
                <>
                  We have sent a verification email to your registered email
                  address. Please check your inbox and click on the verification
                  link to confirm your email address.
                  <br /><br />
                  If you do not receive the email within a few minutes, please check
                  your spam or junk folder. If you still do not see it, you can
                  request a new verification email.
                </>
              ) : (
                <>
                  We have sent a verification code to your registered phone number.
                  Please check your SMS and enter the code below to confirm your
                  phone number.
                  <br /><br />
                  If you do not receive the SMS within a few minutes, please check
                  your network connection. If you still do not see it, you can
                  request a new verification code.
                </>
              )}
            </Text>
          </div>

          <div className={styles.inputSection}>
            <Text weight="semibold" as="p" id="verification-code-label">
              Verification Code
            </Text>
            <Input
              id="verification-code"
              aria-labelledby="verification-code-label"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e, data) => setVerificationCode(data.value)}
              appearance="outline"
              size="medium"
              style={{ width: "100%", marginTop: tokens.spacingVerticalS }}
            />
          </div>

          <div className={styles.buttonSection}>
            <Button 
              appearance="primary"
              onClick={() => onDataCollection(verificationCode, toVerify)}
              disabled={!verificationCode.trim()}
            >
              Verify
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VerifyDetails;
