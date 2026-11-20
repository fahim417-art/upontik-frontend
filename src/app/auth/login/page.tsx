"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, Sparkles, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, showToast } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.token || data.data?.token) {
          try {
            localStorage.setItem("upontik_token", data.token || data.data?.token);
          } catch {}
        }
        setUser(data.data);
        showToast("Welcome back to UPONTIK.", "success");
        if (data.data.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/account");
        }
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const autofillAdmin = () => {
    setEmail("admin@upontik.com");
    setPassword("AdminUpontik2026!");
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-md w-full bg-ivory-light border border-sand/80 shadow-elevated rounded-sm p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase tracking-wideDisplay text-earth font-bold block mb-1">
              Patron & Collector Portal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              Sign In to UPONTIK
            </h1>
            <p className="text-xs text-charcoal-muted mt-2">
              Access your order archives, saved pieces, and studio account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-editorial font-bold text-charcoal mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@upontik.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard transition-colors"
                />
                <Mail className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-editorial font-bold text-charcoal">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard transition-colors"
                />
                <Lock className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded flex items-center justify-center gap-2 hover:bg-charcoal-light shadow-elevated transition-colors mt-6 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-mustard" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Atelier</span>
                  <ArrowRight className="w-4 h-4 text-mustard" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials 1-Click Autofill */}
          <div className="mt-6 p-4 bg-sand/20 border border-sand/60 rounded text-xs text-charcoal-muted space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-charcoal flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-mustard" />
                Administrator Demo:
              </span>
              <button
                type="button"
                onClick={autofillAdmin}
                className="text-[11px] font-bold text-mustard hover:text-earth underline uppercase tracking-wider"
              >
                1-Click Autofill
              </button>
            </div>
            <p className="text-[11px]">
              Email: <code className="text-earth bg-ivory px-1 py-0.5 rounded">admin@upontik.com</code>
            </p>
            <p className="text-[11px]">
              Password: <code className="text-earth bg-ivory px-1 py-0.5 rounded">AdminUpontik2026!</code>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-sand/50 text-center text-xs text-charcoal">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/auth/register"
              className="text-mustard font-bold hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
