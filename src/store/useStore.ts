import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PlanType = 'free' | 'pro' | 'pro_plus' | 'enterprise';

export interface User {
  id: string;
  name: string;
  email: string;
  plan_type: PlanType;
  country: string;
  role?: 'user' | 'admin';
  isBlocked?: boolean;
  storeName?: string;
  storeLogo?: string;
  niche?: string;
  couponUsed?: boolean;
  paymentGateway?: {
    stripePublicKey?: string;
    stripeSecretKey?: string;
    paypalClientId?: string;
    upiId?: string;
  };
}

export const COUNTRIES = [
  { name: 'United States', code: 'US', currency: 'USD', symbol: '$' },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP', symbol: '£' },
  { name: 'India', code: 'IN', currency: 'INR', symbol: '₹' },
  { name: 'European Union', code: 'EU', currency: 'EUR', symbol: '€' },
  { name: 'Japan', code: 'JP', currency: 'JPY', symbol: '¥' },
];

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface InvoiceItem {
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  date: string;
  items: InvoiceItem[];
  total: number;
  customerName: string;
}

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  user: User | null;
  login: (user: User) => void;
  register: (user: User) => void;
  logout: () => void;
  upgradePlan: (plan: PlanType) => void;
  updateCountry: (countryCode: string) => void;
  updateStoreProfile: (name: string, logo: string) => void;
  updateStoreNiche: (niche: string) => void;

  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateStock: (id: string, stock: number) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;

  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;

  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;

  currency: string;
  language: string;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;
  getCurrencySymbol: () => string;
  getPrice: (basePrice: number) => number;

  trialActivated: boolean;
  trialExpiryDate: string | null;
  couponCode: string | null;
  activateTrial: (code: string) => boolean;
  setCouponCode: (code: string | null) => void;
  
  motivationalQuote: string;
  refreshQuote: () => void;
  updatePaymentGateway: (config: User['paymentGateway']) => void;
  
  // Admin Actions
  isAdmin: boolean;
  setAdmin: (isAdmin: boolean) => void;
  allUsers: User[];
  setAllUsers: (users: User[]) => void;
  blockUser: (userId: string, blocked: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      user: null,
      login: (user) => set({ user }),
      register: (user) => set({ 
        user, 
        products: [], 
        expenses: [], 
        invoices: [] 
      }),
      logout: () => set({ user: null }),
      upgradePlan: (plan) => set((state) => ({ user: state.user ? { ...state.user, plan_type: plan } : null })),
      updateCountry: (countryCode) => set((state) => ({ 
        user: state.user ? { ...state.user, country: countryCode } : null 
      })),
      updateStoreProfile: (name, logo) => set((state) => ({
        user: state.user ? { ...state.user, storeName: name, storeLogo: logo } : null
      })),
      updateStoreNiche: (niche) => set((state) => ({
        user: state.user ? { ...state.user, niche } : null
      })),

      products: [
        { id: '1', name: 'Premium Wireless Headphones', price: 299, stock: 45 },
        { id: '2', name: 'Ergonomic Office Chair', price: 199, stock: 12 },
        { id: '3', name: 'Mechanical Keyboard', price: 149, stock: 4 }, // Low stock
      ],
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: Math.random().toString(36).substr(2, 9) }]
      })),
      updateStock: (id, stock) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, stock } : p)
      })),
      updateProduct: (id, updatedProduct) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedProduct } : p)
      })),

      expenses: [
        { id: '1', description: 'Software Subscriptions', amount: 120, date: new Date().toISOString() },
        { id: '2', description: 'Office Supplies', amount: 45, date: new Date().toISOString() },
      ],
      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: Math.random().toString(36).substr(2, 9) }]
      })),

      invoices: [
        {
          id: 'INV-001',
          date: new Date().toISOString(),
          customerName: 'Acme Corp',
          items: [{ productId: '1', quantity: 2, price: 299, total: 598 }],
          total: 598
        }
      ],
      addInvoice: (invoice) => set((state) => ({
        invoices: [...state.invoices, { ...invoice, id: `INV-${Math.floor(Math.random() * 10000)}` }]
      })),

      currency: 'USD',
      language: 'EN',
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
      getCurrencySymbol: () => {
        const { currency } = useStore.getState();
        switch(currency) {
          case 'EUR': return '€';
          case 'GBP': return '£';
          case 'INR': return '₹';
          default: return '$';
        }
      },
      getPrice: (basePrice: number) => {
        if (basePrice === 0) return 0;
        const { currency } = useStore.getState();
        switch(currency) {
          case 'EUR': return Math.round(basePrice * 0.92);
          case 'GBP': return Math.round(basePrice * 0.79);
          case 'INR': return Math.round(basePrice * 83);
          default: return basePrice;
        }
      },

  trialActivated: false,
  trialExpiryDate: null,
  couponCode: null,
  setCouponCode: (code) => set({ couponCode: code }),
  
  motivationalQuote: "The secret of getting ahead is getting started. - Mark Twain",
  refreshQuote: () => {
    const quotes = [
      "The secret of getting ahead is getting started. - Mark Twain",
      "Success is not final; failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
      "Don't be afraid to give up the good to go for the great. - John D. Rockefeller",
      "I find that the harder I work, the more luck I seem to have. - Thomas Jefferson",
      "Opportunities don't happen. You create them. - Chris Grosser",
      "Stop chasing the money and start chasing the passion. - Tony Hsieh",
      "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
      "The way to get started is to quit talking and begin doing. - Walt Disney",
      "If you are not embarrassed by the first version of your product, you’ve launched too late. - Reid Hoffman",
      "Your most unhappy customers are your greatest source of learning. - Bill Gates"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    set({ motivationalQuote: randomQuote });
  },

  updatePaymentGateway: (config) => set((state) => ({
    user: state.user ? { ...state.user, paymentGateway: config } : null
  })),

  isAdmin: false,
  setAdmin: (isAdmin) => set({ isAdmin }),
  allUsers: [],
  setAllUsers: (users) => set({ allUsers: users }),
  blockUser: (userId, blocked) => set((state) => ({
    allUsers: state.allUsers.map(u => u.id === userId ? { ...u, isBlocked: blocked } : u)
  })),

  activateTrial: (code) => {
    const state = useStore.getState();
    if (state.user?.couponUsed) return false;

    if (code === 'TRIAL7' || code === state.couponCode) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      set({ 
        trialActivated: true, 
        trialExpiryDate: expiry.toISOString(),
        user: state.user ? { ...state.user, plan_type: 'pro_plus', couponUsed: true } : null
      });
      return true;
    }
    return false;
  },
    }),
    {
      name: 'sellora-storage',
    }
  )
);
