import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useStore } from '@/src/store/useStore';
import { Sparkles, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, BrainCircuit, Target, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export function AIInsights() {
  const { user, products } = useStore();

  if (user?.plan_type === 'free') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Unlock AI Insights</h2>
        <p className="text-muted-foreground mb-8">
          Upgrade to Professional to get predictive analytics, automated pricing suggestions, and smart restock alerts powered by advanced AI.
        </p>
        <Button size="lg" className="w-full rounded-full" onClick={() => window.location.href = '/dashboard/settings'}>
          Upgrade to Pro
        </Button>
      </div>
    );
  }

  const lowStockProducts = products.filter(p => p.stock < 15);
  const topProduct = products.reduce((prev, current) => (prev.price > current.price) ? prev : current, products[0]);

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-4 bg-primary/5 text-primary border-primary/20">
          <BrainCircuit className="h-4 w-4 mr-2" />
          Sellora Intelligence Active
        </div>
        <h2 className="text-3xl font-bold tracking-tight">AI Insights</h2>
        <p className="text-muted-foreground mt-1">Predictive analytics and automated recommendations for your store.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Pricing Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Based on competitor analysis and current demand, we suggest adjusting prices for 2 products.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background border">
                  <div>
                    <div className="font-medium text-sm">{topProduct?.name || 'Premium Item'}</div>
                    <div className="text-xs text-muted-foreground">High demand detected</div>
                  </div>
                  <div className="flex items-center text-emerald-600 font-medium text-sm">
                    +5% <ArrowUpRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">Apply Suggestions</Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full border-amber-500/20 bg-gradient-to-br from-background to-amber-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Smart Restock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Predictive models show you will run out of stock for these items within 7 days.
              </p>
              <div className="space-y-3">
                {lowStockProducts.slice(0, 2).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-background border">
                    <div>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-muted-foreground">Current stock: {p.stock}</div>
                    </div>
                    <div className="text-amber-600 font-medium text-sm">
                      Order 50+
                    </div>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Inventory levels are optimal.
                  </div>
                )}
              </div>
              <Button className="w-full mt-4" variant="outline">Generate Purchase Order</Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full border-emerald-500/20 bg-gradient-to-br from-background to-emerald-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Growth Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="text-3xl font-bold text-emerald-600">+24.5%</div>
                <p className="text-sm text-muted-foreground mt-1">Projected revenue growth for next month based on current trajectory.</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected Revenue</span>
                  <span className="font-medium">$12,450</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected Orders</span>
                  <span className="font-medium">142</span>
                </div>
              </div>
              <Button className="w-full mt-6" variant="outline">View Detailed Report</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="mt-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Zap className="h-48 w-48 text-primary" />
        </div>
        <CardHeader>
          <CardTitle>Customer Churn Risk</CardTitle>
          <CardDescription>AI analysis of customer purchase frequency and engagement.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between p-4 rounded-xl border bg-background">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                  JS
                </div>
                <div>
                  <div className="font-medium">John Smith</div>
                  <div className="text-sm text-muted-foreground">Last purchase: 45 days ago</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-red-500 font-medium text-sm">High Risk (82%)</div>
                <Button variant="link" className="h-auto p-0 text-primary text-xs">Send Win-back Email</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border bg-background">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                  AW
                </div>
                <div>
                  <div className="font-medium">Alice Wong</div>
                  <div className="text-sm text-muted-foreground">Last purchase: 28 days ago</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-amber-500 font-medium text-sm">Medium Risk (45%)</div>
                <Button variant="link" className="h-auto p-0 text-primary text-xs">Offer Discount</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
