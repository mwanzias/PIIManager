import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PrimaryButton,
  Stack,
  IconButton,
  IContextualMenuProps,
  ContextualMenu,
} from "@fluentui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft24Filled,
  ChevronRight24Filled,
  List24Filled,
  SignOut24Filled,
} from "@fluentui/react-icons";
import { colors } from "../styling/theme";
import DeleteAccount from "./AccountManagement/DeleteAccount";
import SuspentAccount from "./AccountManagement/SuspendAccount";
import CompaniesUnassigned from "./DataAccess/CompaniesUnassigned";
import AllowedCompanies from "./DataAccess/AllowedCompanies";
import InviteAFriend from "./Marketing/InviteFriend";
import UpdateProfilePicture from "./AccountManagement/UpdateProfilePicture";
import TermsAndConditions from "./legal/TermsAndConditions";
import BusinessAllowanceTable from "./BusinessAllowanceTable";
import VerifyUserPanel from "./AccountManagement/VerifyUserPanel";
import SocialLoginUserInfo from "./AccountManagement/SocialLoginUserInfo";
import { accountManagementProps } from "../Interfaces/PseudoInterfaces";
import BillingManager from "./AccountManagement/BillingManager";
import AppFooter from "../appFooter";
import { useAuth } from "../context/AuthContext";

interface Company {
  id: string;
  name: string;
}

// Styling helpers
const buttonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: "10px",
  background: "none",
  border: "none",
  cursor: "pointer",
  borderRadius: "4px",
  transition: "background-color 0.2s ease",
};

