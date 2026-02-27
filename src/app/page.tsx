import Link from "next/link";

/**
 * Landing page for the Simon Game application.
 *
 * Displays the game title, a brief description, and a prominent
 * call-to-action linking to the play page.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-5xl font-bold text-white sm:text-6xl">
        Simon Game
      </h1>

      <p className="max-w-md text-center text-lg text-gray-300">
        Test your memory by repeating increasingly longer color sequences.
        How far can you go?
      </p>

      <Link
        href="/play"
        className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        Play Now
      </Link>
    </div>
  );
}
