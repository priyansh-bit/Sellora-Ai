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
        },
      });

      if (supabaseError) {
        throw supabaseError;
      }

      if (data.user) {
        // 1. Insert into Supabase logon table
        const { error: dbError } = await supabase
          .from('logon')
          .upsert([{ id: data.user.id, email: email, full_name: name }]);
        
        if (dbError) console.error("Database error during signup:", dbError);

        // 2. Register in local store
        register({
          id: data.user.id,
          name: name,
          email: email,
          plan_type: "free",
          country: "US",
          storeName: "My Store",
        });

        // 3. Navigate to onboarding immediately
        navigate("/onboarding");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account.");
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
              Create your account
            </h2>
          </div>

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
