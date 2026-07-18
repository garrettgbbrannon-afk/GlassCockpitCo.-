import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { useAuth } from "../lib/authContext";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading, cloudSyncConfigured, signInWithGoogle, signOutUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  async function handleSignIn() {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
      navigate("/hub");
    } catch {
      setError("Sign-in didn't go through. Please try again.");
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <div className="min-h-screen bg-panel-950">
      <TopBar title="Account" />
      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:py-24">
        {!cloudSyncConfigured ? (
          <>
            <h1 className="font-display text-xl font-semibold uppercase tracking-[0.2em] text-white">
              Cloud Sync Coming Soon
            </h1>
            <p className="mt-4 text-silver-400">
              Account sign-in isn't set up on this deployment yet. Your progress is still saved automatically
              on this device — no account needed to study.
            </p>
            <Link
              to="/hub"
              className="mt-8 rounded-sm bg-silver-200 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-panel-950 hover:bg-silver-100"
            >
              Continue to Study Hub
            </Link>
          </>
        ) : loading ? (
          <p className="text-silver-400">Checking sign-in status…</p>
        ) : user ? (
          <>
            <h1 className="font-display text-xl font-semibold uppercase tracking-[0.2em] text-white">
              Signed In
            </h1>
            <p className="mt-4 text-silver-300">
              {user.displayName ?? user.email}
              <br />
              <span className="text-sm text-silver-500">{user.email}</span>
            </p>
            <p className="mt-4 text-sm text-silver-500">
              Your progress is syncing to this account across your devices.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/hub"
                className="rounded-sm bg-silver-200 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-panel-950 hover:bg-silver-100"
              >
                Study Hub
              </Link>
              <button
                type="button"
                onClick={() => signOutUser()}
                className="rounded-sm border border-panel-600 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-silver-200 hover:border-panel-400"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="font-display text-xl font-semibold uppercase tracking-[0.2em] text-white">
              Log In or Sign Up
            </h1>
            <p className="mt-4 text-silver-400">
              Sign in with Google to save your study progress to your account and pick up where you left off
              on any device.
            </p>
            <button
              type="button"
              onClick={handleSignIn}
              disabled={signingIn}
              className="mt-8 flex items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-panel-950 shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(255,255,255,0.15)] disabled:opacity-60"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.3 35.4 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C40.6 36.4 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"
                />
              </svg>
              Continue with Google
            </button>
            {error && <p className="mt-4 text-sm text-hud-red">{error}</p>}
            <Link to="/hub" className="mt-8 text-sm text-silver-500 underline hover:text-silver-300">
              Skip for now — study without an account
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
