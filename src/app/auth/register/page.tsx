"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, showToast } = useStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.token || data.data?.token) {
          try {
            localStorage.setItem("upontik_token", data.token || data.data?.token);
          } catch {}
        }
        setUser(data.data);
        showToast("Your account has been created. Welcome to UPONTIK.", "success");
        router.push("/account");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md w-full bg-ivory-light border border-sand shadow-elevated rounded-sm p-5 sm:p-10">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-wideDisplay text-earth font-bold block mb-1">
              Join The Circle
            </span>
            <h1 className="font-serif text-3xl text-charcoal font-normal">
              Create an Account
            </h1>
            <p className="text-xs text-charcoal-muted mt-2">
              Save your favourite handcrafted bags, track shipments, and expedite checkout.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Farzana Chowdhury"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                />
                <User className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. farzana@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                />
                <Mail className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1711-000000"
                  className="w-full pl-9 pr-3 py-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                />
                <Phone className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Create Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-9 pr-3 py-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                />
                <Lock className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded flex items-center justify-center gap-2 hover:bg-charcoal-light shadow-elevated transition-colors mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-mustard" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Register Account</span>
                  <ArrowRight className="w-4 h-4 text-mustard" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-sand/50 text-center text-xs text-charcoal">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-mustard font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
