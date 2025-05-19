import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./components/Starter";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Starter from "./components/Starter";
import AccountDeletedBanner from "./components/AccountManagement/AccountDeletedMessage";
import { useAuth } from "./context/AuthContext";

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({
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
        <Route path="/" element={<Starter />} />
        <Route path="/login" element={<Starter />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/deleted" element={<AccountDeletedBanner />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
