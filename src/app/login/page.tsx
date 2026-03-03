import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | Simon Game",
};

/**
 * Login page stub.
 *
 * Placeholder page for the login feature, which will be
 * implemented in a future user story. Shows a success banner
 * when redirected from registration.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const registered = params.registered === "true";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-4xl font-bold text-white sm:text-5xl">Log In</h1>

      {registered && (
        <p className="rounded-lg bg-green-900/50 px-4 py-2 text-sm text-green-300" role="status">
          Account created successfully! Login will be available soon.
        </p>
      )}

      <p className="text-lg text-gray-300">
        Login functionality coming soon.
      </p>

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
