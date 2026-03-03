import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormField from "@/components/ui/FormField";

describe("FormField", () => {
  it("renders label and input with correct association", () => {
    render(<FormField id="username" label="Username" />);

    const input = screen.getByLabelText("Username");
    expect(input).toBeTruthy();
    expect(input.getAttribute("id")).toBe("username");
    expect(input.getAttribute("name")).toBe("username");
  });

  it("defaults input type to text", () => {
    render(<FormField id="username" label="Username" />);

    expect(screen.getByLabelText("Username").getAttribute("type")).toBe("text");
  });

  it("renders with custom input type", () => {
    render(<FormField id="password" label="Password" type="password" />);

    expect(screen.getByLabelText("Password").getAttribute("type")).toBe("password");
  });

  it("sets autoComplete attribute", () => {
    render(<FormField id="email" label="Email" autoComplete="email" />);

    expect(screen.getByLabelText("Email").getAttribute("autocomplete")).toBe("email");
  });

  it("sets placeholder text", () => {
    render(<FormField id="email" label="Email" placeholder="Enter your email" />);

    expect(screen.getByPlaceholderText("Enter your email")).toBeTruthy();
  });

  it("marks input as required", () => {
    render(<FormField id="username" label="Username" />);

    expect((screen.getByLabelText("Username") as HTMLInputElement).required).toBe(true);
  });

  it("renders hint text when provided", () => {
    render(<FormField id="username" label="Username" hint="3-20 characters" />);

    expect(screen.getByText("3-20 characters")).toBeTruthy();
  });

  it("does not render hint when not provided", () => {
    render(<FormField id="username" label="Username" />);

    expect(screen.queryByText(/characters/)).toBeNull();
  });

  it("links input to hint via aria-describedby when no errors", () => {
    render(<FormField id="username" label="Username" hint="3-20 characters" />);

    const input = screen.getByLabelText("Username");
    expect(input.getAttribute("aria-describedby")).toBe("username-hint");
  });

  it("does not set aria-describedby when no hint and no errors", () => {
    render(<FormField id="username" label="Username" />);

    expect(screen.getByLabelText("Username").getAttribute("aria-describedby")).toBeNull();
  });

  it("renders error messages when provided", () => {
    render(
      <FormField
        id="email"
        label="Email"
        errors={["Email is required", "Must be valid"]}
      />
    );

    expect(screen.getByText("Email is required")).toBeTruthy();
    expect(screen.getByText("Must be valid")).toBeTruthy();
  });

  it("wraps errors in a role=alert container", () => {
    render(
      <FormField id="email" label="Email" errors={["Email is required"]} />
    );

    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("does not render error container when errors is empty array", () => {
    render(<FormField id="email" label="Email" errors={[]} />);

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("does not render error container when errors is undefined", () => {
    render(<FormField id="email" label="Email" />);

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("sets aria-invalid when errors are present", () => {
    render(
      <FormField id="email" label="Email" errors={["Email is required"]} />
    );

    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBe("true");
  });

  it("does not set aria-invalid when no errors", () => {
    render(<FormField id="email" label="Email" />);

    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBeNull();
  });

  it("links input to error via aria-describedby instead of hint when errors present", () => {
    render(
      <FormField
        id="username"
        label="Username"
        hint="3-20 characters"
        errors={["Username is required"]}
      />
    );

    const input = screen.getByLabelText("Username");
    expect(input.getAttribute("aria-describedby")).toBe("username-error");
  });
});
