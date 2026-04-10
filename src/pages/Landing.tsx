import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { useStore } from '@/src/store/useStore';
import { ArrowRight, BarChart3, Box, Receipt, Sparkles, CheckCircle2, Star, Zap, Shield, Globe } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function Landing() {
  const { 
    theme, 
    toggleTheme, 
    currency, 
    setCurrency, 
    language, 
    setLanguage, 
    getCurrencySymbol, 
    getPrice 
  } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const heroRotateX = useTransform(scrollYProgress, [0, 0.5], [0, 25]);

  const salesData = [
    { name: 'Jan', total: 1200 },
    { name: 'Feb', total: 2100 },
    { name: 'Mar', total: 1800 },
    { name: 'Apr', total: 2400 },
    { name: 'May', total: 2800 },
    { name: 'Jun', total: 3200 },
  ];

  const visitorData = [
    { name: 'Mon', visitors: 400 },
    { name: 'Tue', visitors: 300 },
    { name: 'Wed', visitors: 550 },
    { name: 'Thu', visitors: 450 },
    { name: 'Fri', visitors: 700 },
    { name: 'Sat', visitors: 800 },
    { name: 'Sun', visitors: 600 },
  ];

  return (
    <div ref={containerRef} className="dark min-h-screen bg-transparent overflow-hidden text-white relative isolate">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden bg-slate-950">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80" 
          alt="Vibrant Abstract Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 backdrop-blur-[80px]" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50">
        {/* Top Bar */}
        <div className="w-full bg-black/60 backdrop-blur-md border-b border-white/10 text-white/80 text-xs font-medium px-6 py-2 flex justify-end items-center gap-4">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent border-none outline-none cursor-pointer hover:text-white focus:ring-0"
          >
            <option value="EN" className="bg-slate-900 text-white">English (EN)</option>
            <option value="ES" className="bg-slate-900 text-white">Español (ES)</option>
            <option value="FR" className="bg-slate-900 text-white">Français (FR)</option>
            <option value="HI" className="bg-slate-900 text-white">हिन्दी (HI)</option>
          </select>
          <div className="w-px h-3 bg-white/20" />
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent border-none outline-none cursor-pointer hover:text-white focus:ring-0"
          >
            <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
            <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
            <option value="GBP" className="bg-slate-900 text-white">GBP (£)</option>
            <option value="INR" className="bg-slate-900 text-white">INR (₹)</option>
          </select>
        </div>
        
        {/* Main Header */}
        <div className="w-full border-b border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-2xl shadow-lg">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-primary-foreground font-bold text-xl font-display">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight font-display text-white drop-shadow-md">Sellora</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-white/80">
              <a href="#features" className="hover:text-white hover:drop-shadow-md transition-all">Features</a>
              <a href="#how-it-works" className="hover:text-white hover:drop-shadow-md transition-all">How it Works</a>
              <a href="#about" className="hover:text-white hover:drop-shadow-md transition-all">Our Story</a>
              <a href="#pricing" className="hover:text-white hover:drop-shadow-md transition-all">Pricing</a>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                Log in
              </Link>
              <Link to="/signup">
                <Button className="rounded-full font-medium shadow-lg shadow-primary/20">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-40 pb-16 px-6 relative perspective-1000">
        <div className="max-w-7xl mx-auto text-center relative">
          
          {/* Floating 3D Elements */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 dark:bg-black/20 rounded-3xl backdrop-blur-2xl border border-white/20 float-3d hidden lg:flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
            <BarChart3 className="h-12 w-12 text-primary/80" />
          </div>
          <div className="absolute top-20 -right-10 w-40 h-40 bg-white/10 dark:bg-black/20 rounded-full backdrop-blur-2xl border border-white/20 float-3d-delayed hidden lg:flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
            <Sparkles className="h-16 w-16 text-purple-500/80" />
          </div>

          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale, rotateX: heroRotateX }}
            className="relative z-10 transform-gpu"
          >
            <div className="inline-flex items-center rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium mb-8 bg-white/10 dark:bg-black/30 backdrop-blur-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Sparkles className="h-4 w-4 mr-2 text-primary drop-shadow-md" />
              <span className="text-white drop-shadow-md">Introducing Sellora AI Insights 2.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 font-display leading-[0.9] drop-shadow-2xl [text-shadow:_0_4px_24px_rgb(0_0_0_/_40%)]">
              Run Your Business <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-purple-400 drop-shadow-xl [text-shadow:_0_4px_24px_rgb(37_99_235_/_40%)]">
                Smarter with AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 font-medium drop-shadow-xl [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
              Inventory, Billing, Growth — All in One Platform. 
              Built for modern entrepreneurs who want to scale without the complexity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-2xl shadow-primary/40 hover:scale-105 transition-transform text-white font-bold">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-white/10 dark:bg-black/30 backdrop-blur-2xl border-white/30 hover:bg-white/20 dark:hover:bg-black/40 hover:scale-105 transition-all text-white font-bold shadow-xl">
                View Demo
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/80 font-medium drop-shadow-md">No credit card required • 14-day free trial</p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            id="features"
            initial={{ opacity: 0, y: 80, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="grid md:grid-cols-3 gap-8 mt-40 text-left relative z-10 perspective-1000 transform-gpu"
          >
            <div className="p-8 rounded-[2rem] bg-white/10 dark:bg-black/30 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_0_rgba(37,99,235,0.2)] transition-all hover:-translate-y-3 group">
              <div className="h-14 w-14 rounded-2xl bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg">
                <Box className="h-7 w-7 text-blue-400 drop-shadow-md" />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-display text-white drop-shadow-md">Smart Inventory</h3>
              <p className="text-white/80 text-lg leading-relaxed drop-shadow-sm">Track stock levels in real-time. Get automated alerts before you run out of your best sellers.</p>
            </div>
            <div className="p-8 rounded-[2rem] bg-white/10 dark:bg-black/30 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_0_rgba(37,99,235,0.2)] transition-all hover:-translate-y-3 group">
              <div className="h-14 w-14 rounded-2xl bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-lg">
                <Receipt className="h-7 w-7 text-blue-400 drop-shadow-md" />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-display text-white drop-shadow-md">Instant Billing</h3>
              <p className="text-white/80 text-lg leading-relaxed drop-shadow-sm">Generate professional invoices in seconds. Accept payments globally with zero friction.</p>
            </div>
            <div className="p-8 rounded-[2rem] bg-white/10 dark:bg-black/30 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_0_rgba(37,99,235,0.2)] transition-all hover:-translate-y-3 group">
              <div className="h-14 w-14 rounded-2xl bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg">
                <Sparkles className="h-7 w-7 text-purple-400 drop-shadow-md" />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-display text-white drop-shadow-md">AI Insights</h3>
              <p className="text-white/80 text-lg leading-relaxed drop-shadow-sm">Let our AI analyze your sales data to suggest pricing optimizations and restock timings.</p>
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div 
            id="how-it-works"
            initial={{ opacity: 0, y: 80, rotateX: 15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="mt-40 text-left bg-white/10 dark:bg-black/30 backdrop-blur-3xl rounded-[3rem] border border-white/20 p-8 md:p-16 shadow-[0_16px_64px_0_rgba(0,0,0,0.4)] relative overflow-hidden transform-gpu"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-display text-white drop-shadow-lg">Everything you need to manage your store.</h2>
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                      <Globe className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1 font-display text-white drop-shadow-md">1. Build your storefront</h4>
                      <p className="text-white/80 text-lg drop-shadow-sm">Create a beautiful, SEO-optimized public store in minutes. No coding required.</p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                      <BarChart3 className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1 font-display text-white drop-shadow-md">2. Track everything</h4>
                      <p className="text-white/80 text-lg drop-shadow-sm">Monitor inventory, expenses, and revenue from a single, unified dashboard.</p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                      <Zap className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1 font-display text-white drop-shadow-md">3. Scale with AI</h4>
                      <p className="text-white/80 text-lg drop-shadow-sm">Unlock predictive analytics that tell you exactly what to restock and when.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-[500px] rounded-[2rem] overflow-hidden border border-white/20 bg-white/5 dark:bg-black/10 backdrop-blur-xl shadow-2xl transform perspective-1000 rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
                {/* Mock UI representation */}
                <div className="absolute inset-0 p-6">
                  <div className="w-full h-full bg-white/40 dark:bg-black/40 backdrop-blur-2xl rounded-xl border border-white/20 shadow-lg flex flex-col overflow-hidden">
                    <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-white/20 dark:bg-black/20">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-400/80" />
                        <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                        <div className="h-3 w-3 rounded-full bg-green-400/80" />
                      </div>
                      <div className="text-xs font-medium text-white/60">Sales Dashboard</div>
                    </div>
                    <div className="flex-1 p-6 grid grid-cols-3 gap-6 bg-white/10 dark:bg-black/10 overflow-y-auto">
                      <div className="col-span-3 lg:col-span-2 space-y-6">
                        <div className="h-48 bg-white/10 dark:bg-black/20 rounded-2xl border border-white/10 p-4 flex flex-col">
                          <h4 className="text-sm font-medium text-white/80 mb-4">Revenue Overview</h4>
                          <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={salesData}>
                                <defs>
                                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                  itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div className="h-40 bg-white/10 dark:bg-black/20 rounded-2xl border border-white/10 p-4 flex flex-col">
                          <h4 className="text-sm font-medium text-white/80 mb-4">Weekly Visitors</h4>
                          <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={visitorData}>
                                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="visitors" fill="#a855f7" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 lg:col-span-1 space-y-6">
                        <div className="bg-white/10 dark:bg-black/20 rounded-2xl border border-white/10 p-5">
                          <div className="text-sm text-white/60 mb-1">Total Sales</div>
                          <div className="text-2xl font-bold text-white mb-2">$12,450</div>
                          <div className="text-xs text-green-400 flex items-center"><ArrowRight className="h-3 w-3 mr-1 -rotate-45" /> +14.5% from last month</div>
                        </div>
                        <div className="bg-white/10 dark:bg-black/20 rounded-2xl border border-white/10 p-5">
                          <div className="text-sm text-white/60 mb-1">Active Users</div>
                          <div className="text-2xl font-bold text-white mb-2">1,204</div>
                          <div className="text-xs text-green-400 flex items-center"><ArrowRight className="h-3 w-3 mr-1 -rotate-45" /> +5.2% from last week</div>
                        </div>
                        <div className="bg-white/10 dark:bg-black/20 rounded-2xl border border-white/10 p-5">
                          <div className="text-sm text-white/60 mb-1">Conversion Rate</div>
                          <div className="text-2xl font-bold text-white mb-2">3.8%</div>
                          <div className="text-xs text-red-400 flex items-center"><ArrowRight className="h-3 w-3 mr-1 rotate-45" /> -0.4% from last week</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div 
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="mt-40 transform-gpu"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16 text-center font-display text-white drop-shadow-lg">Loved by modern founders</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                { name: "Sarah Jenkins", role: "Boutique Owner", text: "Sellora completely changed how I manage my inventory. The AI insights alone saved me thousands in dead stock." },
                { name: "David Chen", role: "E-commerce Founder", text: "The cleanest dashboard I've ever used. Generating invoices and tracking expenses is finally frictionless." },
                { name: "Emma Watson", role: "Retail Manager", text: "We migrated from a clunky legacy system to Sellora in one day. The speed and design are unmatched." }
              ].map((t, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-white/10 dark:bg-black/30 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_0_rgba(37,99,235,0.2)] transition-all hover:-translate-y-2">
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />)}
                  </div>
                  <p className="text-white/90 text-lg mb-8 font-medium drop-shadow-sm">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-white text-lg shadow-inner">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-base text-white drop-shadow-sm">{t.name}</div>
                      <div className="text-sm text-white/70">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pricing */}
          <motion.div 
            id="pricing"
            initial={{ opacity: 0, y: 80, rotateX: -10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="mt-40 mb-32 perspective-1000 transform-gpu"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16 text-center font-display text-white drop-shadow-lg">Simple, transparent pricing</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
              <div className="p-8 rounded-[2.5rem] bg-white/10 dark:bg-black/30 backdrop-blur-2xl border border-white/20 shadow-[0_16px_48px_0_rgba(0,0,0,0.4)] hover:shadow-[0_16px_48px_0_rgba(37,99,235,0.1)] transition-all">
                <h3 className="text-2xl font-bold mb-2 font-display text-white drop-shadow-md">Starter</h3>
                <p className="text-white/70 mb-6 text-sm">Perfect for new businesses.</p>
                <div className="mb-6">
                  <span className="text-4xl font-black font-display text-white drop-shadow-lg">{getCurrencySymbol()}{getPrice(0)}</span>
                  <span className="text-white/70 font-medium text-sm">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm font-medium text-white/90"><CheckCircle2 className="h-4 w-4 text-blue-400" /> Up to 50 products</li>
                  <li className="flex items-center gap-3 text-sm font-medium text-white/90"><CheckCircle2 className="h-4 w-4 text-blue-400" /> Basic reporting</li>
                  <li className="flex items-center gap-3 text-sm font-medium text-white/90"><CheckCircle2 className="h-4 w-4 text-blue-400" /> Community support</li>
                </ul>
                <Link to="/signup">
                  <Button variant="outline" className="w-full h-12 text-base rounded-full border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold shadow-lg">Get Started</Button>
                </Link>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white/20 dark:bg-black/40 backdrop-blur-3xl border-2 border-blue-400/50 shadow-[0_16px_64px_0_rgba(37,99,235,0.3)] relative transform md:-translate-y-4 hover:-translate-y-6 transition-transform">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/40">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2 font-display text-white drop-shadow-md">Professional</h3>
                <p className="text-white/70 mb-6 text-sm">For growing businesses.</p>
                <div className="mb-6">
                  <span className="text-4xl font-black font-display text-white drop-shadow-lg">{getCurrencySymbol()}{getPrice(29)}</span>
                  <span className="text-white/70 font-medium text-sm">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm font-medium text-white/90"><CheckCircle2 className="h-4 w-4 text-purple-400" /> Unlimited products</li>
                  <li className="flex items-center gap-3 text-sm font-medium text-white/90"><CheckCircle2 className="h-4 w-4 text-purple-400" /> Advanced AI Insights</li>
                  <li className="flex items-center gap-3 text-sm font-medium text-white/90"><CheckCircle2 className="h-4 w-4 text-purple-400" /> Priority support</li>
                </ul>
                <Link to="/payment?plan=pro">
                  <Button className="w-full h-12 text-base rounded-full shadow-2xl shadow-primary/40 hover:scale-[1.02] transition-transform text-white font-bold">Start 14-Day Trial</Button>
                </Link>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white/10 dark:bg-black/30 backdrop-blur-2xl border border-white/20 shadow-[0_16px_48px_0_rgba(0,0,0,0.4)] hover:shadow-[0_16px_48px_0_rgba(37,99,235,0.1)] transition-all">
                <h3 className="text-2xl font-bold mb-2 font-display text-white drop-shadow-md">Pro Plus</h3>
                <p className="text-white/70 mb-6 text-sm">For established enterprises.</p>
                <div className="mb-6">
                  <span className="text-4xl font-black font-display text-white drop-shadow-lg">{getCurrencySymbol()}{getPrice(59)}</span>
                  <span className="text-white/70 font-medium text-sm">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm font-medium text-white/90"><CheckCircle2 className="h-4 w-4 text-blue-400" /> Custom Store Website</li>
                  <li className="flex items-center gap-3 text-sm font-medium text-white/90"><CheckCircle2 className="h-4 w-4 text-blue-400" /> White-labeling</li>
                  <li className="flex items-center gap-3 text-sm font-medium text-white/90"><CheckCircle2 className="h-4 w-4 text-blue-400" /> Dedicated Manager</li>
                </ul>
                <Link to="/payment?plan=pro_plus">
                  <Button variant="outline" className="w-full h-12 text-base rounded-full border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold shadow-lg">Buy Now</Button>
                </Link>
              </div>
            </div>
          </motion.div>
          {/* Founder's Story Section */}
          <motion.div 
            id="about"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring" }}
            className="mt-40 relative py-20 px-8 md:px-16 rounded-[4rem] overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-8">
                <Star className="h-3 w-3" /> The Founder's Vision
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-10 font-display leading-tight drop-shadow-2xl">
                From a 12th Grade Desk to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Global Commerce</span>
              </h2>
              <div className="space-y-6 text-xl md:text-2xl text-white/80 font-medium leading-relaxed italic">
                <p className="drop-shadow-lg">
                  "The world was sleeping, but the screen of a 12th-grade student's laptop was glowing with a vision that would change everything. While his peers were buried in textbooks for their final exams, Priyansh was architecting a revolution. Sellora wasn't born in a boardroom; it was forged in the quiet hours of the night, between physics equations and chemistry formulas."
                </p>
                <p className="drop-shadow-lg">
                  "As a student balancing the weight of academic excellence with the fire of innovation, Priyansh saw a gap that the giants had ignored: the struggle of small business owners drowning in complexity. He didn't just want to build a tool; he wanted to build a legacy. Sellora is the manifestation of that relentless spirit—a platform designed by a dreamer for the doers, proving that age is just a number when you have the courage to redefine the future of commerce."
                </p>
              </div>
              <div className="mt-12 flex flex-col items-center">
                <div className="h-20 w-20 rounded-full border-2 border-primary/50 p-1 mb-4 shadow-2xl shadow-primary/20">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-2xl font-black text-white">
                    P
                  </div>
                </div>
                <div className="text-white font-black text-3xl tracking-tight font-display drop-shadow-lg">Priyansh Sharma</div>
                <div className="text-primary font-bold text-sm uppercase tracking-widest mt-1">Founder & CEO, Sellora</div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 dark:bg-black/10 backdrop-blur-2xl py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-primary-foreground font-bold text-lg font-display">S</span>
              </div>
              <span className="font-bold text-xl tracking-tight font-display text-foreground">Sellora</span>
            </div>
            <p className="text-base text-foreground/70 max-w-sm leading-relaxed">
              The modern operating system for your growing business. Manage inventory, billing, and growth in one place.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 font-display text-foreground">Product</h4>
            <ul className="space-y-3 text-base font-medium text-foreground/70">
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">AI Insights</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 font-display text-foreground">Company</h4>
            <ul className="space-y-3 text-base font-medium text-foreground/70">
              <li><a href="#about" className="hover:text-foreground transition-colors">Our Story</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-sm font-medium text-foreground/60 flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 Sellora Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
