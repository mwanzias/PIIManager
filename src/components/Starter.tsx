import React, { useState } from "react";
import "./../styling/SignupStyles.css"; // Import external CSS file for styles
import DisplayStart from "./DisplayStart";
import Login from "./Login";
import { Stack } from "@fluentui/react";
import SignupForm from "./SignupForm";
import ASkSignIn from "./AskSignIn";
import ImageCarousel from "./DataAccess/ImageCorousel";

const Starter: React.FC = () => {
  // This component serves as a starter page for the signup process
  const [isSignup, setIsSignup] = useState<boolean>(false);

  const toggleForm = () => {
    setIsSignup(!isSignup); // Toggle between Login and Signup
  };

  return (
    <div className="signup-container">
      <ImageCarousel />
      <div className="right-side">
        <Stack tokens={{ childrenGap: 20 }}>
          {isSignup ? <SignupForm /> : <Login />}
          {isSignup && <ASkSignIn toggleForm={toggleForm} />}
          {!isSignup && <DisplayStart toggleForm={toggleForm} />}
        </Stack>
      </div>
    </div>
  );
};

export default Starter;
