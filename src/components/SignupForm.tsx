import { TextField, PrimaryButton, Stack, Link } from "@fluentui/react";
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

  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

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
      <p>
        The sign up proces requiresa your Id Number, phone number, email Address
        as they are the protected data subjects. More data can be mapped once
        one is logged in.{" "}
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
                <p style={{ color: "green", fontSize: 12 }}>{successMessage}</p>
              )}
            </div>
            <PrimaryButton type="submit" text="Sign Up" />
          </Stack>
        </form>
      </div>

      <div style={{ marginTop: "20px", alignSelf: "center" }}>
        <Button
          appearance="primary"
          icon={
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              style={{ width: 20, height: 20 }}
            />
          }
          onClick={() => {
            setIsSuccess(true);
            setSuccessMessage("Google sign up will be available soon");
            setTimeout(() => setIsSuccess(false), 3000);
          }}
        >
          Sign Up with Google
        </Button>
      </div>
    </>
  );
};

export default SignupForm;
