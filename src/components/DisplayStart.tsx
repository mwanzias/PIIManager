// File: src/components/DisplayStart.tsx
import React from "react";
import { LoginProps } from "../Interfaces/PseudoInterfaces";
import "../styling/general.css"; // Import the CSS file for styling

const DisplayStart: React.FC<LoginProps> = ({ toggleForm }) => {
  return (
    <div className="signin-citation">
      <p>
        To create an account,{" "}
        <button onClick={toggleForm} className="link-button">
          {" "}
          click here to sign up
        </button>
      </p>
    </div>
  );
};

export default DisplayStart;
