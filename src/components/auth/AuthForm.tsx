import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase";
import { RoleSelector } from "@/components/auth/RoleSelector";
import type { Role } from "@/types";
import { ERROR_MESSAGES, UI_STRINGS } from "@/lib/constants";

function authErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return ERROR_MESSAGES.AUTH_GENERIC_FAILURE;
  const status = "status" in error ? Number(error.status) : undefined;
  if (status === 429 || error.message.toLowerCase().includes("rate")) {
    return ERROR_MESSAGES.AUTH_RATE_LIMIT;
  }
  return error.message;
}

export function AuthForm() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<Role>("recruiter");
  const [busy, setBusy] = useState(false);

  function redirect(nextRole: Role) {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
    navigate(from || (nextRole === "recruiter" ? "/dashboard" : "/discover"), { replace: true });
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const nextRole = await auth.signIn(String(form.get("email")), String(form.get("password")));
      toast({ title: UI_STRINGS.WELCOME_BACK });
      redirect(nextRole);
    } catch (error) {
      toast({ title: ERROR_MESSAGES.AUTH_SIGN_IN_FAILED, description: authErrorMessage(error), variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      await auth.signUp({
        fullName: String(form.get("fullName")),
        email: String(form.get("email")),
        password: String(form.get("password")),
        role,
      });
      toast({ title: UI_STRINGS.ACCOUNT_CREATED, description: UI_STRINGS.WORKSPACE_READY });
      redirect(role);
    } catch (error) {
      toast({ title: ERROR_MESSAGES.AUTH_SIGN_UP_FAILED, description: authErrorMessage(error), variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>{UI_STRINGS.AUTH_TITLE}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isSupabaseConfigured ? (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
            {supabaseConfigMessage}
          </div>
        ) : null}
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{UI_STRINGS.AUTH_LOGIN_TAB}</TabsTrigger>
            <TabsTrigger value="signup">{UI_STRINGS.AUTH_SIGNUP_TAB}</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="login-email">{UI_STRINGS.AUTH_EMAIL_LABEL}</Label>
                <Input id="login-email" name="email" type="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="login-password">{UI_STRINGS.AUTH_PASSWORD_LABEL}</Label>
                <Input id="login-password" name="password" type="password" required />
              </div>
              <Button disabled={busy} variant="accent">{busy ? UI_STRINGS.AUTH_SIGNING_IN : UI_STRINGS.AUTH_SIGN_IN_BUTTON}</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">{UI_STRINGS.AUTH_NAME_LABEL}</Label>
                <Input id="fullName" name="fullName" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-email">{UI_STRINGS.AUTH_EMAIL_LABEL}</Label>
                <Input id="signup-email" name="email" type="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-password">{UI_STRINGS.AUTH_PASSWORD_LABEL}</Label>
                <Input id="signup-password" name="password" type="password" minLength={6} required />
              </div>
              <RoleSelector value={role} onChange={setRole} />
              <Button disabled={busy} variant="accent">{busy ? UI_STRINGS.AUTH_CREATING_ACCOUNT : UI_STRINGS.AUTH_CREATE_ACCOUNT_BUTTON}</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
