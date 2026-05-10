import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthForm } from "@/components/auth/AuthForm";
import { UI_STRINGS, ERROR_MESSAGES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/toast";

// Mocks
vi.mock("@/hooks/useAuth");
vi.mock("react-router-dom");
vi.mock("@/components/ui/toast");
vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: true,
  supabaseConfigMessage: "Supabase not configured",
}));

describe("AuthForm", () => {
  const mockSignIn = vi.fn();
  const mockSignUp = vi.fn();
  const mockNavigate = vi.fn();
  const mockLocation = { state: {} };
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
    (useAuth as any).mockReturnValue({
      signIn: mockSignIn,
      signUp: mockSignUp,
    });
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useLocation as any).mockReturnValue(mockLocation);
  });

  // Rendering Tests (1-7)
  it("1. renders the auth title", () => {
    render(<AuthForm />);
    expect(screen.getByText(UI_STRINGS.AUTH_TITLE)).toBeInTheDocument();
  });

  it("2. renders the login tab trigger", () => {
    render(<AuthForm />);
    expect(screen.getByRole("tab", { name: UI_STRINGS.AUTH_LOGIN_TAB })).toBeInTheDocument();
  });

  it("3. renders the signup tab trigger", () => {
    render(<AuthForm />);
    expect(screen.getByRole("tab", { name: UI_STRINGS.AUTH_SIGNUP_TAB })).toBeInTheDocument();
  });

  it("4. shows login form by default", () => {
    render(<AuthForm />);
    expect(screen.getByLabelText(UI_STRINGS.AUTH_EMAIL_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(UI_STRINGS.AUTH_PASSWORD_LABEL)).toBeInTheDocument();
  });

  it("5. renders email input with required attribute", () => {
    render(<AuthForm />);
    expect(screen.getByLabelText(UI_STRINGS.AUTH_EMAIL_LABEL)).toBeRequired();
  });

  it("6. renders password input with required attribute", () => {
    render(<AuthForm />);
    expect(screen.getByLabelText(UI_STRINGS.AUTH_PASSWORD_LABEL)).toBeRequired();
  });

  it("7. renders the sign in button", () => {
    render(<AuthForm />);
    expect(screen.getByRole("button", { name: UI_STRINGS.AUTH_SIGN_IN_BUTTON })).toBeInTheDocument();
  });

  // Interaction Tests (8-13)
  it("8. switches to signup tab when clicked", async () => {
    render(<AuthForm />);
    await user.click(screen.getByRole("tab", { name: UI_STRINGS.AUTH_SIGNUP_TAB }));
    expect(await screen.findByLabelText(UI_STRINGS.AUTH_NAME_LABEL)).toBeInTheDocument();
  });

  it("9. renders full name input in signup", async () => {
    render(<AuthForm />);
    await user.click(screen.getByRole("tab", { name: UI_STRINGS.AUTH_SIGNUP_TAB }));
    expect(await screen.findByLabelText(UI_STRINGS.AUTH_NAME_LABEL)).toBeInTheDocument();
  });

  it("10. renders email input in signup", async () => {
    render(<AuthForm />);
    await user.click(screen.getByRole("tab", { name: UI_STRINGS.AUTH_SIGNUP_TAB }));
    const emailInputs = await screen.findAllByLabelText(UI_STRINGS.AUTH_EMAIL_LABEL);
    expect(emailInputs.length).toBeGreaterThan(0);
  });

  it("11. renders password input in signup with minLength", async () => {
    render(<AuthForm />);
    await user.click(screen.getByRole("tab", { name: UI_STRINGS.AUTH_SIGNUP_TAB }));
    const passwordInputs = await screen.findAllByLabelText(UI_STRINGS.AUTH_PASSWORD_LABEL);
    expect(passwordInputs[passwordInputs.length - 1]).toHaveAttribute("minLength", "6");
  });

  it("12. renders role selector in signup", async () => {
    render(<AuthForm />);
    await user.click(screen.getByRole("tab", { name: UI_STRINGS.AUTH_SIGNUP_TAB }));
    expect(await screen.findByText("Recruiter")).toBeInTheDocument();
    expect(screen.getByText("Jobseeker")).toBeInTheDocument();
  });

  it("13. renders create account button in signup", async () => {
    render(<AuthForm />);
    await user.click(screen.getByRole("tab", { name: UI_STRINGS.AUTH_SIGNUP_TAB }));
    expect(await screen.findByRole("button", { name: UI_STRINGS.AUTH_CREATE_ACCOUNT_BUTTON })).toBeInTheDocument();
  });

  // Functional Tests (14-20)
  it("14. calls signIn on login submit", async () => {
    render(<AuthForm />);
    const emailInputs = screen.getAllByLabelText(UI_STRINGS.AUTH_EMAIL_LABEL);
    const passwordInputs = screen.getAllByLabelText(UI_STRINGS.AUTH_PASSWORD_LABEL);
    
    fireEvent.change(emailInputs[0], { target: { value: "test@example.com" } });
    fireEvent.change(passwordInputs[0], { target: { value: "password123" } });
    fireEvent.submit(screen.getByRole("button", { name: UI_STRINGS.AUTH_SIGN_IN_BUTTON }).closest("form")!);
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("15. shows loading state during sign in", async () => {
    mockSignIn.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<AuthForm />);
    const form = screen.getByRole("button", { name: UI_STRINGS.AUTH_SIGN_IN_BUTTON }).closest("form")!;
    fireEvent.submit(form);
    expect(await screen.findByText(UI_STRINGS.AUTH_SIGNING_IN)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: UI_STRINGS.AUTH_SIGNING_IN })).toBeDisabled();
  });

  it("16. calls signUp on signup submit", async () => {
    render(<AuthForm />);
    await user.click(screen.getByRole("tab", { name: UI_STRINGS.AUTH_SIGNUP_TAB }));
    
    const nameInput = await screen.findByLabelText(UI_STRINGS.AUTH_NAME_LABEL);
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    
    const emailInputs = await screen.findAllByLabelText(UI_STRINGS.AUTH_EMAIL_LABEL);
    const emailInput = emailInputs.length > 1 ? emailInputs[1] : emailInputs[0];
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    
    const passwordInputs = await screen.findAllByLabelText(UI_STRINGS.AUTH_PASSWORD_LABEL);
    const passwordInput = passwordInputs.length > 1 ? passwordInputs[1] : passwordInputs[0];
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    
    fireEvent.submit(screen.getByRole("button", { name: UI_STRINGS.AUTH_CREATE_ACCOUNT_BUTTON }).closest("form")!);
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "recruiter",
      });
    });
  });

  it("17. shows success toast on login", async () => {
    mockSignIn.mockResolvedValue("recruiter");
    render(<AuthForm />);
    const emailInputs = screen.getAllByLabelText(UI_STRINGS.AUTH_EMAIL_LABEL);
    fireEvent.change(emailInputs[0], { target: { value: "test@example.com" } });
    fireEvent.submit(screen.getByRole("button", { name: UI_STRINGS.AUTH_SIGN_IN_BUTTON }).closest("form")!);
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({ title: UI_STRINGS.WELCOME_BACK });
    });
  });

  it("18. shows error toast on login failure", async () => {
    mockSignIn.mockRejectedValue(new Error("Invalid credentials"));
    render(<AuthForm />);
    const emailInputs = screen.getAllByLabelText(UI_STRINGS.AUTH_EMAIL_LABEL);
    fireEvent.change(emailInputs[0], { target: { value: "test@example.com" } });
    fireEvent.submit(screen.getByRole("button", { name: UI_STRINGS.AUTH_SIGN_IN_BUTTON }).closest("form")!);
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: ERROR_MESSAGES.AUTH_SIGN_IN_FAILED,
        variant: "error",
      }));
    });
  });

  it("19. navigates after successful login", async () => {
    mockSignIn.mockResolvedValue("recruiter");
    render(<AuthForm />);
    const emailInputs = screen.getAllByLabelText(UI_STRINGS.AUTH_EMAIL_LABEL);
    fireEvent.change(emailInputs[0], { target: { value: "test@example.com" } });
    fireEvent.submit(screen.getByRole("button", { name: UI_STRINGS.AUTH_SIGN_IN_BUTTON }).closest("form")!);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
  });

  it("20. handles rate limit error message correctly", async () => {
    const rateLimitError = new Error("Too many requests");
    (rateLimitError as any).status = 429;
    mockSignIn.mockRejectedValue(rateLimitError);
    
    render(<AuthForm />);
    const emailInputs = screen.getAllByLabelText(UI_STRINGS.AUTH_EMAIL_LABEL);
    fireEvent.change(emailInputs[0], { target: { value: "test@example.com" } });
    fireEvent.submit(screen.getByRole("button", { name: UI_STRINGS.AUTH_SIGN_IN_BUTTON }).closest("form")!);
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        description: ERROR_MESSAGES.AUTH_RATE_LIMIT,
      }));
    });
  });
});
