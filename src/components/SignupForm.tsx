import { TextField, PrimaryButton, Stack } from "@fluentui/react";
import React, { useState } from "react";

const SignupForm: React.FC = () => {
  const [idNumber, setIdNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup data:", { idNumber, email, phoneNumber, password });
  };

  return (
    <form onSubmit={handleSignup}>
      <Stack tokens={{ childrenGap: 20 }}>
        <TextField
          label="ID Number"
          value={idNumber}
          onChange={(e, newValue) => setIdNumber(newValue || "")}
          required
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e, newValue) => setEmail(newValue || "")}
          required
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
        <PrimaryButton type="submit" text="Sign Up" />
      </Stack>
    </form>
  );
};

export default SignupForm;
