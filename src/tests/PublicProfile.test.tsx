import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { PublicProfilePage } from "@/pages/PublicProfilePage";
import { UI_STRINGS } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { usePublicRecruiterProfile } from "@/hooks/useProfile";
import { useFollow } from "@/hooks/useFollow";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/useProfile", () => ({
  usePublicRecruiterProfile: vi.fn(),
}));

vi.mock("@/hooks/useFollow", () => ({
  useFollow: vi.fn(() => ({
    follow: vi.fn(),
    unfollow: vi.fn(),
  })),
}));

vi.mock("@/components/ui/toast", () => ({
  toast: vi.fn(),
}));

// Mock AI components to avoid side effects
vi.mock("@/components/profile/AiChatPanel", () => ({
  AiChatPanel: () => <div data-testid="ai-chat">AI Chat</div>,
}));

const mockData = {
  profile: {
    id: "r1",
    full_name: "Maya Recruiter",
    headline: "Tech Hiring Expert",
    company: "Big Tech",
    location: "London",
    bio: "Passionate about building teams.",
  },
  work: [
    { id: "w1", title: "Senior Recruiter", company: "Big Tech", start_date: "2020-01-01", description: "Hiring engineers." }
  ],
  jobs: [
    { id: "j1", title: "Frontend Engineer", company: "Big Tech", location: "Remote", job_type: "Full-time", description: "React role.", skills: ["React", "TypeScript"], is_active: true, created_at: new Date().toISOString() }
  ],
  followerCount: 150,
  viewCount: 1200,
  isFollowing: false
};

const renderWithRouter = () => {
  return render(
    <MemoryRouter initialEntries={["/r/r1"]}>
      <Routes>
        <Route path="/r/:id" element={<PublicProfilePage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("PublicProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: { id: "u1" }, role: "jobseeker" });
    (usePublicRecruiterProfile as any).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      setData: vi.fn(),
    });
  });

  it("renders the recruiter full name", async () => {
    renderWithRouter();
    expect(await screen.findByText(mockData.profile.full_name)).toBeInTheDocument();
  });

  it("renders the headline correctly", async () => {
    renderWithRouter();
    expect(await screen.findByText(mockData.profile.headline)).toBeInTheDocument();
  });

  it("displays the correct follower count", async () => {
    renderWithRouter();
    expect(await screen.findByText("150 followers")).toBeInTheDocument();
  });

  it("displays total views stat", async () => {
    renderWithRouter();
    expect(await screen.findByText(UI_STRINGS.PROFILE_TOTAL_VIEWS)).toBeInTheDocument();
    expect(screen.getByText("1200")).toBeInTheDocument();
  });

  it("renders work experience section title", async () => {
    renderWithRouter();
    expect(await screen.findByText(UI_STRINGS.PROFILE_WORK_SECTION)).toBeInTheDocument();
  });

  it("renders active job postings section", async () => {
    renderWithRouter();
    expect(await screen.findByText(UI_STRINGS.PROFILE_JOBS_SECTION)).toBeInTheDocument();
  });

  it("shows follow button for jobseekers", async () => {
    renderWithRouter();
    expect(await screen.findByText(UI_STRINGS.FOLLOW)).toBeInTheDocument();
  });

  it("hides follow button when user is a recruiter", async () => {
    (useAuth as any).mockReturnValue({ user: { id: "u2" }, role: "recruiter" });
    renderWithRouter();
    await waitFor(() => {
      expect(screen.queryByText(UI_STRINGS.FOLLOW)).not.toBeInTheDocument();
    });
  });

  it("opens job modal when job card is clicked", async () => {
    renderWithRouter();
    const jobCard = await screen.findByText("Frontend Engineer");
    fireEvent.click(jobCard);
    expect(await screen.findByText(UI_STRINGS.JOB_MODAL_DESC)).toBeInTheDocument();
  });

  it("renders AI toolkit tabs", async () => {
    renderWithRouter();
    expect(await screen.findByText(UI_STRINGS.RESUME_ANALYZER_TITLE)).toBeInTheDocument();
    expect(screen.getByText(UI_STRINGS.INTERVIEW_STRATEGY_TITLE)).toBeInTheDocument();
    expect(screen.getByText(UI_STRINGS.OUTREACH_GEN_TITLE)).toBeInTheDocument();
  });

  it("shows empty state when no jobs are available", async () => {
    (usePublicRecruiterProfile as any).mockReturnValue({
      data: { ...mockData, jobs: [] },
      loading: false,
      error: null,
      setData: vi.fn(),
    });
    
    renderWithRouter();
    expect(await screen.findByText(UI_STRINGS.PROFILE_NO_JOBS)).toBeInTheDocument();
  });
});
