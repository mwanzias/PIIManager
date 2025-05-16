import {
  TextField,
  PrimaryButton,
  Stack,
  Link,
  Separator,
} from "@fluentui/react";
import { Button } from "@fluentui/react-components";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignupForm: React.FC = () => {
  const [idNumber, setIdNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirmPassword] = useState<string>("");

  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
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

  // Handle social signup
  const handleSocialSignup = (provider: string) => {
    // In a real app, you would redirect to OAuth provider
    // For now, we'll simulate the OAuth flow by showing the OTP verification form
    setShowOtpVerification(true);
    setSocialLoginType(provider);

    // For demo purposes, we'll use a mock email
    const mockEmail =
      provider === "google" ? "user@gmail.com" : "user@outlook.com";
    setOtpEmail(mockEmail);

    // In a real app, this is where you would trigger the backend to send an OTP
    console.log(`Sending OTP to ${mockEmail} for ${provider} signup`);
  };

  // Handle OTP verification
  const handleOtpVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsError(false);

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

      setIsSuccess(true);
      setSuccessMessage("Signup successful! Redirecting to dashboard...");

      signIn(mockUser);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("OTP verification failed!", error);
      setIsError(true);
      setErrorMessage("OTP verification failed. Please try again.");
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsError(false);
    setIsSuccess(false);

    try {
      if (password !== confirmpassword) {
        setIsError(true);
        setErrorMessage("Passwords do not match");
        return;
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idNumber,
          email,
          phoneNumber,
          password,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        setIsSuccess(true);
        setSuccessMessage("Signup successful! Redirecting to dashboard...");

        // Use AuthContext to sign in the user
        signIn({
          id: userData.id || "user_" + Date.now(),
          idNumber,
          email,
          phoneNumber,
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        console.error("Signup failed!");
        setIsError(true);
        setErrorMessage("Signup failed. Please try again.");

        // For development/demo purposes only - remove in production
        // This simulates a successful signup with mock data
        setIsSuccess(true);
        setSuccessMessage("Signup successful! Redirecting to dashboard...");

        signIn({
          id: "user_" + Date.now(),
          idNumber,
          email,
          phoneNumber,
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setIsError(true);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      {!showOtpVerification ? (
        <>
          <p>
            The sign up proces requiresa your Id Number, phone number, email
            Address as they are the protected data subjects. More data can be
            mapped once one is logged in.{" "}
            <Link
              href="https://www.youtube.com/watch?v=iP0TusLTw40&list=RDiP0TusLTw40&start_radio=1"
              target="_blank"
            >
              {" "}
              Introductory video{" "}
            </Link>
          </p>
          <div>
            <form onSubmit={handleSignup}>
              <Stack tokens={{ childrenGap: 20 }}>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e, newValue) => setEmail(newValue || "")}
                  required
                />
                <TextField
                  label="ID Number"
                  value={idNumber}
                  onChange={(e, newValue) => setIdNumber(newValue || "")}
                />
                <TextField
                  label="Phone Number"
                  value={phoneNumber}
                  onChange={(e, newValue) => setPhoneNumber(newValue || "")}
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e, newValue) => setPassword(newValue || "")}
                  required
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmpassword}
                  onChange={(e, newValue) => setConfirmPassword(newValue || "")}
                  required
                />
                <div style={{ alignContent: "center", width: "100%" }}>
                  {isError && (
                    <p style={{ color: "red", fontSize: 12 }}>{errorMessage}</p>
                  )}
                  {isSuccess && (
                    <p style={{ color: "green", fontSize: 12 }}>
                      {successMessage}
                    </p>
                  )}
                </div>
                <PrimaryButton type="submit" text="Sign Up" />
              </Stack>
            </form>
          </div>

          <Separator styles={{ root: { margin: "20px 0" } }}>
            Or sign up with
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
              onClick={() => handleSocialSignup("google")}
            >
              Sign Up with Google
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
              onClick={() => handleSocialSignup("microsoft")}
            >
              Sign Up with Microsoft
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
            {isError && (
              <p style={{ color: "red", fontSize: 12 }}>{errorMessage}</p>
            )}
            {isSuccess && (
              <p style={{ color: "green", fontSize: 12 }}>{successMessage}</p>
            )}
            <PrimaryButton type="submit" text="Verify" />
            <Button
              appearance="subtle"
              onClick={() => setShowOtpVerification(false)}
            >
              Back to Sign Up
            </Button>
          </Stack>
        </form>
      )}
    </>
  );
};

export default SignupForm;
