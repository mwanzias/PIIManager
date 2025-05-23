import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import App from "./App"; // Import the App component
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./utils/msalUtils";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <FluentProvider theme={teamsLightTheme}>
      <MsalProvider instance={msalInstance}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MsalProvider>
    </FluentProvider>
  </React.StrictMode>
);

reportWebVitals();
