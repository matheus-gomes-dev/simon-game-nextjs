"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close menu on Escape key (only when open)
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const authContent = status === "loading" ? (
    <div className="h-8 w-20 animate-pulse rounded bg-gray-700" />
  ) : session?.user ? (
    <>
      <Link
        href="/history"
        className="text-sm text-gray-300 transition-colors hover:text-white"
      >
        History
      </Link>
      <span className="text-sm text-gray-300">{session.user.name}</span>
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
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-700 bg-gray-900/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-bold text-white hover:text-gray-200 transition-colors"
        >
          Simon Game
        </Link>

        {/* Desktop nav */}
        <div
          className="hidden items-center gap-4 md:flex"
          aria-hidden={isMenuOpen}
        >
          <Link
            href="/leaderboard"
            className="text-sm text-gray-300 transition-colors hover:text-white"
          >
            Leaderboard
          </Link>
          {authContent}
        </div>

        {/* Mobile hamburger button */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          className="flex flex-col justify-center gap-1.5 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span
            className={`block h-0.5 w-6 bg-gray-300 transition-transform ${isMenuOpen ? "translate-y-[8px] rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-gray-300 transition-opacity ${isMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-gray-300 transition-transform ${isMenuOpen ? "-translate-y-[8px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div id="mobile-menu" className="border-t border-gray-700 md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3 [&_a]:py-2 [&_button]:py-2 [&_span]:py-2">
            <Link
              href="/leaderboard"
              className="text-sm text-gray-300 transition-colors hover:text-white"
            >
              Leaderboard
            </Link>
            {authContent}
          </div>
        </div>
      )}
    </nav>
  );
}
