import React from "react";
import { Spinner } from "@fluentui/react-components";
import { Clock24Regular } from "@fluentui/react-icons";

interface ProcessingSpinnerProps {
  show: boolean;
  message?: string;
}

const ProcessingSpinner: React.FC<ProcessingSpinnerProps> = ({
  show,
  message,
}) => {
  if (!show) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
      <Spinner size="medium" />
      <Clock24Regular style={{ marginLeft: 10, fontSize: 24 }} />
      <span style={{ marginLeft: 10 }}>{message || "Processing…"}</span>
    </div>
  );
};

export default ProcessingSpinner;
