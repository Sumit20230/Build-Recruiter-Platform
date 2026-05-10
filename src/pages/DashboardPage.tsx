import { Link } from "react-router-dom";
import { BriefcaseBusiness, Eye, PenLine, Plus, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { FollowersTab } from "@/components/profile/FollowersTab";
import { ApplicationsTab } from "@/components/profile/ApplicationsTab";
import { UI_STRINGS } from "@/lib/constants";

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ views: 0, followers: 0, jobs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - 30);
      const [views, followers, jobs] = await Promise.all([
        supabase.from("profile_views").select("id", { count: "exact", head: true }).eq("recruiter_id", user.id).gte("viewed_at", since.toISOString()),
        supabase.from("follows").select("id", { count: "exact", head: true }).eq("following_id", user.id),
        supabase.from("job_postings").select("id", { count: "exact", head: true }).eq("recruiter_id", user.id).eq("is_active", true),
      ]);
      setStats({ views: views.count ?? 0, followers: followers.count ?? 0, jobs: jobs.count ?? 0 });
      setLoading(false);
    }
    void load();

    if (!user) return;
    const channel = supabase
      .channel(`dashboard-stats-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "profile_views", filter: `recruiter_id=eq.${user.id}` }, () => {
        void load();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "follows", filter: `following_id=eq.${user.id}` }, () => {
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

  const statsItems = [
    { label: UI_STRINGS.DASHBOARD_STAT_VIEWS, value: stats.views, icon: Eye },
    { label: UI_STRINGS.DASHBOARD_STAT_FOLLOWERS, value: stats.followers, icon: Users },
    { label: UI_STRINGS.DASHBOARD_STAT_JOBS, value: stats.jobs, icon: BriefcaseBusiness },
  ];

  return (
    <PageWrapper className="pb-20">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">{UI_STRINGS.DASHBOARD_TITLE}</h1>
          <p className="mt-1 text-slate-600">{UI_STRINGS.DASHBOARD_SUBTITLE}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/profile/edit"><PenLine className="h-4 w-4" />{UI_STRINGS.DASHBOARD_EDIT_PROFILE}</Link></Button>
          <Button asChild variant="accent"><Link to="/profile/edit"><Plus className="h-4 w-4" />{UI_STRINGS.DASHBOARD_ADD_JOB}</Link></Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 w-full md:w-auto overflow-x-auto whitespace-nowrap">
          <TabsTrigger value="overview" className="gap-2 px-6">
            <BarChart3 className="h-4 w-4" /> {UI_STRINGS.DASHBOARD_TAB_OVERVIEW}
          </TabsTrigger>
          <TabsTrigger value="applications" className="gap-2 px-6">
            <BriefcaseBusiness className="h-4 w-4" /> {UI_STRINGS.DASHBOARD_TAB_APPLICATIONS}
          </TabsTrigger>
          <TabsTrigger value="followers" className="gap-2 px-6">
            <Users className="h-4 w-4" /> {UI_STRINGS.DASHBOARD_TAB_FOLLOWERS}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 outline-none">
          <div className="grid gap-4 md:grid-cols-3">
            {statsItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
                      <Icon className="h-4 w-4 text-teal-700" />
                      {item.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? <Skeleton className="h-10 w-24" /> : <p className="text-4xl font-bold text-slate-900">{item.value}</p>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <Card className="border-teal-100 bg-teal-50/20">
            <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-teal-900">{UI_STRINGS.DASHBOARD_PROFILE_SECTION}</h2>
                <p className="text-sm text-teal-700/70">{UI_STRINGS.DASHBOARD_PROFILE_DESC}</p>
              </div>
              <Button asChild variant="outline" className="bg-white border-teal-200 text-teal-700 hover:bg-teal-50">
                <Link to={`/r/${user?.id}`}>{UI_STRINGS.DASHBOARD_VIEW_PROFILE}</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="outline-none">
          {user && <ApplicationsTab recruiterId={user.id} />}
        </TabsContent>

        <TabsContent value="followers" className="outline-none">
          {user && <FollowersTab recruiterId={user.id} />}
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
