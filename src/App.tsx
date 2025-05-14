import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Starter";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Starter from "./components/Starter";
import AccountDeletedBanner from "./components/AccountManagement/AccountDeletedMessage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Starter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/deleted" element={<AccountDeletedBanner />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
