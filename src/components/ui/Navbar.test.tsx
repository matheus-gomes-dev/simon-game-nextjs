import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/ui/Navbar";

// Mock next-auth/react
const signOutMock = vi.fn();
const useSessionMock = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
  signOut: (...args: unknown[]) => signOutMock(...args),
}));

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Log In and Register links when unauthenticated", () => {
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navbar />);

    expect(screen.getByText("Log In")).toBeTruthy();
    expect(screen.getByText("Register")).toBeTruthy();
    expect(screen.queryByText("Log Out")).toBeNull();
    expect(screen.queryByText("History")).toBeNull();
  });

  it("shows user name, History link, and Log Out button when authenticated", () => {
    useSessionMock.mockReturnValue({
      data: {
        user: {
          id: "123",
          name: "Test User",
          email: "test@example.com",
          username: "testuser",
        },
      },
      status: "authenticated",
    });

    render(<Navbar />);

    expect(screen.getByText("Test User")).toBeTruthy();
    expect(screen.getByText("Log Out")).toBeTruthy();
    expect(screen.getByText("History")).toBeTruthy();
    expect(screen.queryByText("Log In")).toBeNull();
    expect(screen.queryByText("Register")).toBeNull();
  });

  it("renders History link pointing to /history", () => {
    useSessionMock.mockReturnValue({
      data: {
        user: {
          id: "123",
          name: "Test User",
          email: "test@example.com",
          username: "testuser",
        },
      },
      status: "authenticated",
    });

    render(<Navbar />);

    const historyLink = screen.getByText("History");
    expect(historyLink.closest("a")?.getAttribute("href")).toBe("/history");
  });

  it("calls signOut with callbackUrl when Log Out is clicked", () => {
    useSessionMock.mockReturnValue({
      data: {
        user: {
          id: "123",
          name: "Test User",
          email: "test@example.com",
          username: "testuser",
        },
      },
      status: "authenticated",
    });

    render(<Navbar />);

    fireEvent.click(screen.getByText("Log Out"));

    expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: "/" });
  });

  it("shows a loading placeholder while session is loading", () => {
    useSessionMock.mockReturnValue({ data: null, status: "loading" });

    render(<Navbar />);

    expect(screen.queryByText("Log In")).toBeNull();
    expect(screen.queryByText("Log Out")).toBeNull();
    expect(screen.queryByText("Register")).toBeNull();
  });

  it("renders Leaderboard link for all users", () => {
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navbar />);

    const leaderboardLink = screen.getByText("Leaderboard");
    expect(leaderboardLink).toBeTruthy();
    expect(leaderboardLink.closest("a")?.getAttribute("href")).toBe("/leaderboard");
  });

  it("renders Leaderboard link when authenticated", () => {
    useSessionMock.mockReturnValue({
      data: {
        user: {
          id: "123",
          name: "Test User",
          email: "test@example.com",
          username: "testuser",
        },
      },
      status: "authenticated",
    });

    render(<Navbar />);

    expect(screen.getByText("Leaderboard")).toBeTruthy();
  });

  it("renders the Simon Game link to home page", () => {
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navbar />);

    const homeLink = screen.getByText("Simon Game");
    expect(homeLink).toBeTruthy();
    expect(homeLink.closest("a")?.getAttribute("href")).toBe("/");
  });
});
