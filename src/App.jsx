import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import PrincipalProject from "./pages/PrincipalProject";
import WelcomePage from "./pages/WelcomePage";
import Register from "./components/Register"
import UserLayout from "./components/UserLayout"
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard"


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route 
          path="/app"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >

        <Route path="/app/presenter/:id" element={<PrincipalProject />} />
 
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="presenter" element={<PrincipalProject />} />
        </Route>

      </Routes>
    </Router>
  );
}
