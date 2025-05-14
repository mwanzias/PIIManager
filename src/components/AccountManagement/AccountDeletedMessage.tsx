import React, { useEffect, useState } from "react";
import {
  Text,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  Spinner,
} from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";

const AccountDeletedMessage: React.FC = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const randomDelay = Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000;
    const timer = setTimeout(() => setOpen(false), randomDelay); // 30 seconds
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) {
      navigate("/");
    }
  }, [open, navigate]);

  return (
    <Dialog open={open}>
      <DialogSurface>
        <DialogTitle
          style={{
            backgroundColor: "#0078d4",
            color: "white",
            padding: "12px 16px",
            borderRadius: "4px 4px 0 0",
          }}
        >
          Thank you for your patronage
        </DialogTitle>
        <DialogBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Text>
              Though your account is deleted, we look forward to future
              engagements.
            </Text>
            <Spinner label="We are clearing your records....." size="medium" />
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default AccountDeletedMessage;
