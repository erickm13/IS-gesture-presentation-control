import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import PrincipalProject from "./pages/PrincipalProject";
import WelcomePage from "./pages/WelcomePage";
import Register from "./components/Register"

export default function App() {
   return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register  />} />
        <Route path="/presenter" element={<PrincipalProject />} />
      </Routes>
    </Router>
  );
}
