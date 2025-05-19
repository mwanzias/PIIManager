import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Text,
  Button,
  makeStyles,
  tokens,
  shorthands,
  RadioGroup,
  Radio,
} from "@fluentui/react-components";
import { Info24Regular, ShieldLockFilled } from "@fluentui/react-icons";
import { colors } from "../../styling/theme";

interface MFASetupProps {
  emailAddress: string;
  phoneNumber: string;
  onComplete: (preferredMethod: "email" | "phone") => void;
}

const useStyles = makeStyles({
  container: {
    animation: `${tokens.curveAccelerateMid} 0.3s`,
    marginTop: tokens.spacingVerticalXXL,
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
  optionsSection: {
    marginTop: tokens.spacingVerticalL,
  },
  buttonSection: {
    marginTop: tokens.spacingVerticalL,
    display: "flex",
    justifyContent: "flex-end",
  },
  mfaIcon: {
    fontSize: "32px",
    color: colors.primary,
    marginRight: tokens.spacingHorizontalS,
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
  },
});

const MFASetup: React.FC<MFASetupProps> = ({
  emailAddress,
  phoneNumber,
  onComplete,
}) => {
  const styles = useStyles();
  const [preferredMethod, setPreferredMethod] = useState<"email" | "phone">(
    "email"
  );

  const handleSubmit = () => {
    onComplete(preferredMethod);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          header={
            <div className={styles.headerContainer}>
              <ShieldLockFilled className={styles.mfaIcon} />
              <Text size={500} weight="semibold">
                Multi-Factor Authentication Setup
              </Text>
            </div>
          }
        />
        <div className={styles.cardContent}>
          <div className={styles.infoBox}>
            <Text>
              <Info24Regular className={styles.infoIcon} />
              <Text
                weight="semibold"
                as="span"
                style={{ color: tokens.colorBrandForeground1 }}
              >
                Enhance Your Account Security
              </Text>
              <br />
              <br />
              Multi-Factor Authentication (MFA) adds an extra layer of security
              to your account. Each time you sign in, we'll send a verification
              code to your preferred method.
              <br />
              <br />
              Please choose how you would like to receive your verification
              codes:
            </Text>
          </div>

          <div className={styles.optionsSection}>
            <RadioGroup
              value={preferredMethod}
              onChange={(e, data) =>
                setPreferredMethod(data.value as "email" | "phone")
              }
            >
              <Radio value="email" label={`Email (${emailAddress})`} />
              <Radio value="phone" label={`SMS to Phone (${phoneNumber})`} />
            </RadioGroup>
          </div>

          <div className={styles.buttonSection}>
            <Button appearance="primary" onClick={handleSubmit}>
              Save Preference
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MFASetup;
