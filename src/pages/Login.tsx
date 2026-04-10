import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useStore } from "@/src/store/useStore";
import { motion } from "motion/react";
import { supabase } from "@/src/lib/supabase";

export function Login() {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const setCouponCode = useStore((state) => state.setCouponCode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData?.user) throw new Error("Login failed.");

      // 1. Fetch user from Supabase logon table
      const { data: logonData, error: supabaseError } = await supabase
        .from('logon')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (supabaseError || !logonData) {
        throw new Error("User profile not found. Please sign up first.");
      }

      // 2. Fetch subscription plan
      const { data: subData } = await supabase
        .from('subscription')
        .select('plan_name')
        .eq('user_id', logonData.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // 3. Login to local store
      login({
        id: logonData.id,
        name: logonData.full_name || "User",
        email: logonData.email,
        plan_type: (subData?.plan_name as any) || "free",
        country: "US", // Default country, will update in onboarding
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  if (showForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border shadow-xl"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Reset Password</h2>
            <p className="text-muted-foreground mt-2">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
              {error}
            </div>
          )}

          {resetSent ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg text-center">
              <p className="text-green-800 dark:text-green-300 font-medium">Reset link sent!</p>
              <p className="text-xs text-muted-foreground mt-1 text-green-700/70 dark:text-green-400/70">Check your inbox for instructions.</p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
              <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowForgot(false)}
              >
                Back to Login
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

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

      {/* Right Side - Login Form */}
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
              Sign in to your account
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 mt-8">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 text-base"
              required
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>

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

          <div className="mt-8 p-4 bg-muted/30 rounded-xl border">
            <p className="text-sm font-medium">
              Helping Clients with Sellora Solutions?
            </p>
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline mt-1 inline-block"
            >
              Become Sellora Partner →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
