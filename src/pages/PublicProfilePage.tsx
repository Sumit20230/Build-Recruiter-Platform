import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { BriefcaseBusiness, Eye, FileSearch, Users } from "lucide-react";
import { AiChatPanel } from "@/components/profile/AiChatPanel";
import { AiFeatureTabs } from "@/components/profile/AiFeatureTabs";
import { JobCard } from "@/components/profile/JobCard";
import { JobModal } from "@/components/profile/JobModal";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { WorkTimeline } from "@/components/profile/WorkTimeline";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import { useFollow } from "@/hooks/useFollow";
import { usePublicRecruiterProfile } from "@/hooks/useProfile";
import { UI_STRINGS } from "@/lib/constants";
import type { JobPosting } from "@/types";

export function PublicProfilePage() {
  const { id } = useParams();
  const { user, role } = useAuth();
  const followApi = useFollow();
  const { data, loading, error, setData } = usePublicRecruiterProfile(id, user?.id);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  const recruiterContext = useMemo(() => {
    if (!data) return "";
    const workText = data.work.map((item) => `${item.title} at ${item.company}: ${item.description || "No description"}`).join("\n");
    const jobText = data.jobs.map((job) => `${job.title} (${job.job_type || "type unknown"}, ${job.location || "location unknown"}): Skills ${(job.skills ?? []).join(", ")}. ${job.description || ""}`).join("\n");
    return `Name: ${data.profile.full_name}
Headline: ${data.profile.headline}
Company: ${data.profile.company}
Location: ${data.profile.location}
Bio: ${data.profile.bio}
${UI_STRINGS.AI_CONTEXT_WORK}
${workText || UI_STRINGS.AI_CONTEXT_NO_WORK}
${UI_STRINGS.AI_CONTEXT_JOBS}
${jobText || UI_STRINGS.AI_CONTEXT_NO_JOBS}`;
  }, [data]);

  async function toggleFollow() {
    if (!data || !user) return;
    const previous = data;
    setData({ ...data, isFollowing: !data.isFollowing, followerCount: data.followerCount + (data.isFollowing ? -1 : 1) });
    try {
      if (data.isFollowing) await followApi.unfollow(user.id, data.profile.id);
      else await followApi.follow(user.id, data.profile.id);
      toast({ title: data.isFollowing ? UI_STRINGS.TOAST_UNFOLLOW_SUCCESS : UI_STRINGS.TOAST_FOLLOW_SUCCESS });
    } catch (err) {
      setData(previous);
      toast({ title: UI_STRINGS.TOAST_FOLLOW_FAILED, description: err instanceof Error ? err.message : UI_STRINGS.COMMON_TRY_AGAIN, variant: "error" });
    }
  }

  if (loading) {
    return <PageWrapper><Skeleton className="h-44" /><Skeleton className="mt-6 h-64" /></PageWrapper>;
  }

  if (error || !data) {
    return <PageWrapper><div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">{error || UI_STRINGS.RECRUITER_NOT_FOUND}</div></PageWrapper>;
  }

  const stats = [
    { label: UI_STRINGS.PROFILE_TOTAL_VIEWS, value: data.viewCount, icon: Eye, sectionId: "about-section" },
    { label: UI_STRINGS.PROFILE_FOLLOWERS_LABEL, value: data.followerCount, icon: Users, sectionId: "header-section" },
    { label: UI_STRINGS.PROFILE_ACTIVE_LISTINGS, value: data.jobs.length, icon: BriefcaseBusiness, sectionId: "jobs-section" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <PageWrapper className="pb-28">
      <div id="header-section">
        <ProfileHeader
          profile={data.profile}
          followerCount={data.followerCount}
          canFollow={role === "jobseeker" && user?.id !== data.profile.id}
          isFollowing={data.isFollowing}
          onFollow={toggleFollow}
        />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.label} 
              className="cursor-pointer transition-colors hover:bg-slate-50"
              onClick={() => scrollToSection(stat.sectionId)}
            >
              <CardContent className="flex items-center gap-3 p-4">
                <Icon className="h-5 w-5 text-teal-700" />
                <div><p className="text-2xl font-semibold text-slate-950">{stat.value}</p><p className="text-sm text-slate-600">{stat.label}</p></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AiFeatureTabs recruiterContext={recruiterContext} />

      <section className="mt-8" id="about-section">
        <h2 className="mb-3 text-xl font-semibold text-slate-950">{UI_STRINGS.PROFILE_ABOUT_SECTION}</h2>
        <div className="rounded-lg border border-slate-200 bg-white p-5 leading-7 text-slate-700">{data.profile.bio || UI_STRINGS.PROFILE_NO_BIO}</div>
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-950">{UI_STRINGS.PROFILE_WORK_SECTION}</h2>
        <WorkTimeline items={data.work} />
      </section>
      <section className="mt-8" id="jobs-section">
        <h2 className="mb-4 text-xl font-semibold text-slate-950">{UI_STRINGS.PROFILE_JOBS_SECTION}</h2>
        {data.jobs.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{data.jobs.map((job) => <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />)}</div>
        ) : (
          <EmptyState icon={FileSearch} title={UI_STRINGS.PROFILE_NO_JOBS} description={UI_STRINGS.PROFILE_NO_JOBS_DESC} />
        )}
      </section>
      <JobModal job={selectedJob} open={Boolean(selectedJob)} onOpenChange={(open) => !open && setSelectedJob(null)} />
      <AiChatPanel profile={data.profile} work={data.work} jobs={data.jobs} />
    </PageWrapper>
  );
}
