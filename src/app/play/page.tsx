import PlayClient from "./PlayClient";

/**
 * Game page — accessible to all users.
 *
 * Both authenticated and unauthenticated users can play.
 * Game save and history features require authentication
 * (enforced by the API routes).
 */
export default function PlayPage() {
  return <PlayClient />;
}
