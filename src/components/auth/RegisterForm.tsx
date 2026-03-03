"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/validators";
import FormField from "@/components/ui/FormField";

/** Maps field names to arrays of error messages. */
type FieldErrors = Record<string, string[]>;

/**
 * Registration form component.
 *
 * Uses an uncontrolled form with FormData for input collection.
 * Performs client-side Zod validation before submitting to the API.
 * Displays inline field errors and a form-level error when applicable.
 */
export default function RegisterForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const data = {
      username: (formData.get("username") as string) ?? "",
      email: (formData.get("email") as string) ?? "",
      password: (formData.get("password") as string) ?? "",
    };

    // Client-side Zod validation
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as FieldErrors;
      setErrors(fieldErrors);
      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/login?registered=true");
        return;
      }

      const body = await response.json();
      if (body.errors) {
        setErrors(body.errors);
      } else {
        setErrors({ form: ["An unexpected error occurred. Please try again."] });
      }
    } catch {
      setErrors({ form: ["Network error. Please check your connection and try again."] });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-md space-y-6"
    >
      <FormField
        id="username"
        label="Username"
        autoComplete="username"
        placeholder="Enter your username"
        hint="3-20 characters. Letters, numbers, and underscores only."
        errors={errors.username}
      />

      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        errors={errors.email}
      />

      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="Enter your password"
        hint="Must be 8-72 characters."
        errors={errors.password}
      />

      {/* Form-level errors */}
      {errors.form && (
        <div role="alert">
          {errors.form.map((msg) => (
            <p key={msg} className="text-sm text-red-400">
              {msg}
            </p>
          ))}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
