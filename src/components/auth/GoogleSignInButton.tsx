"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleSignInButtonProps {
  label?: string;
  redirectTo?: string;
  onSuccess?: () => void;
  className?: string;
}

export function GoogleSignInButton({
  label = "Continue with Google",
  redirectTo = "/account",
  onSuccess,
  className = "",
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const { setUser, showToast } = useStore();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.google?.accounts) {
      setScriptLoaded(true);
      return;
    }

    const existing = document.getElementById("google-gsi-client");
    if (existing) {
      existing.addEventListener("load", () => setScriptLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-gsi-client";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  const completeGoogleLogin = async (payload: { credential?: string; accessToken?: string }) => {
    setIsGoogleLoading(true);
    try {
      let guestOrderIds: string[] = [];
      try {
        const raw = localStorage.getItem("upontik_guest_orders");
        if (raw) guestOrderIds = JSON.parse(raw);
      } catch {}

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...payload, guestOrderIds }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        if (data.token || data.data?.token) {
          try {
            localStorage.setItem("upontik_token", data.token || data.data.token);
            localStorage.removeItem("upontik_guest_orders");
          } catch {}
        }
        setUser(data.data);
        showToast("Google Sign-In সফল হয়েছে! স্বাগতম।", "success");
        if (onSuccess) {
          onSuccess();
        } else if (redirectTo) {
          router.push(data.data.role === "admin" ? "/admin" : redirectTo);
        }
      } else {
        showToast(data.error || "Google Sign-In failed.", "error");
      }
    } catch {
      showToast("Google Sign-In error. Please try again.", "error");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleClick = () => {
    if (!clientId) {
      showToast(
        "Google Client ID এখনো সেট করা হয়নি। অনুগ্রহ করে .env-তে NEXT_PUBLIC_GOOGLE_CLIENT_ID সেট করুন।",
        "error"
      );
      return;
    }

    if (!scriptLoaded || !window.google?.accounts?.oauth2) {
      showToast("Google Sign-In লোড হচ্ছে, অনুগ্রহ করে ১ সেকেন্ড পর আবার চেষ্টা করুন।", "info");
      return;
    }

    setIsGoogleLoading(true);
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid email profile",
        callback: (tokenResponse: any) => {
          if (tokenResponse?.access_token) {
            completeGoogleLogin({ accessToken: tokenResponse.access_token });
          } else {
            setIsGoogleLoading(false);
            if (tokenResponse?.error) {
              showToast("Google Sign-In বাতিল করা হয়েছে।", "info");
            }
          }
        },
        error_callback: () => {
          setIsGoogleLoading(false);
          showToast("Google Sign-In পপআপ খোলা যায়নি।", "error");
        },
      });
      tokenClient.requestAccessToken();
    } catch {
      setIsGoogleLoading(false);
      showToast("Google Sign-In শুরু করতে সমস্যা হয়েছে।", "error");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      disabled={isGoogleLoading}
      className={`w-full py-3 px-4 bg-white dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#3A3128] text-[#211D1A] dark:text-[#FAF6F0] text-xs font-sans font-semibold rounded-sm flex items-center justify-center gap-2.5 hover:border-[#D49542] hover:bg-[#FAF7F2] dark:hover:bg-[#26201B] transition-colors shadow-xs disabled:opacity-60 ${className}`}
    >
      {isGoogleLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#D49542]" />
      ) : (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
          />
        </svg>
      )}
      <span>{isGoogleLoading ? "Signing in with Google..." : label}</span>
    </button>
  );
}