const submenuStyle: React.CSSProperties = {
  paddingLeft: 20,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const activeColor = colors.primary;
const headerBgColor = colors.primary;
const sidebarBgColor = colors.gray20;
const footerBgColor = colors.gray20;

const Dashboard: React.FC = () => {
  const { user, signOut, isAuthenticated, updateUser } = useAuth();
  const [allowedCompanies, setAllowedCompanies] = useState<Company[]>([]);
  const [menuProps, setMenuProps] = useState<IContextualMenuProps | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [showDataAccess, setShowDataAccess] = useState(false);
  const [showAccountMgmt, setShowAccountMgmt] = useState(false);
  const [profileMenuProps, setProfileMenuProps] =
    useState<IContextualMenuProps | null>(null);
  const [userVerified, setUserVerified] = useState(false);

  // Initialize verification status
  const [phoneVerified, setPhoneVerified] = useState<boolean>(
    user?.isPhoneVerified === true
  );
  const [emailVerified, setEmailVerified] = useState<boolean>(
    user?.isEmailVerified === true
  );

  const [needsSocialLoginInfo, setNeedsSocialLoginInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const userDetails: accountManagementProps = {
    idnumber: user?.idNumber || "",
    emailAddress: user?.email || "",
    phoneNumber: parseInt(user?.phone_number || "0"),
  };

  console.log("These are the user details from AUTH", user);
  const navigate = useNavigate();

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onProfileClick = (ev: React.MouseEvent<HTMLElement>) => {
    setProfileMenuProps({
      items: [
        { key: "signout", text: "Sign Out", onClick: () => handleSignOut() },
        {
          key: "updatePicture",
          text: "Update Profile Picture",
          onClick: () => setActiveView("update-profile-picture"),
        },
        {
          key: "viewAllowed",
          text: "View Allowed Companies",
          onClick: () => setActiveView("allowed-companies"),
        },
        {
          key: "terms",
          text: "Terms and Conditions",
          onClick: () => setActiveView("terms-and-conditions"),
        },
      ],
      target: ev.currentTarget,
    });
  };

  useEffect(() => {
    const fetchAllowedCompanies = async () => {
      try {
        // In a real app, you would use the user's ID to fetch their allowed companies
        const response = await axios.get("/api/allowed-companies");
        setAllowedCompanies(response.data || []);
      } catch (error) {
        console.error("Error fetching allowed companies:", error);
        // For demo purposes, set some mock data
        setAllowedCompanies([
          { id: "1", name: "Company A" },
          { id: "2", name: "Company B" },
        ]);
      }
    };

    if (isAuthenticated && user) {
      fetchAllowedCompanies();
    }
  }, [isAuthenticated, user]);

  const handleDeleteAccount = async () => {
    if (user) {
      try {
        await axios.delete(`/api/delete-account/${user.id}`);
        signOut();
        alert("Account deleted successfully");
        navigate("/");
      } catch (error) {
        console.error("Error deleting account:", error);
        // For demo purposes, still sign out
        signOut();
        navigate("/");
      }
    }
  };

  const handleSignOut = async () => {
    // If user is logged in with Microsoft, also log out from Microsoft
    if (user?.socialLogin === "microsoft") {
      try {
        // Import the handleMsalLogout function
        const { handleMsalLogout } = await import("../utils/msalUtils");
        // Log out from Microsoft
        await handleMsalLogout();
      } catch (error) {
        console.error("Error logging out from Microsoft:", error);
      }
    }

    // Sign out from the app
    signOut();
    navigate("/");
  };

  const toggleMenu = (ev: React.MouseEvent<HTMLElement>) => {
    setMenuProps({
      items: [
        {
          key: "changePassword",
          text: "Change Password",
          onClick: () => alert("Change Password clicked"),
        },
        {
          key: "verifyEmail",
          text: "Verify Email",
          onClick: () => alert("Verify Email clicked"),
        },
        {
          key: "verifyPhone",
          text: "Verify Phone",
          onClick: () => alert("Verify Phone clicked"),
        },
        {
          key: "uploadIdPhoto",
          text: "Upload ID Photo",
          onClick: () => alert("Upload ID Photo clicked"),
        },
        { key: "signOut", text: "Sign Out", onClick: handleSignOut },
      ],
      target: ev.currentTarget,
    });
  };

  useEffect(() => {
    setEmailVerified(emailVerified);
    setPhoneVerified(phoneVerified);
    if (phoneVerified === true && emailVerified === true) {
      setUserVerified(true);
      setActiveView("allowed-companies");
    }
    console.log("User verified in use effect:", userVerified);
  }, [emailVerified, phoneVerified, userVerified]);

  // Check if user signed in via social login and needs to provide additional info
  useEffect(() => {
    if (user?.socialLogin && (!user.idNumber || !user.phone_number)) {
      setNeedsSocialLoginInfo(true);
    } else {
      setNeedsSocialLoginInfo(false);
    }
  }, [user]);

  const handleSocialLoginInfoComplete = () => {
    setNeedsSocialLoginInfo(false);
    // After completing the social login info, we can consider the user verified
    setUserVerified(true);
    setActiveView("allowed-companies");
  };

  const handleuserVerification = (toVerify: string) => {
    if (toVerify === "phone") {
      setPhoneVerified(true);
      // Update the user object in AuthContext
      updateUser({ isPhoneVerified: true });
    } else if (toVerify === "email") {
      setEmailVerified(true);
      // Update the user object in AuthContext
      updateUser({ isEmailVerified: true });
    } else if (toVerify === "mfa") {
      // MFA setup is complete, user is fully verified
      setUserVerified(true);
      setActiveView("allowed-companies");
    }
    console.log("User verified:", toVerify);
    console.log("Verification Status:", userVerified);
  };

  // Reusable sub-menu button
  const SidebarSubButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
  }> = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px 10px",
        fontSize: "0.95em",
        fontWeight: isActive ? "bold" : "normal",
        color: isActive ? activeColor : "inherit",
      }}
    >
      <List24Filled style={{ marginRight: 8 }} /> {label}
    </button>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Mobile menu toggle button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "fixed",
            top: "10px",
            left: "10px",
            zIndex: 1001,
            background: sidebarOpen ? "transparent" : headerBgColor,
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            fontSize: "1.5rem",
          }}
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      )}

      {/* Overlay for mobile sidebar */}
      {isMobile && sidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: sidebarOpen ? (isMobile ? "250px" : "200px") : "60px",
            backgroundColor: sidebarBgColor,
            position: isMobile && sidebarOpen ? "fixed" : "relative",
            height: isMobile && sidebarOpen ? "100vh" : "auto",
            zIndex: isMobile && sidebarOpen ? 1000 : 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "width 0.3s ease-in-out",
            padding: "10px 0",
            boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
          }}
        >
          <div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                width: "100%",
                border: "none",
                background: "none",
                padding: "10px",
                display: "flex",
                justifyContent: sidebarOpen ? "flex-end" : "center",
                alignItems: "center",
              }}
            >
              {sidebarOpen ? <ChevronLeft24Filled /> : <ChevronRight24Filled />}
            </button>

            {/* Data Access Management - Not shown for Microsoft users */}
            {user?.socialLogin !== "microsoft" && (
              <button
                disabled={!userVerified}
                onClick={() => setShowDataAccess(!showDataAccess)}
                style={{
                  ...buttonStyle,
                  opacity: userVerified ? 1 : 0.5,
                  fontWeight: showDataAccess ? "bold" : "normal",
                  color: showDataAccess ? activeColor : "inherit",
                }}
              >
                <List24Filled style={{ marginRight: sidebarOpen ? 10 : 0 }} />
                {sidebarOpen && "Data Access Management"}
              </button>
            )}

            {/* Add Company (Only visible for Azure AD users) */}
            {user?.socialLogin === "microsoft" && (
              <button
                onClick={() => navigate("/add-company")}
                style={{
                  ...buttonStyle,
                  fontWeight: activeView === "add-company" ? "bold" : "normal",
                  color: activeView === "add-company" ? activeColor : "inherit",
                }}
              >
                <List24Filled style={{ marginRight: sidebarOpen ? 10 : 0 }} />
                {sidebarOpen && "Add Company"}
              </button>
            )}
            {showDataAccess && sidebarOpen && (
              <div style={submenuStyle}>
                <SidebarSubButton
                  label="Allowed Companies"
                  isActive={activeView === "allowed-companies"}
                  onClick={() => setActiveView("allowed-companies")}
                />

                <SidebarSubButton
                  label="All Registered Companies"
                  isActive={activeView === "all-companies"}
                  onClick={() => setActiveView("all-companies")}
                />
              </div>
            )}

            {/* Account Management */}
            <button
              disabled={!userVerified}
              onClick={() => setShowAccountMgmt(!showAccountMgmt)}
              style={{
                ...buttonStyle,
                opacity: userVerified ? 1 : 0.5,
                fontWeight: showAccountMgmt ? "bold" : "normal",
                color: showAccountMgmt ? activeColor : "inherit",
              }}
            >
              <List24Filled style={{ marginRight: sidebarOpen ? 10 : 0 }} />
              {sidebarOpen && "Account Management"}
            </button>
            {showAccountMgmt && sidebarOpen && (
              <div style={submenuStyle}>
                <SidebarSubButton
                  label="Delete Account"
                  isActive={activeView === "delete-account"}
                  onClick={() => setActiveView("delete-account")}
                />
                <SidebarSubButton
                  label="Billing Setup"
                  isActive={activeView === "billing-setup"}
                  onClick={() => setActiveView("billing-setup")}
                />
              </div>
            )}

            {/* Refer a Friend */}
            <button
              disabled={!userVerified}
              onClick={() => setActiveView("refer-a-friend")}
              style={{
                ...buttonStyle,
                opacity: userVerified ? 1 : 0.5,
                fontWeight: activeView === "refer-a-friend" ? "bold" : "normal",
                color:
                  activeView === "refer-a-friend" ? activeColor : "inherit",
              }}
            >
              <List24Filled style={{ marginRight: sidebarOpen ? 10 : 0 }} />
              {sidebarOpen && "Refer a Friend"}
            </button>
          </div>

          {/* Sign Out */}
          <div style={{ width: "100%" }}>
            <button
              onClick={handleSignOut}
              style={{
                ...buttonStyle,
                marginTop: "auto",
              }}
            >
              <SignOut24Filled style={{ marginRight: sidebarOpen ? 10 : 0 }} />
              {sidebarOpen && "Sign Out"}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              width: "100%",
              backgroundColor: headerBgColor,
              color: "white",
              padding: isMobile ? "10px" : "10px 20px",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                textAlign: isMobile ? "center" : "left",
                flexGrow: 1,
                margin: 0,
                fontSize: isMobile ? "1rem" : "1.5rem",
                marginBottom: isMobile ? "10px" : 0,
              }}
            >
              Secure your most important data during Transactions
            </h2>
            <div>
              <img
                src={user?.imageUrl || "/logo192.png"}
                alt="Profile"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={onProfileClick}
              />
              {profileMenuProps && <ContextualMenu {...profileMenuProps} />}
            </div>
          </div>

          <div
            style={{
              padding: isMobile ? "10px" : "20px",
              overflowX: "auto",
              flex: 1,
            }}
          >
            {needsSocialLoginInfo ? (
              <SocialLoginUserInfo onComplete={handleSocialLoginInfoComplete} />
            ) : userVerified ? (
              // Your normal dashboard views
              <>
                {activeView === "allowed-companies" && <AllowedCompanies />}
                {activeView === "all-companies" && <BusinessAllowanceTable />}
                {activeView === "delete-account" && (
                  <DeleteAccount {...userDetails} />
                )}
                {activeView === "suspend-account" && <SuspentAccount />}
                {activeView === "refer-a-friend" && <InviteAFriend />}
                {activeView === "billing-setup" && <BillingManager />}
                {activeView === "update-profile-picture" && (
                  <UpdateProfilePicture />
                )}
                {activeView === "terms-and-conditions" && (
                  <TermsAndConditions />
                )}
              </>
            ) : (
              <VerifyUserPanel
                emailAddress={user?.email || ""}
                phoneNumber={parseInt(user?.phone_number || "")}
                phoneVerified={phoneVerified}
                emailVerified={emailVerified}
                onVerify={handleuserVerification}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      {isAuthenticated && (
        <div
          style={{
            backgroundColor: footerBgColor,
            padding: "10px 20px",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <AppFooter
            message="You are signed in as with a trial account ending on 2025-12-31"
            version="pseudo@2025"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
