import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with default props", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toBeTruthy();
    expect(spinner.getAttribute("aria-label")).toBe("Loading...");
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("renders with custom label", () => {
    render(<LoadingSpinner label="Loading history..." />);

    const spinner = screen.getByRole("status");
    expect(spinner.getAttribute("aria-label")).toBe("Loading history...");
    expect(screen.getByText("Loading history...")).toBeTruthy();
  });

  it("applies small size classes", () => {
    const { container } = render(<LoadingSpinner size="sm" />);

    const circle = container.querySelector(".animate-spin");
    expect(circle?.className).toContain("h-6");
    expect(circle?.className).toContain("w-6");
  });

  it("applies large size classes", () => {
    const { container } = render(<LoadingSpinner size="lg" />);

    const circle = container.querySelector(".animate-spin");
    expect(circle?.className).toContain("h-12");
    expect(circle?.className).toContain("w-12");
  });

  it("has visually hidden label for screen readers", () => {
    render(<LoadingSpinner />);

    const srText = screen.getByText("Loading...");
    expect(srText.className).toContain("sr-only");
  });
});
