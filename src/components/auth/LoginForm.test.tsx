import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import LoginForm from "@/components/auth/LoginForm";

// Mock next/navigation
const pushMock = vi.fn();
const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

// Mock next-auth/react
const signInMock = vi.fn();
vi.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => signInMock(...args),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email and password fields and submit button", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByLabelText("Password")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Log In" })).toBeTruthy();
  });

  it("shows validation errors for empty form submit", async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/)).toBeTruthy();
    });
    expect(screen.getByText(/Password is required/)).toBeTruthy();
  });

  it("shows error for invalid email", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "mypassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/)).toBeTruthy();
    });
  });

  it("calls signIn with correct args and redirects to /play on success", async () => {
    signInMock.mockResolvedValue({ ok: true, error: null });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      });
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/play");
    });
  });

  it("shows generic error message on invalid credentials", async () => {
    signInMock.mockResolvedValue({ ok: false, error: "CredentialsSignin" });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeTruthy();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("shows generic error on network failure", async () => {
    signInMock.mockRejectedValue(new Error("Network failure"));

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(
        screen.getByText(/Network error. Please check your connection/)
      ).toBeTruthy();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("disables submit button while loading", async () => {
    let resolveSignIn: (value: unknown) => void;
    signInMock.mockReturnValue(
      new Promise((resolve) => {
        resolveSignIn = resolve;
      })
    );

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      const button = screen.getByRole("button", { name: "Logging in..." });
      expect(button).toBeTruthy();
      expect((button as HTMLButtonElement).disabled).toBe(true);
    });

    // Resolve to clean up and wrap in act to avoid React warnings
    await act(async () => {
      resolveSignIn!({ ok: true, error: null });
    });
  });

  it("does not call signIn when validation fails", async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/)).toBeTruthy();
    });

    expect(signInMock).not.toHaveBeenCalled();
  });
});
