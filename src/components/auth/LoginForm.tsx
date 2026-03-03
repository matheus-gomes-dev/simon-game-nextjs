"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/lib/validators";
import FormField from "@/components/ui/FormField";

/** Maps field names to arrays of error messages. */
type FieldErrors = Record<string, string[]>;

/**
 * Login form component.
 *
 * Uses an uncontrolled form with FormData for input collection.
 * Performs client-side Zod validation before calling Auth.js signIn.
 * Displays inline field errors and a form-level error on auth failure.
 */
export default function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const data = {
      email: (formData.get("email") as string) ?? "",
      password: (formData.get("password") as string) ?? "",
    };

    // Client-side Zod validation
    const result = loginSchema.safeParse(data);
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
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.ok) {
        router.refresh();
        router.push("/play");
        return;
      }

      setErrors({ form: ["Invalid email or password"] });
    } catch {
      setErrors({
        form: ["Network error. Please check your connection and try again."],
      });
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
        autoComplete="current-password"
        placeholder="Enter your password"
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
        {isLoading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
