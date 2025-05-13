// File: src/components/DisplayStart.tsx
import React from "react";
import { LoginProps } from "../Interfaces/PseudoInterfaces";
import "../styling/general.css";

const ASkSignIn: React.FC<LoginProps> = ({ toggleForm }) => {
  return (
    <div className="signin-citation">
      <p>
        You have an account with pseudoMe {""} ,{" "}
        <button onClick={toggleForm} className="link-button">
          {" "}
          click here to sign in
        </button>
      </p>
    </div>
  );
};

export default ASkSignIn;
