import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/useStore';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  Wallet, 
  Sparkles, 
  Megaphone, 
  Settings as SettingsIcon, 
  LogOut,
  Moon,
  Sun,
  Lock,
  Store,
  Clock,
  Gift,
  X,
  Truck,
  MessageSquare,
  PhoneCall
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'motion/react';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/inventory', icon: Package },
  { name: 'Billing', href: '/dashboard/billing', icon: Receipt },
  { name: 'Finances', href: '/dashboard/expenses', icon: Wallet },
  { name: 'Online Store', href: '/dashboard/store', icon: Store },
  { name: 'AI Insights', href: '/dashboard/ai', icon: Sparkles, pro: true },
  { name: 'Marketing', href: '/dashboard/ads', icon: Megaphone, disabled: true },
  { name: 'Dropshipping', href: '#', icon: Truck, disabled: true },
  { name: 'WhatsApp Bot', href: '#', icon: MessageSquare, disabled: true },
  { name: 'AI Call Assistant', href: '#', icon: PhoneCall, disabled: true },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, theme, toggleTheme, trialActivated, trialExpiryDate, couponCode } = useStore();
  const [timeLeft, setTimeLeft] = useState("");
  const [showCoupon, setShowCoupon] = useState(!!couponCode);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.isBlocked) {
      alert("Your account has been blocked by the administrator.");
      logout();
      navigate('/login');
    }
  }, [user, navigate, logout]);

  useEffect(() => {
    if (trialActivated && trialExpiryDate) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(trialExpiryDate).getTime();
        const diff = expiry - now;

        if (diff <= 0) {
          setTimeLeft("Expired");
          clearInterval(interval);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [trialActivated, trialExpiryDate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen dashboard-bg">
      <div className="dashboard-overlay min-h-screen">
        {/* Coupon Notification */}
      <AnimatePresence>
        {showCoupon && !trialActivated && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md"
          >
            <div className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Special Offer for New User!</p>
                  <p className="text-xs opacity-90">Use code <span className="font-mono font-black underline">{couponCode}</span> for 1 week free Pro Plus!</p>
                </div>
              </div>
              <button onClick={() => setShowCoupon(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 border-r glass-matte">
        <div className="flex h-16 items-center px-4 border-b">
          <div className="flex items-center gap-3 w-full hover:bg-accent/50 p-2 rounded-md cursor-pointer transition-colors" onClick={() => navigate('/dashboard/settings')}>
            {user.storeLogo ? (
              <img src={user.storeLogo} alt="Store Logo" className="h-8 w-8 rounded object-cover border" />
            ) : (
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {user.storeName ? user.storeName.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">{user.storeName || 'My Store'}</span>
              <span className="text-xs text-muted-foreground truncate">{user.name}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between h-[calc(100vh-4rem)]">
          <div className="flex-1 overflow-y-auto">
            {trialActivated && (
              <div className="px-4 pt-4">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-3 w-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Trial Ends In</span>
                  </div>
                  <div className="text-lg font-mono font-bold tracking-tighter">
                    {timeLeft}
                  </div>
                </div>
              </div>
            )}

            <nav className="space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const isLocked = item.pro && user.plan_type === 'free';
                
                return (
                  <Link
                    key={item.name}
                    to={item.disabled || isLocked ? '#' : item.href}
                    className={cn(
                      "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-accent/80 text-accent-foreground font-semibold" 
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                      (item.disabled || isLocked) && "opacity-50 cursor-not-allowed hover:bg-transparent"
                    )}
                    onClick={(e) => {
                      if (item.disabled || isLocked) {
                        e.preventDefault();
                        if (isLocked) navigate('/dashboard/settings');
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("h-4 w-4", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                      {item.name}
                    </div>
                    {isLocked && <Lock className="h-3 w-3" />}
                    {item.disabled && <span className="text-[10px] uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded">Soon</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-3 border-t space-y-2">
            <Link
              to="/dashboard/settings"
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === '/dashboard/settings'
                  ? "bg-accent/80 text-accent-foreground font-semibold" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <SettingsIcon className="h-4 w-4" />
              Settings
            </Link>
            
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-muted-foreground">Theme</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            
            {user.plan_type === 'free' && (
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 mx-2 mb-2">
                <h4 className="text-sm font-semibold text-primary mb-1">Upgrade to Pro</h4>
                <p className="text-xs text-muted-foreground mb-3">Unlock AI insights.</p>
                <Button size="sm" className="w-full h-8 text-xs" onClick={() => navigate('/payment')}>
                  Upgrade
                </Button>
              </div>
            )}

            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
              <LogOut className="mr-3 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8 max-w-5xl mx-auto">
          {children}
        </main>
      </div>
      </div>
    </div>
  );
}

