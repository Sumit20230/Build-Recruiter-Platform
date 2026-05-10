import { Link, NavLink, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { APP_CONFIG, UI_STRINGS } from "@/lib/constants";

import { NotificationCenter } from "./NotificationCenter";

export function Navbar() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${isActive ? "text-teal-700" : "text-slate-600 hover:text-slate-950"}`;

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
            <BriefcaseBusiness className="h-5 w-5" />
          </span>
          {APP_CONFIG.NAME}
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {role === "recruiter" ? <NavLink to="/dashboard" className={linkClass}>{UI_STRINGS.NAV_DASHBOARD}</NavLink> : null}
          {role === "recruiter" ? <NavLink to="/profile/edit" className={linkClass}>{UI_STRINGS.NAV_EDIT_PROFILE}</NavLink> : null}
          {role === "jobseeker" ? <NavLink to="/discover" className={linkClass}>{UI_STRINGS.NAV_DISCOVER}</NavLink> : null}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationCenter />
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                {UI_STRINGS.NAV_SIGN_OUT}
              </Button>
            </>
          ) : (
            <Button asChild size="sm" variant="accent">
              <Link to="/auth">{UI_STRINGS.NAV_GET_STARTED}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
