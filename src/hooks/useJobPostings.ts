import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useProfileStore } from "@/store/profileStore";
import type { JobPosting } from "@/types";

export function useJobPostings(recruiterId?: string) {
  const { jobPostings: jobs, setJobPostings } = useProfileStore();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!recruiterId) return;
    setLoading(true);
    const { data, error } = await supabase.from("job_postings").select("*").eq("recruiter_id", recruiterId).order("created_at", { ascending: false });
    if (error) throw error;
    setJobPostings((data ?? []) as JobPosting[]);
    setLoading(false);
  }, [recruiterId, setJobPostings]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!recruiterId) return;
    const channel = supabase
      .channel(`job-postings-${recruiterId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "job_postings", filter: `recruiter_id=eq.${recruiterId}` }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [load, recruiterId]);

  return { jobs, loading, reload: load };
}
