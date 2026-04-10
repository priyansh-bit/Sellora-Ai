import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useStore } from "@/src/store/useStore";
import { motion } from "motion/react";
import { ShieldCheck, Lock, User } from "lucide-react";

export function AdminLogin() {
  const navigate = useNavigate();
  const setAdmin = useStore((state) => state.setAdmin);
  const login = useStore((state) => state.login);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ADMIN_USER = (import.meta as any).env.VITE_ADMIN_USERNAME || "sellora_admin_2026";
  const ADMIN_PASS = (import.meta as any).env.VITE_ADMIN_PASSWORD || "Sellora_Secure_Admin_!99";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // High security check
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setTimeout(() => {
        setAdmin(true);
        login({
          id: "admin-id",
          name: "Sellora Admin",
          email: "admin@sellora.com",
          plan_type: "enterprise",
          country: "US",
          role: "admin"
        });
        navigate("/admin/dashboard");
      }, 1000);
    } else {
      setError("Invalid admin credentials. Access denied.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="glass-matte border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 border border-primary/30">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
            <p className="text-slate-400 text-sm mt-1">Restricted access for Sellora administrators</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Admin Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/5 border-white/10 h-12 pl-10 text-white placeholder:text-slate-600 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="password"
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 h-12 pl-10 text-white placeholder:text-slate-600 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white mt-4 shadow-lg shadow-primary/20"
            >
              {loading ? "Authenticating..." : "Secure Login"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500">
              © 2026 Sellora Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
