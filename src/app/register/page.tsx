import Link from "next/link";
import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | Simon Game",
};

/**
 * Registration page.
 *
 * Server Component that renders a centered layout with
 * the registration form and a link to the login page.
 */
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-4xl font-bold text-white sm:text-5xl">
        Create Account
      </h1>

      <RegisterForm />

      <p className="text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
