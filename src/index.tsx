import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import App from "./App"; // Import the App component
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <FluentProvider theme={teamsLightTheme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </FluentProvider>
  </React.StrictMode>
);

reportWebVitals();
