import { Route, Routes } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Toaster } from "@/components/ui/toast";
import { AuthPage } from "@/pages/AuthPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { DiscoverPage } from "@/pages/DiscoverPage";
import { EditProfilePage } from "@/pages/EditProfilePage";
import { LandingPage } from "@/pages/LandingPage";
import { PublicProfilePage } from "@/pages/PublicProfilePage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<ProtectedRoute role="recruiter"><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute role="recruiter"><EditProfilePage /></ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute role="jobseeker"><DiscoverPage /></ProtectedRoute>} />
        <Route path="/r/:id" element={<ProtectedRoute><PublicProfilePage /></ProtectedRoute>} />
      </Routes>
      <Footer />
      <Toaster />
    </>
  );
}
