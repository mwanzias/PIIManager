import React from "react";
import { motion } from "framer-motion";
interface AppFooterProps {
  message?: string;
  version?: string;
}

const AppFooter: React.FC<AppFooterProps> = ({
  message = "Welcome to the app!",
  version = "pseudo@2025",
}) => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: "75%",
        backgroundColor: "#f3f2f1",
        padding: "12px 20px",
        borderRadius: "10px",
        borderTop: "1px solid #ccc",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        zIndex: 999,
        textAlign: "center",
      }}
    >
      <span style={{ fontWeight: 500 }}>{message}</span>
      <span style={{ float: "right", fontWeight: 600 }}>{version}</span>
    </motion.footer>
  );
};

export default AppFooter;
