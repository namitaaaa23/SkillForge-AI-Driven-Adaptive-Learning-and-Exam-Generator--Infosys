import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import LearnerLogin from "./pages/LearnerLogin";
import GuardianLogin from "./pages/GuardianLogin";
import LearnerDashboard from "./pages/LearnerDashboard";
import LearnerContent from "./pages/LearnerContent";
import AdminDashboard from "./pages/AdminDashboard";
import GuardianDashboard from "./pages/GuardianDashboard";
import AuthGuard from "./components/AuthGuard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />



        <Route path="/learner-login" element={<LearnerLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/guardian-login" element={<GuardianLogin />} />

        <Route path="/learner-dashboard" element={
          <AuthGuard redirectTo="/learner-login">
            <LearnerDashboard />
          </AuthGuard>
        } />
        <Route path="/learner-content" element={
          <AuthGuard redirectTo="/learner-login">
            <LearnerContent />
          </AuthGuard>
        } />
        <Route path="/admin-dashboard" element={
          <AuthGuard redirectTo="/admin-login">
            <AdminDashboard />
          </AuthGuard>
        } />
        <Route path="/guardian-dashboard" element={
          <AuthGuard redirectTo="/guardian-login">
            <GuardianDashboard />
          </AuthGuard>
        } />

      </Routes>
    </BrowserRouter>
  );
}
