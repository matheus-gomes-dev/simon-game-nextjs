import { redirect } from "next/navigation";
import { auth } from "@/auth";
import HistoryClient from "./HistoryClient";

/**
 * Protected game history page.
 *
 * Checks for an authenticated session server-side.
 * Unauthenticated users are redirected to /login.
 */
export default async function HistoryPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-white">Game History</h1>
      <HistoryClient />
    </main>
  );
}
