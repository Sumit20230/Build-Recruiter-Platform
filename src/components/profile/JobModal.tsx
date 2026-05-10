import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
import { initials, cn } from "@/lib/utils";
import { UI_STRINGS } from "@/lib/constants";
import { AppStatus } from "@/types";
import type { JobPosting, JobApplication } from "@/types";

export function JobModal({ job, open, onOpenChange }: { job: JobPosting | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { user, role } = useAuth();
  const { applyForJob, checkHasApplied, loading } = useApplications();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [message, setMessage] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    if (open && job && user && role === "jobseeker") {
      void checkHasApplied(job.id, user.id).then(setApplication);
    }
    if (!open) {
      setShowApplyForm(false);
      setMessage("");
    }
  }, [open, job, user, role, checkHasApplied]);

  async function handleApply() {
    if (!job || !user) return;
    try {
      await applyForJob(job.id, user.id, message);
      // Re-fetch to get the full application object with default status
      void checkHasApplied(job.id, user.id).then(setApplication);
      setShowApplyForm(false);
      toast({ title: UI_STRINGS.TOAST_APPLY_SUCCESS, description: UI_STRINGS.TOAST_APPLY_SUCCESS_DESC(job.title) });
    } catch (error) {
      toast({ 
        title: UI_STRINGS.TOAST_APPLY_FAILED, 
        description: error instanceof Error ? error.message : UI_STRINGS.COMMON_TRY_AGAIN, 
        variant: "error" 
      });
    }
  }

  const statusConfig: Record<string, { label: string; className: string }> = {
    [AppStatus.PENDING]: { label: UI_STRINGS.JOB_MODAL_STATUS_REVIEW, className: "bg-slate-100 text-slate-600 border-slate-200" },
    [AppStatus.REVIEWED]: { label: UI_STRINGS.JOB_MODAL_STATUS_REVIEWED, className: "bg-blue-50 text-blue-700 border-blue-200" },
    [AppStatus.SHORTLISTED]: { label: UI_STRINGS.JOB_MODAL_STATUS_SHORTLIST, className: "bg-green-50 text-green-700 border-green-200" },
    [AppStatus.REJECTED]: { label: UI_STRINGS.JOB_MODAL_STATUS_REJECTED, className: "bg-red-50 text-red-700 border-red-200" },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {job ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between gap-4">
                <DialogTitle className="text-2xl font-bold">{job.title}</DialogTitle>
                {application && (
                  <Badge className={cn("gap-1 px-3 border", statusConfig[application.status].className)}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {statusConfig[application.status].label}
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-base">
                {job.company} · {job.location || UI_STRINGS.JOB_MODAL_LOCATION_FALLBACK} · {UI_STRINGS.JOB_MODAL_POSTED_DATE(formatDistanceToNow(new Date(job.created_at), { addSuffix: true }))}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.job_type ? <Badge className="bg-slate-100 text-slate-700">{job.job_type}</Badge> : null}
              {(job.skills ?? []).map((skill) => <Badge key={skill} className="bg-slate-100 text-slate-700">{skill}</Badge>)}
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">{UI_STRINGS.JOB_MODAL_DESC}</h3>
              <p className="whitespace-pre-line text-sm leading-6 text-slate-700 max-h-[300px] overflow-y-auto pr-2">
                {job.description || UI_STRINGS.JOB_MODAL_NO_DESC}
              </p>
            </div>

            {role === "jobseeker" && !application && (
              <div className="mt-8 border-t pt-6">
                {!showApplyForm ? (
                  <Button className="w-full h-12 text-lg" onClick={() => setShowApplyForm(true)}>
                    {UI_STRINGS.JOB_MODAL_APPLY}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">{UI_STRINGS.JOB_MODAL_MESSAGE}</label>
                      <Textarea 
                        placeholder={UI_STRINGS.JOB_MODAL_PLACEHOLDER}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setShowApplyForm(false)} disabled={loading}>
                        {UI_STRINGS.JOB_MODAL_CANCEL}
                      </Button>
                      <Button className="flex-1" onClick={handleApply} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {UI_STRINGS.JOB_MODAL_SUBMIT}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
