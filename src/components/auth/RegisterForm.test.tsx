import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import RegisterForm from "@/components/auth/RegisterForm";

// Mock next/navigation
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const originalFetch = global.fetch;

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("renders all three input fields and submit button", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText("Username")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByLabelText("Password")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create Account" })).toBeTruthy();
  });

  it("shows validation errors for empty form submit", async () => {
    render(<RegisterForm />);

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(screen.getByText(/Username must be at least 3 characters/)).toBeTruthy();
    });
    expect(screen.getByText(/Please enter a valid email address/)).toBeTruthy();
    expect(screen.getByText(/Password must be at least 8 characters/)).toBeTruthy();
  });

  it("shows error for invalid email", async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "securepass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/)).toBeTruthy();
    });
  });

  it("shows error for short password", async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters/)).toBeTruthy();
    });
  });

  it("calls fetch with correct payload and redirects to /login on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: "Account created successfully" }),
    });
    global.fetch = fetchMock;

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        }),
      });
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login?registered=true");
    });
  });

  it("displays field-specific errors from a 409 server response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          errors: { email: ["An account with this email already exists"] },
        }),
    });
    global.fetch = fetchMock;

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "taken@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(
        screen.getByText("An account with this email already exists")
      ).toBeTruthy();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("displays username-specific error from a 409 server response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          errors: { username: ["This username is already taken"] },
        }),
    });
    global.fetch = fetchMock;

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "takenuser" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(
        screen.getByText("This username is already taken")
      ).toBeTruthy();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("displays generic message on network error", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("Network failure"));
    global.fetch = fetchMock;

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(
        screen.getByText(/Network error. Please check your connection/)
      ).toBeTruthy();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("disables submit button while loading", async () => {
    // Create a fetch that never resolves during the test
    let resolveFetch: (value: unknown) => void;
    const fetchMock = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );
    global.fetch = fetchMock;

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      const button = screen.getByRole("button", { name: "Creating account..." });
      expect(button).toBeTruthy();
      expect((button as HTMLButtonElement).disabled).toBe(true);
    });

    // Resolve to clean up and wrap in act to avoid React warnings
    await act(async () => {
      resolveFetch!({
        ok: true,
        json: () => Promise.resolve({ message: "Account created successfully" }),
      });
    });
  });
});
