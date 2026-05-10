import { useEffect, useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { FilterBar, type Filters } from "@/components/discover/FilterBar";
import { RecruiterCard } from "@/components/discover/RecruiterCard";
import { SearchBar } from "@/components/discover/SearchBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import type { JobPosting, Profile, RecruiterCardData } from "@/types";
import { UI_STRINGS } from "@/lib/constants";

export function DiscoverPage() {
  const [recruiters, setRecruiters] = useState<RecruiterCardData[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({ company: "", location: "", jobType: "" });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [profilesRes, jobsRes, followsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("role", "recruiter").order("created_at", { ascending: false }),
        supabase.from("job_postings").select("*").eq("is_active", true),
        supabase.from("follows").select("following_id"),
      ]);
      const activeJobs = (jobsRes.data ?? []) as JobPosting[];
      const followCounts = new Map<string, number>();
      (followsRes.data ?? []).forEach((follow) => followCounts.set(follow.following_id, (followCounts.get(follow.following_id) ?? 0) + 1));
      setJobs(activeJobs);
      setRecruiters(((profilesRes.data ?? []) as Profile[]).map((profile) => ({
        ...profile,
        follower_count: followCounts.get(profile.id) ?? 0,
        active_jobs_count: activeJobs.filter((job) => job.recruiter_id === profile.id).length,
      })));
      setLoading(false);
    }
    void load();

    const channel = supabase
      .channel("discover-recruiters")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        void load();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "job_postings" }, () => {
        void load();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "follows" }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return recruiters.filter((recruiter) => {
      const recruiterJobs = jobs.filter((job) => job.recruiter_id === recruiter.id);
      const searchableText = [
        recruiter.full_name,
        recruiter.headline,
        recruiter.company,
        recruiter.location,
        ...recruiterJobs.flatMap((job) => [
          job.title,
          job.company,
          job.location,
          job.job_type,
          ...(job.skills ?? []),
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !normalized || searchableText.includes(normalized);
      const matchesCompany = !filters.company || (recruiter.company ?? "").toLowerCase().includes(filters.company.toLowerCase());
      const matchesLocation = !filters.location || (recruiter.location ?? "").toLowerCase().includes(filters.location.toLowerCase());
      const matchesType = !filters.jobType || recruiterJobs.some((job) => (job.job_type ?? "").toLowerCase().includes(filters.jobType.toLowerCase()));
      return matchesQuery && matchesCompany && matchesLocation && matchesType;
    });
  }, [filters, jobs, query, recruiters]);

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-950">{UI_STRINGS.DISCOVER_TITLE}</h1>
        <p className="mt-2 text-slate-600">{UI_STRINGS.DISCOVER_SUBTITLE}</p>
      </div>
      <div className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <SearchBar value={query} onChange={setQuery} />
        <FilterBar filters={filters} onChange={setFilters} />
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-56" />)}</div>
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filtered.map((recruiter) => <RecruiterCard key={recruiter.id} recruiter={recruiter} />)}</div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <SearchX className="mx-auto h-8 w-8 text-slate-400" />
          <h2 className="mt-3 font-semibold text-slate-950">{UI_STRINGS.DISCOVER_NO_RESULTS}</h2>
          <p className="mt-2 text-sm text-slate-600">{UI_STRINGS.DISCOVER_NO_RESULTS_DESC}</p>
        </div>
      )}
    </PageWrapper>
  );
}
