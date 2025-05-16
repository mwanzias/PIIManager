import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, PrimaryButton, Stack, Separator } from "@fluentui/react";
import { Button } from "@fluentui/react-components";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>(""); // Email or Phone
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showOtpVerification, setShowOtpVerification] =
    useState<boolean>(false);
  const [otpEmail, setOtpEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [socialLoginType, setSocialLoginType] = useState<string>("");
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Handle OTP verification
  const handleOtpVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      // In a real app, you would verify the OTP with your backend
      // For now, we'll simulate a successful verification
      console.log(`Verifying OTP: ${otp} for email: ${otpEmail}`);

      // Mock user data based on social login
      const mockUser = {
        id: "user_" + Date.now(),
        idNumber: "", // Empty as this will be collected later
        email: otpEmail,
        phoneNumber: "", // Empty as this will be collected later
        socialLogin: socialLoginType, // Add social login type to user data
      };

      signIn(mockUser);
      navigate("/dashboard");
    } catch (error) {
      console.error("OTP verification failed!", error);
      setError("OTP verification failed. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/login", { identifier, password });
      // Use the AuthContext signIn function instead of directly setting localStorage
      signIn(response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed!", error);
      setError("Login failed. Please check your credentials.");

      // For development/demo purposes only - remove in production
      // This simulates a successful login with mock data
      const mockUser = {
        id: "user123",
        idNumber: "22186940",
        email: identifier.includes("@") ? identifier : "user@example.com",
        phoneNumber: identifier.includes("@") ? "254721803652" : identifier,
      };
      signIn(mockUser);
      navigate("/dashboard");
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

  return (
    <>
      {!showOtpVerification ? (
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
              {error && <div style={{ color: "red" }}>{error}</div>}
              <PrimaryButton type="submit" text="Login" />
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
              icon={
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  alt="Google"
                  style={{ width: 20, height: 20 }}
                />
              }
              onClick={() => handleSocialLogin("google")}
            >
              Google
            </Button>

            <Button
              appearance="primary"
              icon={
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                  alt="Microsoft"
                  style={{ width: 20, height: 20 }}
                />
              }
              onClick={() => handleSocialLogin("microsoft")}
            >
              Microsoft
            </Button>
          </Stack>
        </>
      ) : (
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
            {error && <div style={{ color: "red" }}>{error}</div>}
            <PrimaryButton type="submit" text="Verify" />
            <Button
              appearance="subtle"
              onClick={() => setShowOtpVerification(false)}
            >
              Back to Login
            </Button>
          </Stack>
        </form>
      )}
    </>
  );
};

export default Login;
