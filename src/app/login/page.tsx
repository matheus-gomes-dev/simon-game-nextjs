import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In | Simon Game",
};

/**
 * Login page.
 *
 * Server Component that renders a centered layout with
 * the login form, a success banner from registration,
 * and a link to the register page.
 * Redirects already-authenticated users to /play.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (session) {
    redirect("/play");
  }

  const params = await searchParams;
  const registered = params.registered === "true";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-4xl font-bold text-white sm:text-5xl">Log In</h1>

      {registered && (
        <p
          className="rounded-lg bg-green-900/50 px-4 py-2 text-sm text-green-300"
          role="status"
        >
          Account created successfully! Please log in.
        </p>
      )}

      <LoginForm />

      <p className="text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
