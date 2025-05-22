import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, PrimaryButton, Stack, Separator } from "@fluentui/react";
import { Button, RadioGroup, Radio } from "@fluentui/react-components";
import { useAuth } from "../context/AuthContext";
import { GooglePayIcon, MicrosoftIcon } from "../svgIcons/paymentIcon";
import ProcessingSpinner from "./Marketing/Spinner";
import { colors, cardStyles } from "../styling/theme";
import { ShieldLockFilled } from "@fluentui/react-icons";
import API_CONFIG from "../config/api";

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>(""); // Email or Phone
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showOtpVerification, setShowOtpVerification] =
    useState<boolean>(false);
  const [showMfaVerification, setShowMfaVerification] =
    useState<boolean>(false);
  const [otpEmail, setOtpEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [mfaCode, setMfaCode] = useState<string>("");
  const [mfaMethod, setMfaMethod] = useState<"email" | "phone">("email");
  const [socialLoginType, setSocialLoginType] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // use to set email and phone verified states
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  const [tempUserData, setTempUserData] = useState<any>(null);

  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Navigate to dashboard without parameters in URL
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, isEmailVerified, isPhoneVerified]);

  // Handle OTP verification
  const handleOtpVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      // In a real app, you would verify the OTP with your backend
      // For now, we'll simulate a successful verification with a delay
      console.log(`Verifying OTP: ${otp} for email: ${otpEmail}`);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a mock user object for social login
      const mockUserData = {
        id: `social-${Date.now()}`,
        idNumber: "",
        email: otpEmail,
        phone_number: "",
        socialLogin: socialLoginType,
        isEmailVerified: true,
        isPhoneVerified: false,
        imageUrl: socialLoginType === "google" ? "/logo192.png" : undefined,
      };

      // Sign in the user
      signIn(mockUserData);

      // Navigate to dashboard without parameters in URL
      navigate("/dashboard");
    } catch (error) {
      console.error("OTP verification failed!", error);
      setError("OTP verification failed. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      const response = await axios.post(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`,
        {
          username: identifier, // Using identifier as username (email or phone)
          password,
        }
      );
      setIsEmailVerified(response.data.is_email_verified || false);
      setIsPhoneVerified(response.data.is_phone_verified || false);

      if (response.data) {
        // Add verification status to user data
        const userData = {
          ...response.data,
          isEmailVerified: response.data.is_email_verified || false,
          isPhoneVerified: response.data.is_phone_verified || false,
        };

        // Check if MFA is enabled for this user
        if (response.data.mfaRequired) {
          setTempUserData(userData);
          setShowMfaVerification(true);
        } else {
          // No MFA required, proceed with login
          signIn(userData);
          // Navigate to dashboard without parameters in URL
          navigate("/dashboard");
        }
      } else {
        throw new Error("Invalid response format");
      }

      setIsLoggingIn(false);
    } catch (error) {
      console.error("Login failed!", error);
      setError("Login failed. Please check your credentials.");
      setShowMfaVerification(false);
      setIsLoggingIn(true);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // In a real app, you would redirect to OAuth provider
    // For now, we'll simulate the OAuth flow by showing the OTP verification form
    setShowOtpVerification(true);
    setSocialLoginType(provider);

    // For demo purposes, we'll use a mock email
    const mockEmail =
      provider === "google" ? "user@gmail.com" : "user@outlook.com";
    setOtpEmail(mockEmail);

    // In a real app, this is where you would trigger the backend to send an OTP
    console.log(`Sending OTP to ${mockEmail} for ${provider} login`);
  };

  const handleMfaVerification = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    // In a real app, you would verify the MFA code with your backend
    // For now, we'll simulate a successful verification with a delay
    setTimeout(() => {
      setIsVerifying(false);
      // Use the AuthContext signIn function
      signIn(tempUserData);

      // Navigate to dashboard without parameters in URL
      navigate("/dashboard");
    }, 2000);
  };

  const handleSendMfaCode = () => {
    // In a real app, this would trigger sending an MFA code to the selected method
    console.log(`Sending MFA code to ${mfaMethod}: ${identifier}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          backgroundColor: colors.white,
        }}
      >
        {showMfaVerification ? (
          <form onSubmit={handleMfaVerification}>
            <Stack tokens={{ childrenGap: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <ShieldLockFilled
                  style={{
                    fontSize: "24px",
                    color: colors.primary,
                    marginRight: "8px",
                  }}
                />
                <h3 style={{ margin: 0 }}>Multi-Factor Authentication</h3>
              </div>

              <p>
                For added security, please verify your identity with a one-time
                code. Choose how you'd like to receive your verification code:
              </p>

              <RadioGroup
                value={mfaMethod}
                onChange={(e, data) =>
                  setMfaMethod(data.value as "email" | "phone")
                }
              >
                <Radio value="email" label="Email" />
                <Radio value="phone" label="SMS to Phone" />
              </RadioGroup>

              <Button
                appearance="subtle"
                onClick={handleSendMfaCode}
                style={{ alignSelf: "flex-start" }}
              >
                Send Code
              </Button>

              <TextField
                label="Verification Code"
                value={mfaCode}
                onChange={(e, newValue) => setMfaCode(newValue || "")}
                required
              />

              {error && <div style={{ color: colors.error }}>{error}</div>}

              <PrimaryButton
                type="submit"
                text={isVerifying ? "Verifying..." : "Verify"}
                disabled={isVerifying}
              />

              <ProcessingSpinner
                show={isVerifying}
                message="Verifying your code..."
              />
            </Stack>
          </form>
        ) : !showOtpVerification ? (
          <>
            <form onSubmit={handleLogin}>
              <Stack tokens={{ childrenGap: 20 }}>
                <TextField
                  label="Email or Phone Number"
                  value={identifier}
                  onChange={(e, newValue) => setIdentifier(newValue || "")}
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e, newValue) => setPassword(newValue || "")}
                  required
                />
                {error && <div style={{ color: colors.error }}>{error}</div>}
                <PrimaryButton
                  type="submit"
                  text={isLoggingIn ? "Logging in..." : "Login"}
                  disabled={isLoggingIn}
                />
                <ProcessingSpinner
                  show={isLoggingIn}
                  message="Verifying your credentials..."
                />
              </Stack>
            </form>

            <Separator styles={{ root: { margin: "20px 0" } }}>
              Or sign in with
            </Separator>

            <Stack
              horizontal
              tokens={{ childrenGap: 10 }}
              horizontalAlign="center"
              style={{ marginTop: 20 }}
            >
              <Button
                appearance="primary"
                icon={<GooglePayIcon />}
                onClick={() => handleSocialLogin("google")}
              >
                Google
              </Button>

              <Button
                appearance="primary"
                icon={<MicrosoftIcon />}
                onClick={() => handleSocialLogin("microsoft")}
              >
                Microsoft
              </Button>
            </Stack>
          </>
        ) : showOtpVerification ? (
          <form onSubmit={handleOtpVerification}>
            <Stack tokens={{ childrenGap: 20 }}>
              <h3>Email Verification</h3>
              <p>
                We've sent a verification code to {otpEmail}. Please enter the
                code below to verify your email.
              </p>
              <TextField
                label="Verification Code"
                value={otp}
                onChange={(e, newValue) => setOtp(newValue || "")}
                required
              />
              {error && <div style={{ color: colors.error }}>{error}</div>}
              <PrimaryButton
                type="submit"
                text={isVerifying ? "Verifying..." : "Verify"}
                disabled={isVerifying}
              />
              <ProcessingSpinner
                show={isVerifying}
                message="Verifying your code..."
              />
              <Button
                appearance="subtle"
                onClick={() => setShowOtpVerification(false)}
              >
                Back to Login
              </Button>
            </Stack>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default Login;
