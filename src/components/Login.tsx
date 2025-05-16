import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, PrimaryButton, Stack } from "@fluentui/react";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>(""); // Email or Phone
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

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
        {error && <div style={{ color: "red" }}>{error}</div>}
        <PrimaryButton type="submit" text="Login" />
      </Stack>
    </form>
  );
};

export default Login;
