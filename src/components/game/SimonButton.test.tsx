import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SimonButton from "@/components/game/SimonButton";

describe("SimonButton", () => {
  it("renders a button element", () => {
    render(
      <SimonButton
        color="green"
        isActive={false}
        disabled={false}
        onTap={vi.fn()}
      />
    );

    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("sets aria-label to the color name", () => {
    render(
      <SimonButton
        color="red"
        isActive={false}
        disabled={false}
        onTap={vi.fn()}
      />
    );

    expect(screen.getByRole("button").getAttribute("aria-label")).toBe("red pad");
  });

  it("calls onTap when clicked", () => {
    const onTap = vi.fn();
    render(
      <SimonButton
        color="blue"
        isActive={false}
        disabled={false}
        onTap={onTap}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(onTap).toHaveBeenCalledTimes(1);
  });

  it("does not call onTap when disabled", () => {
    const onTap = vi.fn();
    render(
      <SimonButton
        color="yellow"
        isActive={false}
        disabled={true}
        onTap={onTap}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(onTap).not.toHaveBeenCalled();
  });

  it("applies the disabled attribute when disabled prop is true", () => {
    render(
      <SimonButton
        color="green"
        isActive={false}
        disabled={true}
        onTap={vi.fn()}
      />
    );

    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("is not disabled when disabled prop is false", () => {
    render(
      <SimonButton
        color="green"
        isActive={false}
        disabled={false}
        onTap={vi.fn()}
      />
    );

    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  it("applies active styling classes when isActive is true", () => {
    render(
      <SimonButton
        color="green"
        isActive={true}
        disabled={false}
        onTap={vi.fn()}
      />
    );

    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-green-400");
    expect(button.className).toContain("brightness-125");
    expect(button.className).toContain("scale-105");
  });

  it("applies base styling classes when isActive is false", () => {
    render(
      <SimonButton
        color="green"
        isActive={false}
        disabled={false}
        onTap={vi.fn()}
      />
    );

    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-green-700");
  });

  it("applies cursor-not-allowed when disabled", () => {
    render(
      <SimonButton
        color="red"
        isActive={false}
        disabled={true}
        onTap={vi.fn()}
      />
    );

    const button = screen.getByRole("button");
    expect(button.className).toContain("cursor-not-allowed");
  });

  it("applies correct color classes for each color", () => {
    const colors = [
      { color: "green" as const, baseClass: "bg-green-700", activeClass: "bg-green-400" },
      { color: "red" as const, baseClass: "bg-red-700", activeClass: "bg-red-400" },
      { color: "yellow" as const, baseClass: "bg-yellow-600", activeClass: "bg-yellow-300" },
      { color: "blue" as const, baseClass: "bg-blue-700", activeClass: "bg-blue-400" },
    ];

    for (const { color, baseClass, activeClass } of colors) {
      const { unmount } = render(
        <SimonButton
          color={color}
          isActive={false}
          disabled={false}
          onTap={vi.fn()}
        />
      );
      expect(screen.getByRole("button").className).toContain(baseClass);
      unmount();

      const { unmount: unmount2 } = render(
        <SimonButton
          color={color}
          isActive={true}
          disabled={false}
          onTap={vi.fn()}
        />
      );
      expect(screen.getByRole("button").className).toContain(activeClass);
      unmount2();
    }
  });

  it("applies sizing and rounding classes", () => {
    render(
      <SimonButton
        color="green"
        isActive={false}
        disabled={false}
        onTap={vi.fn()}
      />
    );

    const button = screen.getByRole("button");
    expect(button.className).toContain("w-28");
    expect(button.className).toContain("h-28");
    expect(button.className).toContain("rounded-2xl");
  });

  it("applies transition classes", () => {
    render(
      <SimonButton
        color="blue"
        isActive={false}
        disabled={false}
        onTap={vi.fn()}
      />
    );

    const button = screen.getByRole("button");
    expect(button.className).toContain("transition-all");
    expect(button.className).toContain("duration-150");
  });
});
