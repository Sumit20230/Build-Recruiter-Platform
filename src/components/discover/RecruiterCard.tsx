import { Link } from "react-router-dom";
import { BriefcaseBusiness, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { initials } from "@/lib/utils";
import { UI_STRINGS } from "@/lib/constants";
import type { RecruiterCardData } from "@/types";

export function RecruiterCard({ recruiter }: { recruiter: RecruiterCardData }) {
  return (
    <Link to={`/r/${recruiter.id}`}>
      <Card className="h-full transition hover:-translate-y-1 hover:shadow-soft">
        <CardContent className="p-5">
          <Avatar className="h-16 w-16">
            <AvatarImage src={recruiter.avatar_url ?? undefined} />
            <AvatarFallback>{initials(recruiter.full_name)}</AvatarFallback>
          </Avatar>
          <h3 className="mt-4 text-lg font-semibold text-slate-950">{recruiter.full_name || UI_STRINGS.PROFILE_RECRUITER_DEFAULT}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{recruiter.headline || UI_STRINGS.PROFILE_HEADLINE_DEFAULT}</p>
          <p className="mt-3 text-sm font-medium text-slate-700">{recruiter.company || "Independent"}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" />{recruiter.follower_count}</span>
            <span className="inline-flex items-center gap-1"><BriefcaseBusiness className="h-4 w-4" />{recruiter.active_jobs_count} {UI_STRINGS.JOBS_ACTIVE_LABEL}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
