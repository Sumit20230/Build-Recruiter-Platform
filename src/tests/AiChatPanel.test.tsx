import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AiChatPanel } from "@/components/profile/AiChatPanel";
import { UI_STRINGS } from "@/lib/constants";

// Mock the AI module
vi.mock("@/lib/gemini", () => ({
  askAboutRecruiter: vi.fn().mockResolvedValue("This is a mock AI response."),
}));

const mockProfile = {
  id: "r1",
  full_name: "Maya Recruiter",
  company: "Big Tech",
  headline: "Tech Hiring Expert",
  bio: "Passionate about building teams.",
};

describe("AiChatPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the toggle button with recruiter name", () => {
    render(<AiChatPanel profile={mockProfile as any} work={[]} jobs={[]} />);
    expect(screen.getByText(/Ask AI about Maya/i)).toBeInTheDocument();
  });

  it("opens the chat panel when clicked", () => {
    render(<AiChatPanel profile={mockProfile as any} work={[]} jobs={[]} />);
    const button = screen.getByText(/Ask AI about Maya/i);
    fireEvent.click(button);
    expect(screen.getByText(UI_STRINGS.AI_CHAT_TITLE)).toBeInTheDocument();
  });

  it("sends a message and displays the AI response", async () => {
    render(<AiChatPanel profile={mockProfile as any} work={[]} jobs={[]} />);
    fireEvent.click(screen.getByText(/Ask AI about Maya/i));
    
    const input = screen.getByPlaceholderText(UI_STRINGS.CHAT_PLACEHOLDER);
    fireEvent.change(input, { target: { value: "Tell me about Maya" } });
    fireEvent.submit(input.closest("form")!);

    expect(screen.getByText("Tell me about Maya")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText("This is a mock AI response.")).toBeInTheDocument();
    });
  });
});
