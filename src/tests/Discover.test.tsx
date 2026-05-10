import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { DiscoverPage } from "@/pages/DiscoverPage";
import { UI_STRINGS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { MemoryRouter } from "react-router-dom";

// Fix for chaining mock
const createMockChain = (data: any = []) => {
  const promise = Promise.resolve({ data, error: null });
  const chain: any = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    order: vi.fn(() => chain),
    single: vi.fn(() => promise),
    maybeSingle: vi.fn(() => promise),
    then: (onFulfilled: any) => promise.then(onFulfilled),
    catch: (onRejected: any) => promise.catch(onRejected),
    finally: (onFinally: any) => promise.finally(onFinally),
  };
  return chain;
};

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
  },
}));

const mockProfiles = [
  { id: "1", full_name: "Alice Recruiter", company: "TechCorp", location: "San Francisco", role: "recruiter" },
  { id: "2", full_name: "Bob Hiring", company: "StartupInc", location: "New York", role: "recruiter" },
];

const mockJobs = [
  { id: "j1", recruiter_id: "1", title: "Frontend Dev", company: "TechCorp", location: "Remote", job_type: "Full-time", is_active: true, skills: ["React"] },
];

describe("DiscoverPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === "profiles") return createMockChain(mockProfiles);
      if (table === "job_postings") return createMockChain(mockJobs);
      return createMockChain([]);
    });
  });

  it("renders the discover title", async () => {
    render(<MemoryRouter><DiscoverPage /></MemoryRouter>);
    expect(await screen.findByText(UI_STRINGS.DISCOVER_TITLE)).toBeInTheDocument();
  });

  it("displays recruiters from mock data", async () => {
    render(<MemoryRouter><DiscoverPage /></MemoryRouter>);
    expect(await screen.findByText("Alice Recruiter")).toBeInTheDocument();
    expect(screen.getByText("Bob Hiring")).toBeInTheDocument();
  });
});
