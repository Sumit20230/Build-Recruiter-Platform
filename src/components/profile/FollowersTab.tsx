import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { UI_STRINGS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { initials } from "@/lib/utils";
import type { Profile } from "@/types";

export function FollowersTab({ recruiterId }: { recruiterId: string }) {
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // 1. Get follower IDs
        const { data: follows, error: followsError } = await supabase
          .from("follows")
          .select("follower_id")
          .eq("following_id", recruiterId);

        if (followsError) throw followsError;
        if (!follows || follows.length === 0) {
          setFollowers([]);
          return;
        }

        const followerIds = follows.map(f => f.follower_id);

        // 2. Get profiles for those followers
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", followerIds);

        if (profilesError) throw profilesError;
        setFollowers(profiles || []);
      } catch (error) {
        console.error("Error loading followers:", error);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [recruiterId]);

  if (loading) {
    return <div className="space-y-4"><Skeleton className="h-20" /><Skeleton className="h-20" /></div>;
  }

  if (!followers.length) {
    return <EmptyState icon={Users} title={UI_STRINGS.EMPTY_FOLLOWERS_TITLE} description={UI_STRINGS.EMPTY_FOLLOWERS_DESC} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {followers.map((profile) => (
        <Card key={profile.id}>
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar_url ?? undefined} />
              <AvatarFallback>{initials(profile.full_name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{profile.full_name}</p>
              <p className="text-sm text-slate-600 line-clamp-1">{profile.headline || UI_STRINGS.JOBSEEKER}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
