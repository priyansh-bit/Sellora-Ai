import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { useStore } from "@/src/store/useStore";
import { motion } from "motion/react";
import { supabase } from "@/src/lib/supabase";
import {
  ShoppingBag,
  Laptop,
  Shirt,
  Coffee,
  Book,
  Sparkles,
} from "lucide-react";

const NICHES = [
  { id: "electronics", name: "Electronics & Tech", icon: Laptop },
  { id: "fashion", name: "Fashion & Apparel", icon: Shirt },
  { id: "food", name: "Food & Beverage", icon: Coffee },
  { id: "digital", name: "Digital Products", icon: Sparkles },
  { id: "books", name: "Books & Media", icon: Book },
  { id: "other", name: "Other / General", icon: ShoppingBag },
];

export function Onboarding() {
  const navigate = useNavigate();
  const { user, updateStoreNiche } = useStore();
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleContinue = async () => {
    if (selectedNiche) {
      setLoading(true);
      setError("");
      
      try {
        // 1. Insert into Supabase store table
        const { error: storeError } = await supabase
          .from('store')
          .insert([{ 
            user_id: user.id, 
            store_name: `${user.name}'s ${selectedNiche} Store`,
            domain: `${user.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now()}.sellora.app`
          }]);

        if (storeError) throw storeError;

        // 2. Insert into Supabase subscription table (default free plan)
        const { error: subError } = await supabase
          .from('subscription')
          .insert([{ 
            user_id: user.id, 
            plan_name: 'free',
            status: 'active'
          }]);

        if (subError) throw subError;

        // 3. Update local state
        updateStoreNiche(selectedNiche);
        navigate("/dashboard");
      } catch (err: any) {
        console.error("Onboarding error:", err);
        setError(err.message || "Failed to setup store. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="animated-bg" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-card p-8 md:p-12 rounded-3xl border shadow-lg relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            What are you selling?
          </h2>
          <p className="text-muted-foreground mt-2">
            Select your primary niche. We'll use this to customize your AI Web
            Store.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {NICHES.map((niche) => {
            const isSelected = selectedNiche === niche.id;
            return (
              <button
                key={niche.id}
                onClick={() => setSelectedNiche(niche.id)}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50 hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <niche.icon
                  className={`h-8 w-8 mb-3 ${isSelected ? "text-primary" : ""}`}
                />
                <span className="font-medium text-sm">{niche.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} disabled={loading}>
            Skip for now
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedNiche || loading}
            className="px-8"
          >
            {loading ? "Setting up..." : "Continue to Dashboard"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
