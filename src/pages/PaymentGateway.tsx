import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { useStore } from '@/src/store/useStore';
import { 
  Shield, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Bitcoin, 
  Smartphone,
  Globe,
  MapPin,
  Mail,
  User,
  Phone,
  Lock,
  Gift
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

import { loadRazorpay } from '@/src/lib/razorpay';

export function PaymentGateway() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  const { 
    upgradePlan, 
    activateTrial, 
    couponCode: storedCoupon,
    getCurrencySymbol,
    getPrice,
    currency
  } = useStore();
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0); // Percentage
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'crypto'>('card');

  const planDetails = {
    pro: { name: 'Professional', price: 29, features: ['Unlimited products', 'Advanced AI Insights', 'Priority support'] },
    pro_plus: { name: 'Pro Plus', price: 59, features: ['Everything in Pro', 'Custom Store Website', 'Dedicated Account Manager', 'White-labeling'] }
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.pro;
  const basePrice = getPrice(currentPlan.price);
  const discountAmount = Math.round((basePrice * discount) / 100);
  const totalPrice = basePrice - discountAmount;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      if (totalPrice > 0 && currency === 'INR') {
        const result: any = await loadRazorpay(totalPrice, 'INR', `Sellora ${currentPlan.name} Plan`);
        if (!result.success) {
          throw new Error('Payment failed or cancelled');
        }
      } else {
        // Simulate other payments
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      setSuccess(true);
      if (discount === 100) {
        activateTrial(couponCode);
      } else {
        upgradePlan(plan as any);
      }
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyCoupon = () => {
    setError('');
    const code = couponCode.toUpperCase();

    if (code === storedCoupon || code === 'TRIAL7') {
      setDiscount(100);
      setError('');
    } else if (code === 'SAVE50') {
      setDiscount(50);
      setError('');
    } else if (code === 'WELCOME10') {
      setDiscount(10);
      setError('');
    } else {
      setDiscount(0);
      setError('Invalid coupon code');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold">Payment Successful!</h2>
          <p className="text-muted-foreground">Your {currentPlan.name} plan is now active. Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Side - Hero/Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1a0b2e] via-[#4b1d52] to-[#110524] p-12 flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-20">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Sellora</span>
          </Link>

          <div className="mt-auto mb-20">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
              Complete your purchase and start scaling with {currentPlan.name}
            </h1>
            <div className="space-y-6">
              {currentPlan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-white/90">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-12 border-t border-white/10">
            <div className="flex items-center gap-4 text-white/80">
              <Shield className="h-6 w-6 text-primary" />
              <p className="text-sm">Secure 256-bit SSL encrypted payment processing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Payment Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-12 lg:p-20 overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 h-auto hover:bg-transparent text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Total Amount</p>
              <div className="flex flex-col items-end">
                {discount > 0 && (
                  <p className="text-sm text-muted-foreground line-through decoration-red-500/50">
                    {getCurrencySymbol()}{basePrice}
                  </p>
                )}
                <p className="text-2xl font-black text-primary">
                  {getCurrencySymbol()}{totalPrice}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Checkout</h2>
            <p className="text-muted-foreground">Fill in your details to complete the order.</p>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Full Name</label>
                  <div className="relative">
                    <Input placeholder="John Doe" required className="pl-10 h-12" />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Email Address</label>
                  <div className="relative">
                    <Input type="email" placeholder="john@example.com" required className="pl-10 h-12" />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Mobile Number</label>
                  <div className="relative">
                    <Input type="tel" placeholder="+1 234 567 890" required className="pl-10 h-12" />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Country</label>
                  <div className="relative">
                    <Input placeholder="United States" required className="pl-10 h-12" />
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Shipping Address</label>
                <div className="relative">
                  <Input placeholder="123 Business St, Suite 100" required className="pl-10 h-12" />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 relative overflow-hidden group",
                    paymentMethod === 'card' 
                      ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(37,99,235,0.2)]" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {paymentMethod === 'card' && (
                    <motion.div 
                      layoutId="glow"
                      className="absolute inset-0 bg-primary/10 blur-xl -z-10"
                    />
                  )}
                  <CreditCard className={cn("h-6 w-6 transition-transform group-hover:scale-110", paymentMethod === 'card' ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-xs font-bold">Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 relative overflow-hidden group",
                    paymentMethod === 'upi' 
                      ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(37,99,235,0.2)]" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {paymentMethod === 'upi' && (
                    <motion.div 
                      layoutId="glow"
                      className="absolute inset-0 bg-primary/10 blur-xl -z-10"
                    />
                  )}
                  <Smartphone className={cn("h-6 w-6 transition-transform group-hover:scale-110", paymentMethod === 'upi' ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-xs font-bold">UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 relative overflow-hidden group",
                    paymentMethod === 'crypto' 
                      ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(37,99,235,0.2)]" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {paymentMethod === 'crypto' && (
                    <motion.div 
                      layoutId="glow"
                      className="absolute inset-0 bg-primary/10 blur-xl -z-10"
                    />
                  )}
                  <Bitcoin className={cn("h-6 w-6 transition-transform group-hover:scale-110", paymentMethod === 'crypto' ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-xs font-bold">Crypto</span>
                </button>
              </div>
            </div>

            {/* Payment Details based on method */}
            {totalPrice > 0 ? (
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border space-y-4">
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Card Number</label>
                      <Input placeholder="0000 0000 0000 0000" required className="h-12" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Expiry</label>
                        <Input placeholder="MM/YY" required className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">CVV</label>
                        <Input placeholder="123" required className="h-12" />
                      </div>
                    </div>
                  </div>
                )}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4 text-center py-4">
                    <div className="h-32 w-32 bg-white p-2 rounded-lg mx-auto border shadow-sm">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=sellora-payment" alt="UPI QR" className="w-full h-full" />
                    </div>
                    <p className="text-sm font-medium">Scan QR code or enter UPI ID</p>
                    <Input placeholder="username@upi" className="h-12 text-center" />
                  </div>
                )}
                {paymentMethod === 'crypto' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Select Currency</label>
                      <select className="w-full h-12 rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>Bitcoin (BTC)</option>
                        <option>Ethereum (ETH)</option>
                        <option>USDT (ERC20)</option>
                      </select>
                    </div>
                    <div className="p-3 bg-white dark:bg-black rounded border font-mono text-[10px] break-all">
                      0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground uppercase font-bold">Send exactly {totalPrice / 10000} BTC to this address</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center text-center gap-3">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-primary">Free Trial Activated!</p>
                  <p className="text-xs text-muted-foreground">No payment required. Click below to start your 1-week trial.</p>
                </div>
              </div>
            )}

            {/* Coupon Section */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input 
                  placeholder="Coupon Code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="h-12"
                />
                <Button type="button" variant="outline" onClick={handleApplyCoupon} className="h-12 px-6">Apply</Button>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              {storedCoupon && (
                <p className="text-xs text-muted-foreground">
                  Your trial code: <span className="font-mono font-bold text-primary">{storedCoupon}</span>
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20" disabled={isProcessing}>
              {isProcessing 
                ? 'Processing...' 
                : totalPrice === 0 
                  ? 'Activate Free Trial' 
                  : `Complete Purchase - ${getCurrencySymbol()}${totalPrice}`
              }
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            By completing this purchase, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
