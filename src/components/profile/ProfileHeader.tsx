import { MapPin, Building2, Users, BriefcaseBusiness, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/utils";
import { UI_STRINGS } from "@/lib/constants";
import type { Profile } from "@/types";

interface ProfileHeaderProps {
  profile: Profile;
  followerCount: number;
  canFollow: boolean;
  isFollowing: boolean;
  onFollow: () => void;
}

export function ProfileHeader({ profile, followerCount, canFollow, isFollowing, onFollow }: ProfileHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="h-32 bg-gradient-to-r from-teal-600 via-teal-700 to-slate-900" />
      <div className="px-6 pb-6">
        <div className="relative -mt-16 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <Avatar className="h-32 w-32 border-4 border-white shadow-soft ring-0">
            <AvatarImage src={profile.avatar_url ?? undefined} />
            <AvatarFallback className="text-3xl font-bold bg-slate-50 text-slate-400">{initials(profile.full_name)}</AvatarFallback>
          </Avatar>
          
          {canFollow && (
            <Button 
              onClick={onFollow}
              variant={isFollowing ? "outline" : "default"}
              className={`h-11 px-8 font-semibold transition-all duration-300 ${
                !isFollowing 
                ? "bg-teal-700 hover:bg-teal-800 text-white shadow-md hover:shadow-lg translate-y-0 hover:-translate-y-0.5" 
                : "border-slate-200 text-slate-600"
              }`}
            >
              {isFollowing ? UI_STRINGS.FOLLOWING : UI_STRINGS.FOLLOW}
            </Button>
          )}
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">{profile.full_name || UI_STRINGS.PROFILE_RECRUITER_DEFAULT}</h1>
            <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-50 font-medium border-teal-100">
              {UI_STRINGS.ROLE_RECRUITER}
            </Badge>
          </div>
          <p className="mt-2 text-lg font-medium text-slate-600 max-w-2xl leading-relaxed">
            {profile.headline || UI_STRINGS.PROFILE_HEADLINE_DEFAULT}
          </p>
          
          <div className="mt-6 flex flex-wrap items-center gap-y-3 gap-x-6 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span>{profile.company || UI_STRINGS.PROFILE_INDEPENDENT}</span>
            </div>
            {profile.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-slate-900">{UI_STRINGS.PROFILE_FOLLOWERS_COUNT(followerCount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
