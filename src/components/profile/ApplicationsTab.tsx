import { useEffect, useState } from "react";
import { BriefcaseBusiness, Mail, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toast";
import { useApplications } from "@/hooks/useApplications";
import { initials, cn } from "@/lib/utils";
import { AppStatus } from "@/types";
import { UI_STRINGS } from "@/lib/constants";
import type { JobApplication, ApplicationStatus } from "@/types";

export function ApplicationsTab({ recruiterId }: { recruiterId: string }) {
  const { getRecruiterApplications, updateApplicationStatus, loading } = useApplications();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    void getRecruiterApplications(recruiterId)
      .then(setApplications)
      .catch(err => {
        setError(err instanceof Error ? err.message : UI_STRINGS.APPLICATIONS_ERR_LOAD);
      });
  }, [recruiterId, getRecruiterApplications]);

  async function handleStatusUpdate(id: string, status: ApplicationStatus) {
    setUpdatingId(id);
    try {
      await updateApplicationStatus(id, status);
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
      toast({ 
        title: UI_STRINGS.TOAST_STATUS_UPDATED, 
        description: UI_STRINGS.TOAST_STATUS_UPDATED_DESC(status) 
      });
    } catch (err) {
      toast({ 
        title: UI_STRINGS.TOAST_UPDATE_FAILED, 
        description: err instanceof Error ? err.message : UI_STRINGS.COMMON_TRY_AGAIN, 
        variant: "error" 
      });
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading && !applications.length) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="border-slate-100">
            <CardContent className="p-5 flex gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-red-50/30 border-red-100">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-red-900">{UI_STRINGS.CONNECTION_ERROR}</h3>
        <p className="text-sm text-red-700 max-w-xs mt-2">{error}</p>
        <Button variant="outline" className="mt-6 border-red-200 text-red-700 hover:bg-red-50" onClick={() => window.location.reload()}>
          {UI_STRINGS.APPLICATIONS_TRY_AGAIN}
        </Button>
      </div>
    );
  }

  if (!applications.length) {
    return <EmptyState icon={BriefcaseBusiness} title={UI_STRINGS.APPLICATIONS_NONE} description={UI_STRINGS.APPLICATIONS_NONE_DESC} />;
  }

  return (
    <div className="space-y-4 pb-10">
      {applications.map((app) => (
        <Card key={app.id} className={cn(
          "transition-all border-slate-100",
          app.status === AppStatus.SHORTLISTED && "border-green-200 bg-green-50/10",
          app.status === AppStatus.REJECTED && "opacity-70 grayscale-[0.5]"
        )}>
          <CardContent className="flex flex-col gap-5 p-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-slate-100">
                <AvatarImage src={app.profiles?.avatar_url ?? undefined} />
                <AvatarFallback>{initials(app.profiles?.full_name)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-950">{app.profiles?.full_name}</h3>
                  <div className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                    app.status === AppStatus.PENDING && "bg-slate-100 text-slate-600 border-slate-200",
                    app.status === AppStatus.SHORTLISTED && "bg-green-100 text-green-700 border-green-200",
                    app.status === AppStatus.REJECTED && "bg-red-100 text-red-700 border-red-200",
                    app.status === AppStatus.REVIEWED && "bg-blue-100 text-blue-700 border-blue-200"
                  )}>
                    {app.status}
                  </div>
                </div>
                <p className="text-sm text-slate-600 font-medium">{UI_STRINGS.APPLICATIONS_APPLIED_FOR}{app.job_postings?.title}</p>
                {app.message && (
                  <div className="mt-3 flex items-start gap-2 rounded-md bg-white border border-slate-100 p-3 text-sm italic text-slate-600 shadow-sm">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    "{app.message}"
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3 shrink-0">
              <p className="text-xs text-slate-500">
                {UI_STRINGS.APPLICATIONS_APPLIED_ON} {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              
              <div className="flex items-center gap-2">
                {app.status === AppStatus.PENDING && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-9 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleStatusUpdate(app.id, AppStatus.REJECTED)}
                      disabled={updatingId === app.id}
                    >
                      {updatingId === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                      {UI_STRINGS.APPLICATIONS_REJECT}
                    </Button>
                    <Button 
                      size="sm" 
                      className="h-9 bg-green-600 hover:bg-green-700 text-white border-none"
                      onClick={() => handleStatusUpdate(app.id, AppStatus.SHORTLISTED)}
                      disabled={updatingId === app.id}
                    >
                      {updatingId === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                      {UI_STRINGS.APPLICATIONS_SHORTLIST}
                    </Button>
                  </>
                )}
                {app.status !== AppStatus.PENDING && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-9 text-slate-500 hover:text-slate-900"
                    onClick={() => handleStatusUpdate(app.id, AppStatus.PENDING)}
                    disabled={updatingId === app.id}
                  >
                    {UI_STRINGS.APPLICATIONS_RESET}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
