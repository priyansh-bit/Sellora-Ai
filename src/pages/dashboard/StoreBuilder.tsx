import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useStore } from "@/src/store/useStore";
import {
  Store as StoreIcon,
  Globe,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Bitcoin,
  Smartphone,
  X,
  Palette,
  Settings,
  Eye,
  Share2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function StoreBuilder() {
  const navigate = useNavigate();
  const { user, products, updatePaymentGateway } = useStore();
  const [storeName, setStoreName] = useState(
    user?.storeName || "My Awesome Store",
  );
  const [isPublished, setIsPublished] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const containerRef = useRef<HTMLDivElement>(null);

  // AI Store States
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStoreUrl, setAiStoreUrl] = useState("");

  // Payment Setup States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState({
    card: true,
    crypto: false,
    upi: true,
  });

  // Payment Gateway Config States
  const [gatewayConfig, setGatewayConfig] = useState({
    stripePublicKey: user?.paymentGateway?.stripePublicKey || '',
    stripeSecretKey: user?.paymentGateway?.stripeSecretKey || '',
    paypalClientId: user?.paymentGateway?.paypalClientId || '',
    upiId: user?.paymentGateway?.upiId || '',
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const cards = containerRef.current.querySelectorAll('.hover-glow');
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGenerateAIStore = () => {
    setIsGenerating(true);
    // Simulate AI generation based on user data
    setTimeout(() => {
      setIsGenerating(false);
      const uniqueId = Math.random().toString(36).substring(2, 8);
      setAiStoreUrl(`sellora.com/ai/${user?.niche || "store"}-${uniqueId}`);
    }, 2500);
  };

  const handleSaveGateway = () => {
    updatePaymentGateway(gatewayConfig);
    alert('Payment gateway configuration saved successfully!');
  };

  const handlePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowPaymentModal(false);
      }, 2000);
    }, 1500);
  };

  const TABS = [
    { id: "general", label: "General Settings", icon: Settings },
    { id: "ai", label: "AI Store Generator", icon: Sparkles },
    { id: "payments", label: "Payment Gateway", icon: ShieldCheck },
    { id: "preview", label: "Live Preview", icon: Eye },
  ];

  const storeUrl = `sellora.com/${storeName.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-8" ref={containerRef}>
      <div>
          <h2 className="text-3xl font-bold tracking-tight">Store Builder</h2>
          <p className="text-muted-foreground mt-1">
            Create and manage your public storefront.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 shrink-0">
            <nav className="flex flex-row lg:flex-col gap-4 overflow-x-auto pb-2 lg:pb-0">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap glass-matte hover-glow ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className={`h-4 w-4 ${isActive ? "" : "opacity-70"}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <Card className="glass-matte hover-glow">
                      <CardHeader>
                        <CardTitle>Standard Store Details</CardTitle>
                        <CardDescription>
                          Configure your manual storefront.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2 max-w-md">
                          <label className="text-sm font-medium">Store Name</label>
                          <Input
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            placeholder="Your Store Name"
                          />
                        </div>
                        <div className="space-y-2 max-w-md">
                          <label className="text-sm font-medium">Store URL</label>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground bg-muted/50 px-3 py-2 rounded-md border text-sm">
                              sellora.com/
                            </span>
                            <Input
                              value={storeName.toLowerCase().replace(/\s+/g, "-")}
                              readOnly
                              className="bg-muted/30"
                            />
                          </div>
                        </div>
                        <div className="pt-4 border-t">
                          <Button
                            onClick={() => setIsPublished(true)}
                            disabled={isPublished}
                          >
                            {isPublished ? (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Published
                              </>
                            ) : (
                              "Publish Store"
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {isPublished && (
                      <Card className="glass-matte hover-glow border-primary/30">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Share2 className="h-5 w-5 text-primary" />
                            Share Your Store
                          </CardTitle>
                          <CardDescription>
                            Your store is live! Share this link with your customers to start selling.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20">
                            <Globe className="h-5 w-5 text-primary shrink-0" />
                            <span className="text-sm font-medium flex-1 truncate">{storeUrl}</span>
                            <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(storeUrl)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => window.open(`https://${storeUrl}`, '_blank')}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={() => alert('Shared to WhatsApp!')}>WhatsApp</Button>
                            <Button variant="outline" className="flex-1" onClick={() => alert('Shared to Instagram!')}>Instagram</Button>
                            <Button variant="outline" className="flex-1" onClick={() => alert('Shared to Facebook!')}>Facebook</Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {activeTab === "ai" && (
                  <Card className="glass-matte hover-glow border-primary/50 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                      PRO
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI Web Store Generator
                      </CardTitle>
                      <CardDescription>
                        Let AI build a highly-converting store based on your niche (
                        {user?.niche || "Not selected"}) and {products.length} products.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {user?.plan_type === "free" ? (
                        <div className="bg-muted/50 p-8 rounded-lg text-center max-w-md mx-auto border border-dashed">
                          <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Unlock AI Store Generation</h3>
                          <p className="text-sm text-muted-foreground mb-6">
                            Upgrade to Pro to automatically generate a beautiful, high-converting storefront tailored to your niche.
                          </p>
                          <Button className="w-full" onClick={() => navigate('/payment')}>
                            Upgrade to Pro
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 max-w-md">
                          {!aiStoreUrl ? (
                            <Button
                              className="w-full h-12"
                              onClick={handleGenerateAIStore}
                              disabled={isGenerating}
                            >
                              {isGenerating ? (
                                <span className="flex items-center gap-2">
                                  <Sparkles className="h-4 w-4 animate-spin" />{" "}
                                  Generating your store...
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <Sparkles className="h-4 w-4" /> Generate Private AI
                                  Store
                                </span>
                              )}
                            </Button>
                          ) : (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-xl">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-300" />
                                </div>
                                <div>
                                  <p className="font-semibold text-green-800 dark:text-green-300">
                                    Your AI Store is ready!
                                  </p>
                                  <p className="text-xs text-green-700/70 dark:text-green-400/70">
                                    Share this private URL with your customers.
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  value={aiStoreUrl}
                                  readOnly
                                  className="bg-white dark:bg-black"
                                />
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    navigator.clipboard.writeText(aiStoreUrl)
                                  }
                                >
                                  Copy
                                </Button>
                              </div>
                            </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "payments" && (
                <div className="space-y-6">
                  <Card className="glass-matte hover-glow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        Payment Gateway Configuration
                      </CardTitle>
                      <CardDescription>
                        Connect your payment providers to receive money directly from customers.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-blue-500" /> Stripe Integration
                          </h4>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase">Public Key</label>
                            <Input 
                              placeholder="pk_test_..." 
                              value={gatewayConfig.stripePublicKey}
                              onChange={(e) => setGatewayConfig({...gatewayConfig, stripePublicKey: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase">Secret Key</label>
                            <Input 
                              type="password" 
                              placeholder="sk_test_..." 
                              value={gatewayConfig.stripeSecretKey}
                              onChange={(e) => setGatewayConfig({...gatewayConfig, stripeSecretKey: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-green-500" /> UPI / PayPal
                          </h4>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase">UPI ID (VPA)</label>
                            <Input 
                              placeholder="yourname@upi" 
                              value={gatewayConfig.upiId}
                              onChange={(e) => setGatewayConfig({...gatewayConfig, upiId: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase">PayPal Client ID</label>
                            <Input 
                              placeholder="Client ID" 
                              value={gatewayConfig.paypalClientId}
                              onChange={(e) => setGatewayConfig({...gatewayConfig, paypalClientId: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t flex justify-end">
                        <Button onClick={handleSaveGateway}>Save Gateway Config</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-matte hover-glow">
                    <CardHeader>
                      <CardTitle>Active Payment Methods</CardTitle>
                      <CardDescription>
                        Enable or disable specific payment options for your customers.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-w-2xl">
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between p-4 border rounded-xl hover:border-primary/50 transition-colors bg-card/50">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-medium">Credit/Debit Card</p>
                              <p className="text-xs text-muted-foreground">
                                Stripe, Razorpay, PayPal
                              </p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={paymentMethods.card}
                            onChange={(e) =>
                              setPaymentMethods({
                                ...paymentMethods,
                                card: e.target.checked,
                              })
                            }
                            className="toggle"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-xl hover:border-primary/50 transition-colors bg-card/50">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                              <Bitcoin className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                              <p className="font-medium">Cryptocurrency</p>
                              <p className="text-xs text-muted-foreground">
                                Accept BTC, ETH, USDC
                              </p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={paymentMethods.crypto}
                            onChange={(e) =>
                              setPaymentMethods({
                                ...paymentMethods,
                                crypto: e.target.checked,
                              })
                            }
                            className="toggle"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-xl hover:border-primary/50 transition-colors bg-card/50">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                              <Smartphone className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                              <p className="font-medium">UPI (India)</p>
                              <p className="text-xs text-muted-foreground">
                                Google Pay, PhonePe, Paytm
                              </p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={paymentMethods.upi}
                            onChange={(e) =>
                              setPaymentMethods({
                                ...paymentMethods,
                                upi: e.target.checked,
                              })
                            }
                            className="toggle"
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t mt-6">
                        <Button
                          variant="outline"
                          onClick={() => setShowPaymentModal(true)}
                        >
                          Preview Checkout Popup
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "preview" && (
                <div className="glass-matte border rounded-2xl overflow-hidden bg-white shadow-sm aspect-[9/16] md:aspect-auto md:h-[700px] flex flex-col relative max-w-sm mx-auto lg:max-w-none hover-glow">
                  <div className="h-14 border-b flex items-center justify-between px-6 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <StoreIcon className="h-5 w-5 text-gray-700" />
                      <span className="font-semibold text-gray-900">
                        {storeName || "Store Name"}
                      </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                  </div>
                  <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                    {aiStoreUrl ? (
                      <div className="h-40 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 flex flex-col items-center justify-center text-white p-6 text-center shadow-lg">
                        <Sparkles className="h-8 w-8 mb-2 opacity-80" />
                        <span className="font-bold text-xl">AI Generated Store</span>
                        <span className="text-sm opacity-90 mt-1">
                          Optimized for {user?.niche || "your niche"}
                        </span>
                      </div>
                    ) : (
                      <div className="h-32 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 mb-6 flex items-center justify-center">
                        <span className="text-blue-800 font-medium">
                          Welcome to {storeName}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {products.length > 0
                        ? products.slice(0, 4).map((p) => (
                            <div
                              key={p.id}
                              className="bg-white p-3 rounded-xl border shadow-sm"
                            >
                              {p.image ? (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="aspect-square rounded-lg object-cover mb-3 w-full"
                                />
                              ) : (
                                <div className="aspect-square rounded-lg bg-gray-100 mb-3 flex items-center justify-center">
                                  <StoreIcon className="h-8 w-8 text-gray-300" />
                                </div>
                              )}
                              <div className="font-medium text-sm text-gray-900 truncate">
                                {p.name}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                ${p.price.toFixed(2)}
                              </div>
                              <button
                                className="w-full mt-3 bg-gray-900 text-white text-xs py-2 rounded-lg font-medium"
                                onClick={() => setShowPaymentModal(true)}
                              >
                                Buy Now
                              </button>
                            </div>
                          ))
                        : [1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="bg-white p-3 rounded-xl border shadow-sm"
                            >
                              <div className="aspect-square rounded-lg bg-gray-100 mb-3" />
                              <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
                              <div className="h-4 w-1/3 bg-gray-200 rounded" />
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Payment Popup Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">Complete Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-1 rounded-full hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-3xl font-bold mt-1">$99.00</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Select Payment Method</p>

                  {paymentMethods.card && (
                    <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-primary transition-colors">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Credit / Debit Card</span>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        className="h-4 w-4 text-primary"
                        defaultChecked
                      />
                    </label>
                  )}

                  {paymentMethods.crypto && (
                    <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-primary transition-colors">
                      <div className="flex items-center gap-3">
                        <Bitcoin className="h-5 w-5 text-orange-500" />
                        <span className="font-medium">Pay with Crypto</span>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        className="h-4 w-4 text-primary"
                      />
                    </label>
                  )}

                  {paymentMethods.upi && (
                    <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-primary transition-colors">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-green-600" />
                        <span className="font-medium">UPI / QR Code</span>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        className="h-4 w-4 text-primary"
                      />
                    </label>
                  )}
                </div>

                <Button
                  className="w-full h-12 text-base"
                  onClick={handlePayment}
                  disabled={isProcessingPayment || paymentSuccess}
                >
                  {isProcessingPayment ? "Processing..." : paymentSuccess ? "Success!" : "Pay Now"}
                </Button>

                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  Secured by Sellora Payments
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
