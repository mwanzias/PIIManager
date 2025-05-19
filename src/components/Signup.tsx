import React from "react";
import { Stack, Text } from "@fluentui/react";
import SignupForm from "./SignupForm";
import { containerStyles, headlineStyles } from "../styling/theme";

const Signup: React.FC = () => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="start"
      styles={{
        root: {
          minHeight: "100vh",
          padding: "40px 20px",
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Stack
        styles={containerStyles}
        horizontalAlign="center"
        tokens={{ childrenGap: 20 }}
        style={{ maxWidth: 600 }}
      >
        <Text styles={headlineStyles}>Create Your Account</Text>
        <SignupForm />
      </Stack>
    </Stack>
  );
};

export default Signup;
