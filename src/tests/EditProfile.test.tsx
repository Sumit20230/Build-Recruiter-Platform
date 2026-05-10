import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { EditProfilePage } from "@/pages/EditProfilePage";
import { UI_STRINGS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { MemoryRouter } from "react-router-dom";

const createMockChain = (data: any = []) => {
  const promise = Promise.resolve({ data, error: null });
  const chain: any = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    order: vi.fn(() => chain),
    single: vi.fn(() => promise),
    maybeSingle: vi.fn(() => promise),
    update: vi.fn(() => chain),
    insert: vi.fn(() => promise),
    delete: vi.fn(() => chain),
    then: (onFulfilled: any) => promise.then(onFulfilled),
    catch: (onRejected: any) => promise.catch(onRejected),
    finally: (onFinally: any) => promise.finally(onFinally),
  };
  return chain;
};

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

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

vi.mock("@/components/ui/toast", () => ({
  toast: vi.fn(),
}));

const mockProfile = {
  id: "u1",
  full_name: "Test User",
  headline: "Test Headline",
  bio: "Test Bio",
};

describe("EditProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: { id: "u1" } });
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === "profiles") return createMockChain(mockProfile);
      return createMockChain([]);
    });
  });

  it("renders the page title", async () => {
    render(<MemoryRouter><EditProfilePage /></MemoryRouter>);
    expect(await screen.findByText(UI_STRINGS.EDIT_PROFILE_TITLE)).toBeInTheDocument();
  });

  it("loads profile data into inputs", async () => {
    render(<MemoryRouter><EditProfilePage /></MemoryRouter>);
    const nameInput = await screen.findByLabelText(/full name/i);
    expect(nameInput).toHaveValue("Test User");
  });
});
