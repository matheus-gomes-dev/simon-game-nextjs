import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "@/components/ui/Navbar";

// Mock next/navigation
const usePathnameMock = vi.fn(() => "/");
vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

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
    usePathnameMock.mockReturnValue("/");
    document.body.style.overflow = "";
  });

  it("shows Log In and Register links when unauthenticated", () => {
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navbar />);

    expect(screen.getAllByText("Log In").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Register").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Log Out")).toBeNull();
    expect(screen.queryByText("History")).toBeNull();
    expect(screen.queryByText("Play")).toBeNull();
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

    expect(screen.getAllByText("Test User").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Log Out").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("History").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Play").length).toBeGreaterThanOrEqual(1);
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

    const historyLinks = screen.getAllByText("History");
    expect(historyLinks[0].closest("a")?.getAttribute("href")).toBe("/history");
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

    const logoutButtons = screen.getAllByText("Log Out");
    fireEvent.click(logoutButtons[0]);

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

    const leaderboardLinks = screen.getAllByText("Leaderboard");
    expect(leaderboardLinks.length).toBeGreaterThanOrEqual(1);
    expect(leaderboardLinks[0].closest("a")?.getAttribute("href")).toBe("/leaderboard");
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

    expect(screen.getAllByText("Leaderboard").length).toBeGreaterThanOrEqual(1);
  });

  it("renders the Simon Game link to home page", () => {
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navbar />);

    const homeLink = screen.getByText("Simon Game");
    expect(homeLink).toBeTruthy();
    expect(homeLink.closest("a")?.getAttribute("href")).toBe("/");
  });

  it("renders a hamburger menu button", () => {
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navbar />);

    const menuButton = screen.getByLabelText("Open menu");
    expect(menuButton).toBeTruthy();
  });

  it("toggles mobile menu on hamburger click", () => {
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navbar />);

    const menuButton = screen.getByLabelText("Open menu");
    fireEvent.click(menuButton);

    // After opening, button label changes
    expect(screen.getByLabelText("Close menu")).toBeTruthy();

    // Mobile menu shows duplicate links
    const leaderboardLinks = screen.getAllByText("Leaderboard");
    expect(leaderboardLinks.length).toBe(2);
  });

  it("closes mobile menu on Escape key", () => {
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navbar />);

    // Open menu
    fireEvent.click(screen.getByLabelText("Open menu"));
    expect(screen.getByLabelText("Close menu")).toBeTruthy();

    // Press Escape
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByLabelText("Open menu")).toBeTruthy();
  });

  // New tests for US-9 Navbar UX Enhancements

  describe("Active Page Indication", () => {
    it("highlights Leaderboard link when on /leaderboard", () => {
      usePathnameMock.mockReturnValue("/leaderboard");
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      render(<Navbar />);

      const leaderboardLinks = screen.getAllByText("Leaderboard");
      const desktopLink = leaderboardLinks[0];
      expect(desktopLink.className).toContain("text-white");
      expect(desktopLink.className).toContain("border-indigo-600");
    });

    it("highlights Play link when on /play for authenticated user", () => {
      usePathnameMock.mockReturnValue("/play");
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

      const playLinks = screen.getAllByText("Play");
      const desktopLink = playLinks[0];
      expect(desktopLink.className).toContain("text-white");
      expect(desktopLink.className).toContain("border-indigo-600");
    });

    it("highlights History link when on /history", () => {
      usePathnameMock.mockReturnValue("/history");
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

      const historyLinks = screen.getAllByText("History");
      const desktopLink = historyLinks[0];
      expect(desktopLink.className).toContain("text-white");
      expect(desktopLink.className).toContain("border-indigo-600");
    });

    it("highlights Login link when on /login", () => {
      usePathnameMock.mockReturnValue("/login");
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      render(<Navbar />);

      const loginLinks = screen.getAllByText("Log In");
      const desktopLink = loginLinks[0];
      expect(desktopLink.className).toContain("text-white");
      expect(desktopLink.className).toContain("border-indigo-600");
    });
  });

  describe("Focus Indicators (WCAG 2.4.7)", () => {
    it("all navigation links have focus-visible:ring styles", () => {
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

      const leaderboardLinks = screen.getAllByText("Leaderboard");
      expect(leaderboardLinks[0].className).toContain("focus-visible:ring-2");
      expect(leaderboardLinks[0].className).toContain("focus-visible:ring-white");

      const playLinks = screen.getAllByText("Play");
      expect(playLinks[0].className).toContain("focus-visible:ring-2");

      const historyLinks = screen.getAllByText("History");
      expect(historyLinks[0].className).toContain("focus-visible:ring-2");
    });

    it("sign-out button has focus-visible:ring styles", () => {
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

      const logoutButtons = screen.getAllByText("Log Out");
      expect(logoutButtons[0].className).toContain("focus-visible:ring-2");
      expect(logoutButtons[0].className).toContain("focus-visible:ring-white");
    });

    it("hamburger button has focus-visible:ring styles", () => {
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      render(<Navbar />);

      const hamburgerButton = screen.getByLabelText("Open menu");
      expect(hamburgerButton.className).toContain("focus-visible:ring-2");
      expect(hamburgerButton.className).toContain("focus-visible:ring-white");
    });

    it("Simon Game home link has focus-visible:ring styles", () => {
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      render(<Navbar />);

      const homeLink = screen.getByText("Simon Game");
      expect(homeLink.className).toContain("focus-visible:ring-2");
      expect(homeLink.className).toContain("focus-visible:ring-white");
    });
  });

  describe("Navigation Landmark (WCAG 2.4.1)", () => {
    it("nav element has aria-label=\"Main navigation\"", () => {
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      render(<Navbar />);

      const nav = screen.getByRole("navigation", { name: "Main navigation" });
      expect(nav).toBeTruthy();
    });
  });

  describe("Play Link for Authenticated Users", () => {
    it("shows Play link for authenticated users", () => {
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

      const playLinks = screen.getAllByText("Play");
      expect(playLinks[0]).toBeTruthy();
      expect(playLinks[0].closest("a")?.getAttribute("href")).toBe("/play");
    });

    it("does not show Play link for unauthenticated users", () => {
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      render(<Navbar />);

      expect(screen.queryByText("Play")).toBeNull();
    });
  });

  describe("Loading Skeleton", () => {
    it("shows multiple skeleton blocks matching auth content width", () => {
      useSessionMock.mockReturnValue({ data: null, status: "loading" });

      render(<Navbar />);

      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Mobile Touch Targets (WCAG 2.5.8)", () => {
    it("mobile menu items have py-3 for 44px minimum height", () => {
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

      // Open mobile menu
      fireEvent.click(screen.getByLabelText("Open menu"));

      // Mobile menu links should have py-3
      const allLeaderboardLinks = screen.getAllByText("Leaderboard");
      const mobileLink = allLeaderboardLinks.find(
        (link) => link.className.includes("py-3")
      );
      expect(mobileLink).toBeTruthy();
    });
  });

  describe("Mobile Menu Animation", () => {
    it("mobile menu uses CSS transitions for smooth animation", () => {
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      render(<Navbar />);

      const mobileMenu = document.getElementById("mobile-menu");
      expect(mobileMenu?.className).toContain("transition-all");
      expect(mobileMenu?.className).toContain("duration-300");
    });

    it("mobile menu transitions from max-h-0 to max-h-96 when opened", () => {
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      render(<Navbar />);

      const mobileMenu = document.getElementById("mobile-menu");
      expect(mobileMenu?.className).toContain("max-h-0");

      fireEvent.click(screen.getByLabelText("Open menu"));
      expect(mobileMenu?.className).toContain("max-h-96");
    });
  });

  describe("Backdrop Overlay", () => {
    it("shows backdrop overlay when mobile menu is open", () => {
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      render(<Navbar />);

      fireEvent.click(screen.getByLabelText("Open menu"));

      const backdrop = document.querySelector(".fixed.inset-0.bg-black\\/20");
      expect(backdrop).toBeTruthy();
      expect(backdrop?.className).toContain("opacity-100");
    });

    it("closes mobile menu when backdrop is clicked", () => {
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      render(<Navbar />);

      fireEvent.click(screen.getByLabelText("Open menu"));
      expect(screen.getByLabelText("Close menu")).toBeTruthy();

      const backdrop = document.querySelector(".fixed.inset-0.bg-black\\/20");
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      expect(screen.getByLabelText("Open menu")).toBeTruthy();
    });

    it("backdrop has pointer-events-none when menu is closed", () => {
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      render(<Navbar />);

      const backdrop = document.querySelector(".fixed.inset-0.bg-black\\/20");
      expect(backdrop?.className).toContain("pointer-events-none");
    });
  });

  describe("Sign-out Loading State", () => {
    it("shows loading text while signing out", async () => {
      signOutMock.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
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

      const logoutButtons = screen.getAllByText("Log Out");
      fireEvent.click(logoutButtons[0]);

      await waitFor(() => {
        expect(screen.getAllByText("Logging out...").length).toBeGreaterThanOrEqual(1);
      });
    });

    it("disables sign-out button while signing out", async () => {
      signOutMock.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
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

      const logoutButtons = screen.getAllByText("Log Out") as HTMLButtonElement[];
      fireEvent.click(logoutButtons[0]);

      await waitFor(() => {
        const loggingOutButtons = screen.getAllByText("Logging out...") as HTMLButtonElement[];
        expect(loggingOutButtons[0].disabled).toBe(true);
      });
    });
  });

  describe("Username Visual Distinction", () => {
    it("username is styled as a pill with bg-gray-700", () => {
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

      const usernames = screen.getAllByText("Test User");
      const desktopUsername = usernames[0];
      expect(desktopUsername.className).toContain("bg-gray-700");
      expect(desktopUsername.className).toContain("rounded-full");
      expect(desktopUsername.tagName).toBe("SPAN");
    });
  });

  describe("Mobile Menu Focus Management", () => {
    it("focuses first link when mobile menu opens", async () => {
      useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });

      render(<Navbar />);

      const hamburgerButton = screen.getByLabelText("Open menu");
      fireEvent.click(hamburgerButton);

      await waitFor(() => {
        // The first mobile menu link (Leaderboard) should receive focus
        expect(document.activeElement?.textContent).toContain("Leaderboard");
      });
    });
  });

  describe("Dark Theme Consistency", () => {
    it("maintains dark theme color scheme", () => {
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

      const nav = screen.getByRole("navigation");
      expect(nav.className).toContain("bg-gray-900/95");

      const playLinks = screen.getAllByText("Play");
      expect(playLinks[0].className).toContain("text-gray-300");

      const usernames = screen.getAllByText("Test User");
      expect(usernames[0].className).toContain("bg-gray-700");
    });
  });
});
