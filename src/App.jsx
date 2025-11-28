import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import LearnerLogin from "./pages/LearnerLogin";
import GuardianLogin from "./pages/GuardianLogin";
import LearnerDashboard from "./pages/LearnerDashboard";
import LearnerContent from "./pages/LearnerContent";
import AdminDashboard from "./pages/AdminDashboard";
import GuardianDashboard from "./pages/GuardianDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />



        <Route path="/learner-login" element={<LearnerLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/guardian-login" element={<GuardianLogin />} />

        <Route path="/learner-dashboard" element={<LearnerDashboard />} />
        <Route path="/learner-content" element={<LearnerContent />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/guardian-dashboard" element={<GuardianDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}
