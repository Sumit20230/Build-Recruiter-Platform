import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { UI_STRINGS } from "@/lib/constants";
import { AppStatus } from "@/types";
import type { JobApplication, ApplicationStatus } from "@/types";

export function useApplications() {
  const [loading, setLoading] = useState(false);

  const applyForJob = useCallback(async (jobId: string, userId: string, message?: string) => {
    if (!jobId || !userId) {
      throw new Error(UI_STRINGS.APPLY_ERR_MISSING);
    }

    setLoading(true);
    try {
      // 1. Get recruiter_id and job title
      const { data: job, error: jobError } = await supabase
        .from("job_postings")
        .select("recruiter_id, title, company")
        .eq("id", jobId)
        .single();
      
      if (jobError) throw new Error(`${UI_STRINGS.APPLY_ERR_FETCH}: ${jobError.message}`);

      // 2. Insert application
      const { error: appError } = await supabase
        .from("job_applications")
        .insert({
          job_id: jobId,
          applicant_id: userId,
          message: message || null,
        });

      if (appError) {
        if (appError.code === "23505") {
          throw new Error(UI_STRINGS.APPLY_ERR_ALREADY);
        }
        throw new Error(`${UI_STRINGS.APPLY_ERR_FAILED}: ${appError.message}`);
      }

      // 3. Create notification for recruiter
      await supabase.from("notifications").insert({
        user_id: job.recruiter_id,
        title: UI_STRINGS.APPLY_NOTIF_TITLE,
        message: UI_STRINGS.APPLY_NOTIF_MSG(job.title, job.company),
        type: "application"
      });

      return { success: true };
    } catch (error) {
      console.error("[useApplications] Apply Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkHasApplied = useCallback(async (jobId: string, userId: string) => {
    if (!jobId || !userId) return null;
    
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("job_id", jobId)
        .eq("applicant_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.warn("[useApplications] Check Applied Warning:", error.message);
        return null;
      }
      return data as JobApplication | null;
    } catch (error) {
      console.error("[useApplications] Check Applied Error:", error);
      return null;
    }
  }, []);

  const getRecruiterApplications = useCallback(async (recruiterId: string) => {
    if (!recruiterId) return [];

    setLoading(true);
    try {
      // 1. Get all job IDs for this recruiter
      const { data: jobs, error: jobsError } = await supabase
        .from("job_postings")
        .select("id")
        .eq("recruiter_id", recruiterId);

      if (jobsError) throw new Error(`${UI_STRINGS.EDIT_PROFILE_ERR_JOBS}: ${jobsError.message}`);
      if (!jobs || jobs.length === 0) return [];

      const jobIds = jobs.map(j => j.id);

      // 2. Get applications for those jobs
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          *,
          profiles:applicant_id (*),
          job_postings:job_id (*)
        `)
        .in("job_id", jobIds)
        .order("created_at", { ascending: false });

      if (error) throw new Error(`${UI_STRINGS.APPLICATIONS_ERR_LOAD}: ${error.message}`);
      return data as JobApplication[];
    } catch (error) {
      console.error("[useApplications] Fetch Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplicationStatus = useCallback(async (applicationId: string, status: ApplicationStatus) => {
    if (!applicationId) throw new Error(UI_STRINGS.STATUS_UPDATE_ERR_ID);

    setLoading(true);
    try {
      // 1. Get applicant_id and job title
      const { data: app, error: fetchError } = await supabase
        .from("job_applications")
        .select(`
          applicant_id,
          job_postings (title)
        `)
        .eq("id", applicationId)
        .single();
      
      if (fetchError) throw new Error(`${UI_STRINGS.STATUS_UPDATE_ERR_FETCH}: ${fetchError.message}`);

      // 2. Update status
      const { error: updateError } = await supabase
        .from("job_applications")
        .update({ status })
        .eq("id", applicationId);

      if (updateError) throw new Error(`${UI_STRINGS.STATUS_UPDATE_ERR_FAILED}: ${updateError.message}`);

      // 3. Create notification for jobseeker
      const statusLabels = {
        [AppStatus.PENDING]: UI_STRINGS.STATUS_LABEL_PENDING,
        [AppStatus.REVIEWED]: UI_STRINGS.STATUS_LABEL_REVIEWED,
        [AppStatus.SHORTLISTED]: UI_STRINGS.STATUS_LABEL_SHORTLISTED,
        [AppStatus.REJECTED]: UI_STRINGS.STATUS_LABEL_REJECTED
      };

      await supabase.from("notifications").insert({
        user_id: app.applicant_id,
        title: UI_STRINGS.STATUS_UPDATE_NOTIF_TITLE,
        message: UI_STRINGS.STATUS_UPDATE_NOTIF_MSG((app.job_postings as any).title, statusLabels[status]),
        type: "application_update"
      });

      return { success: true };
    } catch (error) {
      console.error("[useApplications] Update Status Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    applyForJob,
    checkHasApplied,
    getRecruiterApplications,
    updateApplicationStatus,
  };
}
