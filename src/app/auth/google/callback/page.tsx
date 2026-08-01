"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../stores/authStore";
import { googleAuth } from "../../../services/api";
import "../../../styles/signin.css";


type CallbackState = "loading" | "success" | "error";

export default function GoogleCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [callbackState, setCallbackState] = useState<CallbackState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isConflict, setIsConflict] = useState(false);

  // Guard against double-invocation in React StrictMode / concurrent renders
  const hasCalled = useRef(false);

  useEffect(() => {
    // Wait until NextAuth has resolved the session
    if (status === "loading") return;

    // NextAuth session not established — something went wrong with Google OAuth itself
    if (status === "unauthenticated" || !session?.idToken) {
      setErrorMessage("Google sign-in failed or was cancelled. Please try again.");
      setCallbackState("error");
      return;
    }

    // Prevent calling backend twice
    if (hasCalled.current) return;
    hasCalled.current = true;

    const sendTokenToBackend = async () => {
      try {
        const data = await googleAuth(session.idToken!);

        // ✅ Sync Zustand store — same pattern as LogInModal
        setUser({
          email: data.email,
          username: data.username,
          fullname: data.fullname,
          profileImage: data.profileImage,
        });

        setCallbackState("success");

        // Force navigation so middleware runs — same pattern as the rest of the app
        const basePath = window.location.pathname.startsWith("/lekhan")
          ? "/lekhan"
          : "";
        window.location.href = `${basePath}/home`;
      } catch (err: any) {
        const status = err?.status;
        const msg: string = err?.msg ?? "Something went wrong. Please try again.";

        if (status === 409) {
          // Email already registered with password — redirect back to login with flag
          setIsConflict(true);
          setErrorMessage(msg);
          setCallbackState("error");
        } else if (status === 401) {
          setErrorMessage("Session expired. Please try again.");
          setCallbackState("error");
        } else if (status === 403) {
          setErrorMessage(msg);
          setCallbackState("error");
        } else if (status === 500) {
          setErrorMessage("Something went wrong on our end. Try again shortly.");
          setCallbackState("error");
        } else {
          // Network offline or unknown
          setErrorMessage(
            navigator.onLine ? msg : "No internet connection. Please check your network."
          );
          setCallbackState("error");
        }
      }
    };

    sendTokenToBackend();
  }, [session, status, setUser]);

  // ─── Loading State ───────────────────────────────────────────────────────
  if (callbackState === "loading") {
    return (
      <div className="google-callback-page">
        <div className="google-callback-card">
          <div className="google-callback-spinner" aria-label="Signing you in…" />
          <p className="google-callback-title">Signing you in…</p>
          <p className="google-callback-subtitle">
            Verifying your Google account with our server.
          </p>
        </div>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────────────────
  if (callbackState === "error") {
    return (
      <div className="google-callback-page">
        <div className="google-callback-card google-callback-card--error">
          {/* Error icon */}
          <div className="google-callback-icon-wrap google-callback-icon-wrap--error">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
              <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {isConflict ? (
            <>
              <p className="google-callback-title">Email already registered</p>
              <div className="google-conflict-alert" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{errorMessage}</span>
              </div>
              <p className="google-callback-subtitle">
                Your Google account&apos;s email is already linked to a password-based account.
              </p>
              <a href="/" className="google-callback-btn google-callback-btn--primary" id="back-to-login-conflict-link">
                Go back and log in with password
              </a>
            </>
          ) : (
            <>
              <p className="google-callback-title">Sign-in failed</p>
              <p className="google-callback-subtitle google-callback-subtitle--error">
                {errorMessage}
              </p>
              <a href="/" className="google-callback-btn google-callback-btn--primary" id="back-to-login-error-link">
                Back to home
              </a>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── Success State (briefly shown before redirect) ───────────────────────
  return (
    <div className="google-callback-page">
      <div className="google-callback-card">
        <div className="google-callback-icon-wrap google-callback-icon-wrap--success">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2" />
            <path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="google-callback-title">Signed in!</p>
        <p className="google-callback-subtitle">Redirecting you…</p>
      </div>
    </div>
  );
}
