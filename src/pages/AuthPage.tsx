import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useAuth } from "@/hooks/useAuth";

export function AuthPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !role) return;
    navigate(role === "recruiter" ? "/dashboard" : "/discover", { replace: true });
  }, [navigate, role, user]);

  return (
    <PageWrapper>
      <AuthForm />
    </PageWrapper>
  );
}
