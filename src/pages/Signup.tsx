import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useStore } from "@/src/store/useStore";
import { motion } from "motion/react";
import { supabase } from "@/src/lib/supabase";

export function Signup() {
  const navigate = useNavigate();
  const register = useStore((state) => state.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"form" | "verify">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (supabaseError) {
        // Check for specific Supabase errors
        if (supabaseError.message.includes("rate limit")) {
          throw new Error("Email rate limit exceeded. Please try again in an hour or check your spam folder.");
        }
        throw supabaseError;
      }

      if (data.user) {
        // 1. Insert into Supabase logon table (even if unconfirmed)
        const { error: dbError } = await supabase
          .from('logon')
          .upsert([{ id: data.user.id, email: email, full_name: name }]);
        
        if (dbError) console.error("Database error during signup:", dbError);

        if (data.session) {
          register({
            id: data.user.id,
            name: name,
            email: email,
            plan_type: "free",
            country: "US",
            storeName: "My Store",
          });
          navigate("/onboarding");
        } else {
          setStep("verify");
        }
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError("");
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });
      if (resendError) throw resendError;
      alert("Verification email resent! Please check your inbox and spam folder.");
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Side - Branding/Hero */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        {/* Abstract background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 blur-3xl mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 blur-3xl mix-blend-multiply dark:mix-blend-screen" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
                S
              </span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Sellora
            </span>
          </div>

          <div className="mt-auto mb-20">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
              Join millions of businesses that trust Sellora to supercharge
              their growth
            </h1>
            <div className="flex gap-6 text-sm font-medium text-white/90">
              <div className="flex items-center gap-2">
                <span className="text-primary">✦</span> 100+ Payment Methods
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✦</span> Easy Integration
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✦</span> Powerful Dashboard
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center mb-6 lg:hidden">
              <span className="text-primary-foreground font-bold text-xl">
                S
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Welcome to Sellora
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {step === "form" ? "Create your account" : "Verify your email"}
            </h2>
          </div>

          {step === "form" ? (
            <form onSubmit={handleSignup} className="space-y-4 mt-8">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                  {error}
                </div>
              )}
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base"
                required
              />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
                required
              />
              <Input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base"
                required
                minLength={6}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          ) : (
            <div className="space-y-6 mt-8 text-center">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                <div className="h-16 w-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Check your email</h3>
                <p className="text-muted-foreground">
                  We've sent a verification link to <strong>{email}</strong>. 
                  Please click the link in the email to activate your account.
                </p>
                <p className="text-xs text-muted-foreground/60 mt-4">
                  Don't see it? Check your <strong>spam folder</strong>. 
                  Supabase has a limit of 3 emails per hour for the free tier.
                </p>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Go to Login
                </Button>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={loading}
                    className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-50"
                  >
                    {loading ? "Resending..." : "Resend verification email"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Use a different email
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground mt-8">
            By continuing you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              privacy policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              terms of use
            </a>
          </p>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Log in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
