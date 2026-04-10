import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { useStore, PlanType, COUNTRIES } from '@/src/store/useStore';
import { Check, Zap, Globe, Store, Upload, Gift } from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();
  const { user, upgradePlan, updateCountry, updateStoreProfile, activateTrial } = useStore();
  const [storeName, setStoreName] = useState(user?.storeName || '');
  const [storeLogo, setStoreLogo] = useState(user?.storeLogo || '');

  const handleUpgrade = (plan: PlanType) => {
    if (plan === 'pro' || plan === 'enterprise') {
      navigate('/payment');
    } else {
      upgradePlan(plan);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStoreProfile = () => {
    updateStoreProfile(storeName, storeLogo);
    alert('Store profile updated successfully!');
  };

  const currencySymbol = COUNTRIES.find(c => c.code === user?.country)?.symbol || '$';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account and subscription.</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Store className="h-5 w-5" /> Store Profile
        </h3>
        <Card>
          <CardHeader>
            <CardTitle>Store Details</CardTitle>
            <CardDescription>Update your store's public information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-md space-y-2">
              <label className="text-sm font-medium">Store Name</label>
              <Input 
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. My Awesome Store"
              />
            </div>
            <div className="max-w-md space-y-2">
              <label className="text-sm font-medium">Store Logo</label>
              <div className="flex items-center gap-4">
                {storeLogo ? (
                  <img src={storeLogo} alt="Store Logo" className="h-16 w-16 rounded-md object-cover border" />
                ) : (
                  <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center border border-dashed">
                    <Store className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Recommended size: 256x256px. Max 2MB.</p>
                </div>
              </div>
            </div>
            <Button onClick={handleSaveStoreProfile} className="mt-2">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Globe className="h-5 w-5" /> Localization
        </h3>
        <Card>
          <CardHeader>
            <CardTitle>Country & Currency</CardTitle>
            <CardDescription>Select your country to update your dashboard currency.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs space-y-2">
              <label className="text-sm font-medium">Country / Region</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={user?.country}
                onChange={(e) => updateCountry(e.target.value)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.currency})
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">This will change the currency symbol across your entire dashboard.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Gift className="h-5 w-5" /> Special Offers
        </h3>
        <Card>
          <CardHeader>
            <CardTitle>Redeem Coupon</CardTitle>
            <CardDescription>Enter a coupon code to unlock premium features.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md flex gap-2">
              <Input 
                placeholder="Enter code (e.g. TRIAL7)" 
                id="coupon-input"
              />
              <Button onClick={() => {
                const input = document.getElementById('coupon-input') as HTMLInputElement;
                if (activateTrial(input.value)) {
                  alert('Coupon applied! You now have 7 days of Pro Plus.');
                } else {
                  if (user?.couponUsed) {
                    alert('You have already used a coupon on this account.');
                  } else {
                    alert('Invalid coupon code.');
                  }
                }
              }}>
                Apply
              </Button>
            </div>
            {user?.couponUsed && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Check className="h-3 w-3 text-green-500" /> Coupon already used for this account.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Subscription Plan</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <Card className={user?.plan_type === 'free' ? 'border-primary shadow-md' : ''}>
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <CardDescription>Perfect for new businesses.</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{currencySymbol}0</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> Up to 50 products
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> Basic reporting
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> Community support
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={user?.plan_type === 'free' ? 'outline' : 'default'}
                disabled={user?.plan_type === 'free'}
                onClick={() => handleUpgrade('free')}
              >
                {user?.plan_type === 'free' ? 'Current Plan' : 'Downgrade'}
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className={`relative ${user?.plan_type === 'pro' ? 'border-primary shadow-md' : ''}`}>
            {user?.plan_type !== 'pro' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Recommended
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <CardDescription>For growing businesses.</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{currencySymbol}29</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> Unlimited products
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> Advanced AI Insights
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> Priority support
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={user?.plan_type === 'pro' ? 'outline' : 'default'}
                disabled={user?.plan_type === 'pro'}
                onClick={() => handleUpgrade('pro')}
              >
                {user?.plan_type === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className={user?.plan_type === 'enterprise' ? 'border-primary shadow-md' : ''}>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For large scale operations.</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{currencySymbol}99</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> Everything in Pro
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> Custom integrations
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> Dedicated account manager
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={user?.plan_type === 'enterprise' ? 'outline' : 'default'}
                disabled={user?.plan_type === 'enterprise'}
                onClick={() => handleUpgrade('enterprise')}
              >
                {user?.plan_type === 'enterprise' ? 'Current Plan' : 'Upgrade to Enterprise'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
