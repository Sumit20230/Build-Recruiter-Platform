import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import type { Profile } from "@/types";

const mockProfile: Profile = {
  id: "1",
  full_name: "Test Recruiter",
  headline: "Tech Hiring",
  company: "Big Tech",
  location: "Remote",
  bio: "Experienced recruiter",
  avatar_url: null,
  linkedin_url: null,
  role: "recruiter",
  created_at: new Date().toISOString(),
};

describe("ProfileHeader", () => {
  it("renders profile information correctly", () => {
    render(
      <ProfileHeader
        profile={mockProfile}
        followerCount={100}
        canFollow={true}
        isFollowing={false}
        onFollow={vi.fn()}
      />
    );

    expect(screen.getByText("Test Recruiter")).toBeInTheDocument();
    expect(screen.getByText("Tech Hiring")).toBeInTheDocument();
    expect(screen.getByText("Big Tech")).toBeInTheDocument();
    expect(screen.getByText("100 followers")).toBeInTheDocument();
  });

  it("shows follow button when canFollow is true", () => {
    render(
      <ProfileHeader
        profile={mockProfile}
        followerCount={100}
        canFollow={true}
        isFollowing={false}
        onFollow={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /follow/i })).toBeInTheDocument();
  });
});
