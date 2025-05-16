import { TextField, PrimaryButton, Stack, Link } from "@fluentui/react";
import { Button } from "@fluentui/react-components";
import React, { useState } from "react";

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
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle signup logic here
    // For example, you can send a POST request to your server
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
          confirmpassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Signup successful!", data);
        // Redirect or show success message
      } else {
        console.error("Signup failed!");
        // Handle error
      }
    } catch (error) {
      console.error("Error during signup:", error);
      // Handle error
    } finally {
      // Reset form fields
      setTimeout(() => {
        setIdNumber("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");
        setSuccessMessage("");
        setIsError(false);
        setIsSuccess(false);
        setErrorMessage("");
      }, 3000);
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
                <p style={{ color: "red", fontSize: 10 }}>{errorMessage}</p>
              )}
              {isSuccess && (
                <p style={{ color: "green", fontSize: 10 }}>{successMessage}</p>
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
          onClick={() => setSuccessMessage("Google will soon be here")}
        >
          Sign Up with Google
        </Button>
      </div>
    </>
  );
};

export default SignupForm;
