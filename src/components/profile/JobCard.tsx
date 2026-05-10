import { formatDistanceToNow } from "date-fns";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobPosting } from "@/types";

export function JobCard({ job, onClick }: { job: JobPosting; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left">
      <Card className="h-full transition hover:-translate-y-1 hover:shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">{job.title}</CardTitle>
          <p className="text-sm text-slate-600">{job.company}</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {job.job_type ? <Badge>{job.job_type}</Badge> : null}
            {job.location ? <span className="inline-flex items-center gap-1 text-sm text-slate-600"><MapPin className="h-4 w-4" />{job.location}</span> : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(job.skills ?? []).slice(0, 5).map((skill) => <Badge key={skill} className="bg-slate-100 text-slate-700">{skill}</Badge>)}
          </div>
          <p className="mt-4 text-xs text-slate-500">Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</p>
        </CardContent>
      </Card>
    </button>
  );
}
