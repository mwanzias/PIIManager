import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PrimaryButton,
  Stack,
  IconButton,
  IContextualMenuProps,
  ContextualMenu,
} from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft24Filled,
  ChevronRight24Filled,
  List24Filled,
  SignOut24Filled,
} from "@fluentui/react-icons";
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
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [needsSocialLoginInfo, setNeedsSocialLoginInfo] = useState(false);

  const userDetails: accountManagementProps = {
    idnumber: user?.idNumber || "22186940",
    emailAddress: user?.email || "mwanzias@gmail.com",
    phoneNumber: parseInt(user?.phoneNumber || "254721803652"),
  };

  const navigate = useNavigate();

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

  const handleSignOut = () => {
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
    if (user?.socialLogin && (!user.idNumber || !user.phoneNumber)) {
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
    } else if (toVerify === "email") {
      setEmailVerified(true);
    }
    console.log("User verified:", toVerify);
    console.log("Verification Status:", userVerified);
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <div
          style={{
            width: sidebarOpen ? "200px" : "60px",
            backgroundColor: "#f3f3f3",

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
              style={{ width: "100%", border: "none", background: "none" }}
            >
              {sidebarOpen ? <ChevronLeft24Filled /> : <ChevronRight24Filled />}
            </button>

            {/* Data Access Management */}
            <button
              disabled={!userVerified}
              onClick={() => setShowDataAccess(!showDataAccess)}
              style={buttonStyle}
            >
              <List24Filled style={{ marginRight: sidebarOpen ? 10 : 0 }} />
              {sidebarOpen && "Data Access Management"}
            </button>
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
              style={buttonStyle}
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
                  label="Suspend Account"
                  isActive={activeView === "suspend-account"}
                  onClick={() => setActiveView("suspend-account")}
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
                fontWeight: activeView === "refer-a-friend" ? "bold" : "normal",
                color: activeView === "refer-a-friend" ? "#0078d4" : "inherit",
              }}
            >
              <List24Filled style={{ marginRight: sidebarOpen ? 10 : 0 }} />
              {sidebarOpen && "Refer a Friend"}
            </button>
          </div>

          {/* Sign Out */}
          <div style={{ width: "100%" }}>
            <button onClick={handleSignOut} style={buttonStyle}>
              <SignOut24Filled style={{ marginRight: sidebarOpen ? 10 : 0 }} />
              {sidebarOpen && "Sign Out"}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1 }}>
          {/* Header */}
          <div
            style={{
              width: "100%",
              backgroundColor: "#0078d4",
              color: "white",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ textAlign: "center", flexGrow: 1, margin: 0 }}>
              Secure your most important data during Transactions involving your
              personal data
            </h2>
            <div>
              <img
                src={user?.imageUrl || "/default-profile.png"}
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

          <div style={{ padding: "20px" }}>
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
                emailAddress={user?.email || "mwanzias@gmail.com"}
                phoneNumber={parseInt(user?.phoneNumber || "254721803652")}
                phoneVerified={phoneVerified}
                emailVerified={emailVerified}
                onVerify={handleuserVerification}
              />
            )}
          </div>
        </div>
      </div>
      {isAuthenticated && (
        <AppFooter
          message="You are signed in as with a trial account ending on 2025-12-31"
          version="pseudo@2025"
        />
      )}
    </div>
  );
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
      color: isActive ? "#0078d4" : "inherit",
    }}
  >
    <List24Filled style={{ marginRight: 8 }} /> {label}
  </button>
);

// Styling helpers
const buttonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: "10px",
  background: "none",
  border: "none",
  cursor: "pointer",
};

const submenuStyle: React.CSSProperties = {
  paddingLeft: 20,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

export default Dashboard;
