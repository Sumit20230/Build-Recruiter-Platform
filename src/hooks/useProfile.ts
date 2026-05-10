import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useProfileStore } from "@/store/profileStore";
import type { JobPosting, Profile, PublicRecruiterProfile, WorkExperience } from "@/types";

export function useMyProfile(userId?: string) {
  const { myProfile: profile, setMyProfile } = useProfileStore();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error) throw error;
    setMyProfile(data as Profile);
    setLoading(false);
  }, [setMyProfile, userId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`my-profile-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles", filter: `id=eq.${userId}` }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [load, userId]);

  return { profile, loading, reload: load };
}

export function usePublicRecruiterProfile(recruiterId?: string, viewerId?: string | null) {
  const { publicProfile: data, setPublicProfile } = useProfileStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!recruiterId) return;
    setLoading(true);
    setError(null);
    try {
      const [profileRes, workRes, jobsRes, followersRes, viewsRes, followingRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", recruiterId).eq("role", "recruiter").single(),
        supabase.from("work_experience").select("*").eq("recruiter_id", recruiterId).order("start_date", { ascending: false }),
        supabase.from("job_postings").select("*").eq("recruiter_id", recruiterId).eq("is_active", true).order("created_at", { ascending: false }),
        supabase.from("follows").select("id", { count: "exact", head: true }).eq("following_id", recruiterId),
        supabase.from("profile_views").select("id", { count: "exact", head: true }).eq("recruiter_id", recruiterId),
        viewerId
          ? supabase.from("follows").select("id").eq("following_id", recruiterId).eq("follower_id", viewerId).maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (profileRes.error) throw profileRes.error;
      if (workRes.error) throw workRes.error;
      if (jobsRes.error) throw jobsRes.error;

      setPublicProfile({
        profile: profileRes.data as Profile,
        work: (workRes.data ?? []) as WorkExperience[],
        jobs: (jobsRes.data ?? []) as JobPosting[],
        followerCount: followersRes.count ?? 0,
        viewCount: viewsRes.count ?? 0,
        isFollowing: Boolean(followingRes.data),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load profile.");
    } finally {
      setLoading(false);
    }
  }, [recruiterId, setPublicProfile, viewerId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!recruiterId) return;
    const channel = supabase
      .channel(`public-profile-${recruiterId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles", filter: `id=eq.${recruiterId}` }, () => {
        void load();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "work_experience", filter: `recruiter_id=eq.${recruiterId}` }, () => {
        void load();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "job_postings", filter: `recruiter_id=eq.${recruiterId}` }, () => {
        void load();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "follows", filter: `following_id=eq.${recruiterId}` }, () => {
        void load();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "profile_views", filter: `recruiter_id=eq.${recruiterId}` }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [load, recruiterId]);

  useEffect(() => {
    if (!recruiterId || !viewerId || recruiterId === viewerId) return;
    void supabase.from("profile_views").insert({ recruiter_id: recruiterId, viewer_id: viewerId });
  }, [recruiterId, viewerId]);

  return { data, loading, error, reload: load, setData: setPublicProfile };
}
