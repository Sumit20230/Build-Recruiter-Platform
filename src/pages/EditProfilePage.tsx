import { FormEvent, useEffect, useState } from "react";
import { BriefcaseBusiness, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { WorkTimeline } from "@/components/profile/WorkTimeline";
import { JobCard } from "@/components/profile/JobCard";
import { SkillTagInput } from "@/components/profile/SkillTagInput";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { JobPosting, Profile, WorkExperience } from "@/types";
import { UI_STRINGS } from "@/lib/constants";

const emptyProfile: Partial<Profile> = {
  full_name: "",
  avatar_url: "",
  headline: "",
  bio: "",
  company: "",
  location: "",
  linkedin_url: "",
};

export function EditProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<Profile>>(emptyProfile);
  const [work, setWork] = useState<WorkExperience[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingWork, setEditingWork] = useState<Partial<WorkExperience>>({});
  const [editingJob, setEditingJob] = useState<Partial<JobPosting>>({ is_active: true });

  async function load() {
    if (!user) return;
    setLoading(true);
    const [profileRes, workRes, jobsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("work_experience").select("*").eq("recruiter_id", user.id).order("start_date", { ascending: false }),
      supabase.from("job_postings").select("*").eq("recruiter_id", user.id).order("created_at", { ascending: false }),
    ]);
    if (profileRes.data) setProfile(profileRes.data as Profile);
    setWork((workRes.data ?? []) as WorkExperience[]);
    setJobs((jobsRes.data ?? []) as JobPosting[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();

    if (!user) return;
    const channel = supabase
      .channel(`profile-editor-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles", filter: `id=eq.${user.id}` }, () => {
        void load();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "work_experience", filter: `recruiter_id=eq.${user.id}` }, () => {
        void load();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "job_postings", filter: `recruiter_id=eq.${user.id}` }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user]);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(profile).eq("id", user.id);
    setSaving(false);
    if (error) toast({ title: UI_STRINGS.TOAST_PROFILE_SAVE_FAILED, description: error.message, variant: "error" });
    else toast({ title: UI_STRINGS.TOAST_PROFILE_SAVED });
  }

  async function saveWork(event: FormEvent) {
    event.preventDefault();
    if (!user || !editingWork.company || !editingWork.title) return;
    const payload = { ...editingWork, recruiter_id: user.id };
    const query = editingWork.id
      ? supabase.from("work_experience").update(payload).eq("id", editingWork.id)
      : supabase.from("work_experience").insert(payload);
    const { error } = await query;
    if (error) toast({ title: UI_STRINGS.TOAST_WORK_FAILED, description: error.message, variant: "error" });
    else {
      toast({ title: editingWork.id ? UI_STRINGS.TOAST_WORK_UPDATED : UI_STRINGS.TOAST_WORK_ADDED });
      setEditingWork({});
      await load();
    }
  }

  async function saveJob(event: FormEvent) {
    event.preventDefault();
    if (!user || !editingJob.title || !editingJob.company) return;
    const payload = { ...editingJob, recruiter_id: user.id, skills: editingJob.skills ?? [] };
    const query = editingJob.id
      ? supabase.from("job_postings").update(payload).eq("id", editingJob.id)
      : supabase.from("job_postings").insert(payload);
    const { error } = await query;
    if (error) toast({ title: UI_STRINGS.TOAST_JOB_FAILED, description: error.message, variant: "error" });
    else {
      toast({ title: editingJob.id ? UI_STRINGS.TOAST_JOB_UPDATED : UI_STRINGS.TOAST_JOB_ADDED });
      setEditingJob({ is_active: true });
      await load();
    }
  }

  async function remove(table: "work_experience" | "job_postings", id: string) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast({ title: UI_STRINGS.TOAST_DELETE_FAILED, description: error.message, variant: "error" });
    else {
      toast({ title: UI_STRINGS.TOAST_DELETED });
      await load();
    }
  }

  if (loading) {
    return <PageWrapper><Skeleton className="h-12 w-72" /><Skeleton className="mt-6 h-96 w-full" /></PageWrapper>;
  }

  return (
    <PageWrapper>
      <h1 className="text-3xl font-semibold text-slate-950">{UI_STRINGS.EDIT_PROFILE_TITLE}</h1>
      <form onSubmit={saveProfile} className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {([
            { key: "full_name", label: UI_STRINGS.FIELD_FULL_NAME },
            { key: "avatar_url", label: UI_STRINGS.FIELD_AVATAR_URL },
            { key: "headline", label: UI_STRINGS.FIELD_HEADLINE },
            { key: "company", label: UI_STRINGS.FIELD_COMPANY },
            { key: "location", label: UI_STRINGS.FIELD_LOCATION },
            { key: "linkedin_url", label: UI_STRINGS.FIELD_LINKEDIN_URL },
          ] as const).map(({ key, label }) => (
            <div className="grid gap-2" key={key}>
              <Label htmlFor={key}>{label}</Label>
              <Input id={key} value={String((profile as Record<string, unknown>)[key] ?? "")} onChange={(event) => setProfile({ ...profile, [key]: event.target.value })} />
            </div>
          ))}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bio">{UI_STRINGS.EDIT_PROFILE_BIO_LABEL}</Label>
          <Textarea id="bio" value={profile.bio ?? ""} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} />
        </div>
        <Button className="w-fit" variant="accent" disabled={saving}><Save className="h-4 w-4" />{saving ? UI_STRINGS.EDIT_PROFILE_SAVING : UI_STRINGS.EDIT_PROFILE_SAVE_PROFILE}</Button>
      </form>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="mb-4 text-xl font-semibold">{UI_STRINGS.EDIT_PROFILE_WORK_SECTION}</h2>
          <WorkTimeline items={work} />
          <div className="mt-4 grid gap-2">
            {work.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-3">
                <span className="text-sm">{item.title} at {item.company}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingWork(item)}>{UI_STRINGS.EDIT_PROFILE_EDIT}</Button>
                  <Button size="sm" variant="destructive" onClick={() => remove("work_experience", item.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Card>
          <CardHeader><CardTitle>{editingWork.id ? UI_STRINGS.EDIT_PROFILE_EDIT_EXP : UI_STRINGS.EDIT_PROFILE_ADD_EXP}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={saveWork} className="grid gap-3">
              <Input placeholder={UI_STRINGS.JOB_COMPANY_PLACEHOLDER} value={editingWork.company ?? ""} onChange={(e) => setEditingWork({ ...editingWork, company: e.target.value })} required />
              <Input placeholder={UI_STRINGS.JOB_TITLE_PLACEHOLDER} value={editingWork.title ?? ""} onChange={(e) => setEditingWork({ ...editingWork, title: e.target.value })} required />
              <Input type="date" value={editingWork.start_date ?? ""} onChange={(e) => setEditingWork({ ...editingWork, start_date: e.target.value })} />
              <Input type="date" value={editingWork.end_date ?? ""} onChange={(e) => setEditingWork({ ...editingWork, end_date: e.target.value || null })} />
              <Textarea placeholder={UI_STRINGS.JOB_DESC_PLACEHOLDER} value={editingWork.description ?? ""} onChange={(e) => setEditingWork({ ...editingWork, description: e.target.value })} />
              <Button variant="accent"><Plus className="h-4 w-4" />{UI_STRINGS.EDIT_PROFILE_SAVE_WORK}</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="mb-4 text-xl font-semibold">{UI_STRINGS.EDIT_PROFILE_JOB_SECTION}</h2>
          {jobs.length ? <div className="grid gap-4 md:grid-cols-2">{jobs.map((job) => <JobCard key={job.id} job={job} onClick={() => setEditingJob(job)} />)}</div> : <EmptyState icon={BriefcaseBusiness} title={UI_STRINGS.EDIT_PROFILE_NO_JOBS} description={UI_STRINGS.EDIT_PROFILE_NO_JOBS_DESC} />}
          <div className="mt-4 grid gap-2">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-3">
                <span className="text-sm">{job.title}</span>
                <Button size="sm" variant="destructive" onClick={() => remove("job_postings", job.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </div>
        <Card>
          <CardHeader><CardTitle>{editingJob.id ? UI_STRINGS.EDIT_PROFILE_EDIT_JOB : UI_STRINGS.EDIT_PROFILE_ADD_JOB}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={saveJob} className="grid gap-3">
              <Input placeholder={UI_STRINGS.JOB_TITLE_PLACEHOLDER} value={editingJob.title ?? ""} onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })} required />
              <Input placeholder={UI_STRINGS.JOB_COMPANY_PLACEHOLDER} value={editingJob.company ?? ""} onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })} required />
              <Input placeholder={UI_STRINGS.JOB_LOCATION_PLACEHOLDER} value={editingJob.location ?? ""} onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })} />
              <Input placeholder={UI_STRINGS.JOB_TYPE_PLACEHOLDER} value={editingJob.job_type ?? ""} onChange={(e) => setEditingJob({ ...editingJob, job_type: e.target.value })} />
              <SkillTagInput value={editingJob.skills ?? []} onChange={(skills) => setEditingJob({ ...editingJob, skills })} />
              <Textarea placeholder={UI_STRINGS.JOB_DESC_PLACEHOLDER} value={editingJob.description ?? ""} onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editingJob.is_active ?? true} onChange={(e) => setEditingJob({ ...editingJob, is_active: e.target.checked })} /> {UI_STRINGS.EDIT_PROFILE_ACTIVE_LABEL}</label>
              <Button variant="accent"><Plus className="h-4 w-4" />{UI_STRINGS.EDIT_PROFILE_SAVE_JOB}</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </PageWrapper>
  );
}
