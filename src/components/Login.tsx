import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, PrimaryButton, Stack } from "@fluentui/react";

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>(""); // Email or Phone
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", { identifier, password });
      localStorage.setItem("user", JSON.stringify(response.data)); // Save user data in local storage
      localStorage.setItem("isUserSignedIn", "true"); // Set user signed in status
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed!", error);
      localStorage.setItem("isUserSignedIn", "true");
      alert("Login failed. Please check your credentials.");
      navigate("/dashboard");
    }
  };

  return (
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
        <PrimaryButton type="submit" text="Login" />
      </Stack>
    </form>
  );
};

export default Login;
