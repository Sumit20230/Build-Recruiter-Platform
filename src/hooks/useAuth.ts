import { useEffect, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase, supabaseConfigMessage } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { UI_STRINGS } from "@/lib/constants";
import type { AuthSignUpPayload, Role } from "@/types";

function roleFromMetadata(user: User): Role | null {
  const role = user.user_metadata?.role;
  return role === "recruiter" || role === "jobseeker" ? role : null;
}

let authBootstrapStarted = false;

export function useAuth() {
  const { user, role, loading, setUser, setRole, setLoading } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    async function loadRole(nextUser: User) {
      const { data, error } = await supabase.from("profiles").select("role").eq("id", nextUser.id).maybeSingle();
      if (error) throw error;

      let nextRole = (data?.role as Role | undefined) ?? roleFromMetadata(nextUser);
      if (nextRole && !data) {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: nextUser.id,
          role: nextRole,
          full_name: nextUser.user_metadata?.full_name ?? nextUser.email,
        });
        if (insertError) throw insertError;
      }

      setRole(nextRole);
      return nextRole;
    }

    async function bootstrap() {
      if (authBootstrapStarted) return;
      authBootstrapStarted = true;

      if (!isSupabaseConfigured) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(data.user);
        if (data.user) await loadRole(data.user);
        else setRole(null);
      } catch (error) {
        console.error("Auth bootstrap failed", error);
        setUser(null);
        setRole(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    bootstrap();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        void loadRole(session.user)
          .catch((error) => {
            console.error("Auth role load failed", error);
            setRole(null);
          })
          .finally(() => setLoading(false));
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [setLoading, setRole, setUser]);

  return useMemo(
    () => ({
      user,
      role,
      loading,
      async signIn(email: string, password: string) {
        if (!isSupabaseConfigured) throw new Error(supabaseConfigMessage);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.user) throw new Error(UI_STRINGS.AUTH_ERR_NO_SESSION);
        const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
        if (profileError) throw profileError;

        let nextRole = (profile?.role as Role | undefined) ?? roleFromMetadata(data.user);
        if (!nextRole) throw new Error(UI_STRINGS.AUTH_ERR_NO_ROLE);

        if (!profile) {
          const { error: insertError } = await supabase.from("profiles").insert({
            id: data.user.id,
            role: nextRole,
            full_name: data.user.user_metadata?.full_name ?? data.user.email,
          });
          if (insertError) throw insertError;
        }

        setRole(nextRole);
        setUser(data.user);
        return nextRole;
      },
      async signUp(payload: AuthSignUpPayload) {
        if (!isSupabaseConfigured) throw new Error(supabaseConfigMessage);
        const { data, error } = await supabase.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: { data: { full_name: payload.fullName, role: payload.role } },
        });
        if (error) throw error;

        if (data.session && data.user) {
          const { error: profileError } = await supabase.from("profiles").upsert({
            id: data.user.id,
            role: payload.role,
            full_name: payload.fullName,
          });
          if (profileError) throw profileError;
          setRole(payload.role);
        }
      },
      async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
    }),
    [loading, role, setLoading, setRole, setUser, user],
  );
}
