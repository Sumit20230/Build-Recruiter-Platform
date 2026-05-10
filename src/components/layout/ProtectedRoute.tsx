import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types";

export function ProtectedRoute({ children, role }: PropsWithChildren<{ role?: Role }>) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!auth.user) return <Navigate to="/auth" replace state={{ from: location }} />;
  if (role && auth.role !== role) return <Navigate to={auth.role === "recruiter" ? "/dashboard" : "/discover"} replace />;
  return <>{children}</>;
}
