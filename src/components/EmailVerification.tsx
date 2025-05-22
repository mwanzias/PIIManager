import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  Text,
  Button,
  makeStyles,
  tokens,
  shorthands,
  Spinner,
  Input,
  Divider,
} from "@fluentui/react-components";
import {
  CheckmarkCircle24Regular,
  DismissCircle24Regular,
  Key24Regular,
} from "@fluentui/react-icons";
import API_CONFIG from "../config/api";

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: tokens.spacingVerticalXXL,
    backgroundColor: "#f5f5f5",
  },
  card: {
    maxWidth: "600px",
    width: "100%",
  },
  cardContent: {
    padding: tokens.spacingVerticalXXL,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: tokens.spacingVerticalL,
  },
  icon: {
    fontSize: "48px",
    marginBottom: tokens.spacingVerticalM,
  },
  successIcon: {
    color: tokens.colorPaletteGreenForeground1,
  },
  errorIcon: {
    color: tokens.colorPaletteRedForeground1,
  },
  message: {
    textAlign: "center",
    marginBottom: tokens.spacingVerticalL,
  },
  buttonContainer: {
    marginTop: tokens.spacingVerticalL,
  },
});

const EmailVerification: React.FC = () => {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error" | "otp_input"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");
        const emailParam = queryParams.get("email");

        if (emailParam) {
          setEmail(emailParam);
        }

        if (!token) {
          // If no token is provided, show OTP input form
          if (emailParam) {
            setVerificationStatus("otp_input");
          } else {
            setVerificationStatus("error");
            setErrorMessage("Verification token is missing.");
          }
          return;
        }

        // Send verification request to backend
        const response = await fetch(
          `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.emailverify}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: emailParam || "", // The backend will extract the email from the token if not provided
              token: token,
            }),
          }
        );

        if (response.ok) {
          setVerificationStatus("success");
        } else {
          const errorData = await response.json();
          setVerificationStatus("error");
          setErrorMessage(errorData.detail || "Email verification failed.");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setVerificationStatus("error");
        setErrorMessage("An error occurred during email verification.");
      }
    };

    verifyEmail();
  }, [location.search]);

  const handleVerifyWithOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.emailverify}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: otp,
          }),
        }
      );

      if (response.ok) {
        setVerificationStatus("success");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || "OTP verification failed.");
      }
    } catch (error) {
      console.error("Error verifying with OTP:", error);
      setErrorMessage("An error occurred during OTP verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSwitchToOtp = () => {
    setVerificationStatus("otp_input");
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const handleNavigateToHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          header={
            <Text size={600} weight="semibold">
              Email Verification
            </Text>
          }
        />
        <div className={styles.cardContent}>
          {verificationStatus === "loading" && (
            <>
              <Spinner size="large" label="Verifying your email..." />
              <Text className={styles.message}>
                Please wait while we verify your email address...
              </Text>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <CheckmarkCircle24Regular
                className={`${styles.icon} ${styles.successIcon}`}
              />
              <Text size={500} weight="semibold">
                Email Verified Successfully!
              </Text>
              <Text className={styles.message}>
                Your email has been successfully verified. You can now log in to
                your account.
              </Text>
              <div className={styles.buttonContainer}>
                <Button appearance="primary" onClick={handleNavigateToLogin}>
                  Go to Login
                </Button>
              </div>
            </>
          )}

          {verificationStatus === "error" && (
            <>
              <DismissCircle24Regular
                className={`${styles.icon} ${styles.errorIcon}`}
              />
              <Text size={500} weight="semibold">
                Verification Failed
              </Text>
              <Text className={styles.message}>
                {errorMessage ||
                  "We couldn't verify your email. The verification link may be expired or invalid."}
              </Text>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <Button appearance="primary" onClick={handleNavigateToHome}>
                  Go to Home
                </Button>
                <Button appearance="subtle" onClick={handleSwitchToOtp}>
                  Verify with OTP Instead
                </Button>
              </div>
            </>
          )}

          {verificationStatus === "otp_input" && (
            <>
              <Key24Regular
                style={{
                  fontSize: "32px",
                  color: tokens.colorBrandForeground1,
                }}
              />
              <Text size={500} weight="semibold">
                Verify with OTP
              </Text>
              <Text className={styles.message}>
                Enter the verification code that was sent to your email.
              </Text>

              <form onSubmit={handleVerifyWithOtp} style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    width: "100%",
                  }}
                >
                  <div>
                    <Text weight="semibold" as="span" id="email-label">
                      Email Address
                    </Text>
                    <Input
                      id="email-input"
                      value={email}
                      onChange={(e, data) => setEmail(data.value)}
                      placeholder="Enter your email address"
                      required
                      style={{ width: "100%", marginTop: "4px" }}
                    />
                  </div>

                  <div>
                    <Text weight="semibold" as="span" id="otp-label">
                      Verification Code
                    </Text>
                    <Input
                      id="otp-input"
                      value={otp}
                      onChange={(e, data) => setOtp(data.value)}
                      placeholder="Enter verification code"
                      required
                      style={{ width: "100%", marginTop: "4px" }}
                    />
                  </div>

                  {errorMessage && (
                    <Text style={{ color: tokens.colorPaletteRedForeground1 }}>
                      {errorMessage}
                    </Text>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "16px",
                    }}
                  >
                    <Button
                      appearance="secondary"
                      onClick={handleNavigateToHome}
                    >
                      Cancel
                    </Button>
                    <Button
                      appearance="primary"
                      type="submit"
                      disabled={isVerifying || !email || !otp}
                    >
                      {isVerifying ? <Spinner size="tiny" /> : "Verify"}
                    </Button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EmailVerification;
