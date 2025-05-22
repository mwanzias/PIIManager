import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Starter from "./components/Starter";
import Signup from "./components/Signup";
import StarterPage from "./components/StarterPage";
import AccountDeletedBanner from "./components/AccountManagement/AccountDeletedMessage";
import { useAuth } from "./context/AuthContext";
import TestimonialModeration from "./components/TestimonialModeration";
import ProtectedRoute from "./components/ProtectedRoute";
import EmailVerification from "./components/EmailVerification";

// Protected route component
const ProtectedRouteComponent: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StarterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/deleted" element={<AccountDeletedBanner />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route
          path="/dashboard"
          element={<ProtectedRouteComponent element={<Dashboard />} />}
        />
        <Route
          path="/moderate-testimonials"
          element={
            <ProtectedRoute requiredRole="admin">
              <TestimonialModeration />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
