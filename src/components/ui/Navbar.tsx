"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

/**
 * Auth-aware navigation bar.
 *
 * Shows login/register links when unauthenticated,
 * and the user's name with a logout button when authenticated.
 */
export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-700 bg-gray-900/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-bold text-white hover:text-gray-200 transition-colors"
        >
          Simon Game
        </Link>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-8 w-20 animate-pulse rounded bg-gray-700" />
          ) : session?.user ? (
            <>
              <Link
                href="/history"
                className="text-sm text-gray-300 transition-colors hover:text-white"
              >
                History
              </Link>
              <span className="text-sm text-gray-300">
                {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-600"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-300 transition-colors hover:text-white"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
