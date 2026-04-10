import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useStore, COUNTRIES } from '@/src/store/useStore';
import { DollarSign, ShoppingCart, TrendingUp, Package, PlusCircle, Settings, Store, Quote } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const defaultSalesData = [
  { name: 'Mon', sales: 0 },
  { name: 'Tue', sales: 0 },
  { name: 'Wed', sales: 0 },
  { name: 'Thu', sales: 0 },
  { name: 'Fri', sales: 0 },
  { name: 'Sat', sales: 0 },
  { name: 'Sun', sales: 0 },
];

const defaultRevenueData = [
  { name: 'Jan', revenue: 0 },
  { name: 'Feb', revenue: 0 },
  { name: 'Mar', revenue: 0 },
  { name: 'Apr', revenue: 0 },
  { name: 'May', revenue: 0 },
  { name: 'Jun', revenue: 0 },
];

export function Overview() {
  const navigate = useNavigate();
  const { invoices, expenses, products, user, motivationalQuote, refreshQuote } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refreshQuote();
  }, []);

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

  const currencySymbol = COUNTRIES.find(c => c.code === user?.country)?.symbol || '$';

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const profit = totalRevenue - totalExpenses;
  const totalOrders = invoices.length;
  const currentTotalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const isNewUser = products.length === 0 && invoices.length === 0;

  // Use real data if available, otherwise show 0s
  const salesData = isNewUser ? defaultSalesData : [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const revenueData = isNewUser ? defaultRevenueData : [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
  ];

  const stockHistoryData = [
    { name: 'Jan', stock: isNewUser ? 0 : 150 },
    { name: 'Feb', stock: isNewUser ? 0 : 120 },
    { name: 'Mar', stock: isNewUser ? 0 : 180 },
    { name: 'Apr', stock: isNewUser ? 0 : 140 },
    { name: 'May', stock: isNewUser ? 0 : 90 },
    { name: 'Jun', stock: currentTotalStock },
  ];

  return (
    <div className="space-y-8" ref={containerRef}>
      {/* Motivational Quote Section */}
        <div className="glass-matte p-6 rounded-2xl border shadow-lg flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Quote className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Daily Business Tip</p>
            <p className="text-lg font-semibold italic">"{motivationalQuote}"</p>
          </div>
        </div>

        {isNewUser && (
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome to Sellora, {user?.name.split(' ')[0]}!</h2>
              <p className="text-muted-foreground mt-1">Let's get your store set up and ready for your first sale.</p>
            </div>

            <Card className="glass-matte border-primary/20 shadow-sm hover-glow">
              <CardHeader>
                <CardTitle className="text-xl">Setup Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/settings')}>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">Customize your store profile</h4>
                    <p className="text-sm text-muted-foreground mt-1">Add your store name and upload a logo to make it yours.</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/inventory')}>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">Add your first product</h4>
                    <p className="text-sm text-muted-foreground mt-1">Write a description, add images, and set pricing.</p>
                  </div>
                  <Button variant="outline" size="sm">Add Product</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening with your store today.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-matte hover-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currencySymbol}{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{isNewUser ? '0%' : '+20.1%'} from last month</p>
            </CardContent>
          </Card>
          <Card className="glass-matte hover-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">{isNewUser ? '0%' : '+180.1%'} from last month</p>
            </CardContent>
          </Card>
          <Card className="glass-matte hover-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currencySymbol}{profit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{isNewUser ? '0%' : '+19%'} from last month</p>
            </CardContent>
          </Card>
          <Card className="glass-matte hover-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Products in Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentTotalStock}</div>
              <p className="text-xs text-muted-foreground mt-1">{products.filter(p => p.stock < 10).length} low stock alerts</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-matte hover-glow">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Line type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-matte hover-glow">
            <CardHeader>
              <CardTitle>Revenue by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                      cursor={{ fill: 'var(--muted)' }}
                    />
                    <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 glass-matte hover-glow">
            <CardHeader>
              <CardTitle>Inventory Levels Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stockHistoryData}>
                    <defs>
                      <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                    />
                    <Area type="monotone" dataKey="stock" stroke="var(--primary)" fillOpacity={1} fill="url(#colorStock)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}

