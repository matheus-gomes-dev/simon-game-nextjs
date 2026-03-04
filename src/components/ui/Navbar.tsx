"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileMenuLinkRef = useRef<HTMLAnchorElement>(null);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Mobile menu focus management
  useEffect(() => {
    if (isMenuOpen) {
      // On open: focus first link
      firstMobileMenuLinkRef.current?.focus();
    } else {
      // On close: return focus to hamburger button
      if (document.activeElement !== document.body) {
        hamburgerButtonRef.current?.focus();
      }
    }
  }, [isMenuOpen]);

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

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } finally {
      setIsSigningOut(false);
    }
  };

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;
    return `text-sm transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded ${
      isActive
        ? "text-white border-b-2 border-indigo-600 font-medium"
        : "text-gray-300 hover:text-white"
    }`;
  };

  const authContent = status === "loading" ? (
    <>
      <div className="h-8 w-24 animate-pulse rounded bg-gray-700" />
      <div className="h-8 w-20 animate-pulse rounded bg-gray-700" />
      <div className="h-8 w-16 animate-pulse rounded bg-gray-700" />
    </>
  ) : session?.user ? (
    <>
      <Link href="/play" className={getLinkClasses("/play")}>
        Play
      </Link>
      <Link href="/history" className={getLinkClasses("/history")}>
        History
      </Link>
      <span className="text-sm text-gray-300 bg-gray-700 px-2.5 py-1 rounded-full">
        {session.user.name}
      </span>
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="rounded-lg bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-600 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSigningOut ? "Logging out..." : "Log Out"}
      </button>
    </>
  ) : (
    <>
      <Link href="/login" className={getLinkClasses("/login")}>
        Log In
      </Link>
      <Link
        href="/register"
        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
      >
        Register
      </Link>
    </>
  );

  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-50 border-b border-gray-700 bg-gray-900/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-bold text-white hover:text-gray-200 transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
        >
          Simon Game
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/leaderboard" className={getLinkClasses("/leaderboard")}>
            Leaderboard
          </Link>
          {authContent}
        </div>

        {/* Mobile hamburger button */}
        <button
          ref={hamburgerButtonRef}
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          className="flex flex-col justify-center gap-1.5 md:hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded p-2"
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

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/20 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100 z-40" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`border-t border-gray-700 md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3">
          <Link
            ref={firstMobileMenuLinkRef}
            href="/leaderboard"
            className={`${getLinkClasses("/leaderboard")} py-3`}
          >
            Leaderboard
          </Link>
          {status === "loading" ? (
            <>
              <div className="h-11 w-24 animate-pulse rounded bg-gray-700" />
              <div className="h-11 w-20 animate-pulse rounded bg-gray-700" />
              <div className="h-11 w-16 animate-pulse rounded bg-gray-700" />
            </>
          ) : session?.user ? (
            <>
              <Link href="/play" className={`${getLinkClasses("/play")} py-3`}>
                Play
              </Link>
              <Link href="/history" className={`${getLinkClasses("/history")} py-3`}>
                History
              </Link>
              <span className="text-sm text-gray-300 bg-gray-700 px-2.5 py-3 rounded-full">
                {session.user.name}
              </span>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="rounded-lg bg-gray-700 px-3 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-600 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                {isSigningOut ? "Logging out..." : "Log Out"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={`${getLinkClasses("/login")} py-3`}>
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-3 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
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
