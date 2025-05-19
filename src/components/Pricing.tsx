import React from "react";
import {
  Stack,
  Text,
  PrimaryButton,
  IStackTokens,
} from "@fluentui/react";
import "../styling/general.css";
import {
  containerStyles,
  sectionStyles,
  sectionTitleStyles,
  primaryButtonStyles,
  colors,
} from "../styling/theme";

const pricingCardStyles = {
  root: {
    backgroundColor: colors.white,
    padding: "32px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    flex: 1,
    minWidth: "300px",
    maxWidth: "400px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
  },
};

const priceStyles = {
  root: {
    fontSize: "48px",
    fontWeight: "700",
    color: colors.primary,
    marginBottom: "8px",
  },
};

const savingsBadgeStyles = {
  root: {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    padding: "4px 12px",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: "600",
    display: "inline-block",
    marginBottom: "16px",
  },
};

const buttonContainerStyles = {
  root: {
    marginTop: "auto",
    paddingTop: "24px",
  },
};

const stackTokens: IStackTokens = {
  childrenGap: 20,
};

const Pricing: React.FC = () => {
  return (
    <Stack styles={sectionStyles} horizontalAlign="center">
      <Stack styles={containerStyles} horizontalAlign="center">
        <Text styles={sectionTitleStyles}>Simple, Transparent Pricing</Text>
        <Stack horizontal tokens={stackTokens} horizontalAlign="center">
          <Stack styles={pricingCardStyles}>
            <Text variant="xLarge" styles={{ root: { fontWeight: "600", marginBottom: "16px" } }}>
              Monthly Plan
            </Text>
            <Text styles={priceStyles}>$1</Text>
            <Text styles={{ root: { marginBottom: "24px" } }}>per month</Text>
            <Stack styles={buttonContainerStyles}>
              <PrimaryButton
                text="Get Started"
                styles={primaryButtonStyles}
              />
            </Stack>
          </Stack>
          
          <Stack styles={pricingCardStyles}>
            <Text variant="xLarge" styles={{ root: { fontWeight: "600", marginBottom: "16px" } }}>
              Yearly Plan
            </Text>
            <Text styles={priceStyles}>$10</Text>
            <Text styles={{ root: { marginBottom: "8px" } }}>per year</Text>
            <Text styles={savingsBadgeStyles}>Save $2</Text>
            <Stack styles={buttonContainerStyles}>
              <PrimaryButton
                text="Get Started"
                styles={primaryButtonStyles}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Pricing; 