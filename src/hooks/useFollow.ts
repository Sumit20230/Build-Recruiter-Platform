import { supabase } from "@/lib/supabase";

export function useFollow() {
  async function follow(followerId: string, followingId: string) {
    const { error } = await supabase.from("follows").insert({ follower_id: followerId, following_id: followingId });
    if (error) throw error;

    // Create notification for recruiter
    await supabase.from("notifications").insert({
      user_id: followingId,
      title: "New Follower",
      message: "A candidate has started following your profile.",
      type: "follow"
    });
  }

  async function unfollow(followerId: string, followingId: string) {
    const { error } = await supabase.from("follows").delete().eq("follower_id", followerId).eq("following_id", followingId);
    if (error) throw error;
  }

  return { follow, unfollow };
}
