import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  IStackTokens,
} from "@fluentui/react";
import "../styling/general.css";
import {
  containerStyles,
  sectionStyles,
  heroSectionStyles,
  headlineStyles,
  subheadlineStyles,
  sectionTitleStyles,
  cardStyles,
  bannerStyles,
  footerStyles,
  primaryButtonStyles,
  outlineButtonStyles,
  bodyTextStyles,
  emphasisTextStyles,
  colors,
  listItemStyles,
} from "../styling/theme";

// Step container styles (specific to this component)
const stepContainerStyles = {
  root: {
    backgroundColor: colors.white,
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    flex: 1,
    minWidth: "250px",
  },
};

// Step number styles (specific to this component)
const stepNumberStyles = {
  root: {
    fontSize: "24px",
    fontWeight: "700",
    backgroundColor: colors.primary,
    color: colors.white,
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "16px",
  },
};

const comparisonCardStyles = {
  root: {
    backgroundColor: colors.white,
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    flex: 1,
    minWidth: "300px",
  },
};

const privacyBannerStyles = {
  root: {
    backgroundColor: colors.primaryLight,
    padding: "32px",
    borderRadius: "8px",
    marginTop: "40px",
    marginBottom: "40px",
    border: `1px solid ${colors.primary}`,
  },
};

const footerCTAStyles = {
  root: {
    backgroundColor: colors.gray20,
    padding: "60px 0",
    textAlign: "center",
    width: "100%",
  },
};

const stackTokens: IStackTokens = {
  childrenGap: 20,
};

const horizontalStackTokens: IStackTokens = {
  childrenGap: 24,
};

const StarterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleLearnMore = () => {
    // This could navigate to a more detailed page about the system
    // For now, we'll just scroll to the narrative section
    const narrativeSection = document.getElementById("narrative-section");
    if (narrativeSection) {
      narrativeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Stack verticalFill>
      {/* Hero Section */}
      <Stack styles={heroSectionStyles} horizontalAlign="center">
        <Stack styles={containerStyles} horizontalAlign="center">
          <Text styles={headlineStyles}>
            Your Identity, Simplified and Secured
          </Text>
          <Text styles={subheadlineStyles}>
            Stop giving out your phone number, email, or ID everywhere. Use your
            unique pseudo-number to prove your identity — safely and privately.
          </Text>
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <PrimaryButton
              text="Get Started"
              onClick={handleGetStarted}
              styles={primaryButtonStyles}
            />
            <DefaultButton
              text="Sign In"
              onClick={() => navigate("/login")}
              styles={outlineButtonStyles}
            />
          </Stack>
        </Stack>
      </Stack>

      {/* How It Works Section */}
      <Stack styles={sectionStyles} horizontalAlign="center">
        <Stack styles={containerStyles}>
          <Text styles={sectionTitleStyles}>How It Works</Text>
          <Stack
            horizontal
            wrap
            tokens={horizontalStackTokens}
            horizontalAlign="center"
          >
            <Stack styles={stepContainerStyles} horizontalAlign="center">
              <Stack horizontalAlign="center">
                <Text styles={stepNumberStyles}>1</Text>
              </Stack>
              <Text
                variant="large"
                styles={{ root: { fontWeight: "600", marginBottom: "8px" } }}
              >
                Register Once
              </Text>
              <Text>
                Provide your email, phone number, and ID just once. Your
                information is securely stored and encrypted.
              </Text>
            </Stack>
            <Stack styles={stepContainerStyles} horizontalAlign="center">
              <Stack horizontalAlign="center">
                <Text styles={stepNumberStyles}>2</Text>
              </Stack>
              <Text
                variant="large"
                styles={{ root: { fontWeight: "600", marginBottom: "8px" } }}
              >
                Get Your Pseudo-Number
              </Text>
              <Text>
                We generate a unique, reusable pseudo-number that acts as your
                identity token.
              </Text>
            </Stack>
            <Stack styles={stepContainerStyles} horizontalAlign="center">
              <Stack horizontalAlign="center">
                <Text styles={stepNumberStyles}>3</Text>
              </Stack>
              <Text
                variant="large"
                styles={{ root: { fontWeight: "600", marginBottom: "8px" } }}
              >
                Use It Anywhere
              </Text>
              <Text>
                Present your pseudo-number to any participating business (e.g.,
                parking), receive a one-time OTP, and get verified — without
                exposing your real data.
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* Problem vs. Solution Section */}
      <Stack
        styles={sectionStyles}
        horizontalAlign="center"
        className="alt-background"
      >
        <Stack styles={containerStyles}>
          <Text styles={sectionTitleStyles}>
            Protect Your Privacy. Save Time.
          </Text>
          <Stack
            horizontal
            wrap
            tokens={horizontalStackTokens}
            horizontalAlign="center"
          >
            <Stack styles={comparisonCardStyles}>
              <Text
                variant="large"
                styles={{
                  root: {
                    fontWeight: "600",
                    marginBottom: "16px",
                    color: colors.error,
                  },
                }}
              >
                Problem
              </Text>
              <ul style={{ paddingLeft: "20px", margin: "0" }}>
                <li style={listItemStyles}>
                  Constantly repeating your ID, email, or phone
                </li>
                <li style={listItemStyles}>
                  Risk of personal data being misused
                </li>
                <li style={listItemStyles}>Repetitive verification steps</li>
              </ul>
            </Stack>
            <Stack styles={comparisonCardStyles}>
              <Text
                variant="large"
                styles={{
                  root: {
                    fontWeight: "600",
                    marginBottom: "16px",
                    color: colors.secondary,
                  },
                }}
              >
                Our Solution
              </Text>
              <ul style={{ paddingLeft: "20px", margin: "0" }}>
                <li style={listItemStyles}>Use your pseudo-number instead</li>
                <li style={listItemStyles}>
                  Data is encrypted and access is controlled
                </li>
                <li style={listItemStyles}>
                  One-time OTP makes verification quick & easy
                </li>
              </ul>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* Narrative/Story Section */}
      <Stack
        id="narrative-section"
        styles={sectionStyles}
        horizontalAlign="center"
      >
        <Stack styles={containerStyles} tokens={{ childrenGap: 16 }}>
          <Text styles={sectionTitleStyles}>Your Identity. Reimagined.</Text>
          <Text style={bodyTextStyles}>
            In today's digital world, you're constantly asked to share personal
            information — from your phone number at a parking lot to your ID
            number at a front desk. Every time you do, your data is at risk of
            being misused or exposed.
          </Text>
          <Text style={bodyTextStyles}>This app solves that problem.</Text>
          <Text style={bodyTextStyles}>
            We help you register once with your phone number, email, and
            national ID. In return, you get a secure, unique pseudo-number.
          </Text>
          <Text style={bodyTextStyles}>
            Instead of giving out your actual data again, you simply provide
            this pseudo-number. When verification is needed, we send you a
            one-time OTP, confirm it's you, and you're done. Fast, private, and
            secure.
          </Text>
          <Text style={bodyTextStyles}>
            No more repeating personal info. No more privacy leaks. You decide
            which organizations can access your information, and you can revoke
            that access at any time.
          </Text>
          <Text style={emphasisTextStyles}>You're in control.</Text>

          {/* Privacy Guarantee Banner */}
          <Stack styles={privacyBannerStyles} horizontalAlign="center">
            <Text
              variant="large"
              styles={{
                root: {
                  fontWeight: "600",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <span style={{ marginRight: "8px", fontSize: "24px" }}>🔒</span>{" "}
              We Never Share Your Real Data.
            </Text>
            <ul style={{ paddingLeft: "20px", margin: "0", maxWidth: "600px" }}>
              <li style={listItemStyles}>Data is encrypted</li>
              <li style={listItemStyles}>
                Pseudo-number maps only to your secure record
              </li>
              <li style={listItemStyles}>
                You control access to your information at all times
              </li>
            </ul>
          </Stack>
        </Stack>
      </Stack>

      {/* Footer CTA */}
      <Stack styles={footerCTAStyles} horizontalAlign="center">
        <Stack
          styles={containerStyles}
          horizontalAlign="center"
          tokens={{ childrenGap: 24 }}
        >
          <Text
            variant="xLarge"
            styles={{ root: { fontWeight: "600", marginBottom: "16px" } }}
          >
            Ready to take control of your digital identity?
          </Text>
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <PrimaryButton
              text="Sign Up Now"
              onClick={handleGetStarted}
              styles={primaryButtonStyles}
            />
            <DefaultButton
              text="Learn More"
              onClick={handleLearnMore}
              styles={outlineButtonStyles}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default StarterPage;
