import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AzureProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * A route component that only allows access to users who are logged in via Azure AD.
 * If the user is not logged in or not logged in via Azure AD, they will be redirected to the login page.
 */
const AzureProtectedRoute: React.FC<AzureProtectedRouteProps> = ({
  children,
}) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  // Check if user is authenticated and logged in via Azure AD
  const isAzureAuthenticated =
    isAuthenticated && user?.socialLogin === "microsoft";

  if (!isAzureAuthenticated) {
    // Redirect to login page with a message
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message:
            "You must be logged in with a Microsoft account to access this page.",
        }}
        replace
      />
    );
  }

  // User is authenticated via Azure AD, render the protected content
  return <>{children}</>;
};

export default AzureProtectedRoute;
