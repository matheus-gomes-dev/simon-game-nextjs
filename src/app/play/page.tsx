import { redirect } from "next/navigation";
import { auth } from "@/auth";
import PlayClient from "./PlayClient";

/**
 * Protected game page.
 *
 * Checks for an authenticated session server-side.
 * Unauthenticated users are redirected to /login.
 */
export default async function PlayPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <PlayClient />;
}
