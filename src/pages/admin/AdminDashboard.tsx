import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/src/store/useStore";
import { supabase } from "@/src/lib/supabase";
import { 
  Users, 
  ShieldAlert, 
  CreditCard, 
  Gift, 
  Search, 
  Ban, 
  CheckCircle, 
  MoreVertical,
  ArrowUpRight,
  TrendingUp,
  Activity,
  LogOut
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { motion } from "motion/react";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, setAdmin, allUsers, setAllUsers, blockUser, logout } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }
    fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('logon')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map Supabase data to our User interface
      const mappedUsers = data.map((u: any) => ({
        id: u.id,
        name: u.full_name,
        email: u.email,
        role: u.role,
        isBlocked: u.is_blocked,
        plan_type: 'free' as const, // Cast to PlanType
        country: 'US'
      }));
      
      setAllUsers(mappedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('logon')
        .update({ is_blocked: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      blockUser(userId, !currentStatus);
    } catch (err) {
      console.error("Error toggling block status:", err);
    }
  };

  const filteredUsers = allUsers.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Users", value: allUsers.length, icon: Users, color: "text-blue-500" },
    { label: "Active Subs", value: allUsers.filter(u => !u.isBlocked).length, icon: Activity, color: "text-green-500" },
    { label: "Blocked", value: allUsers.filter(u => u.isBlocked).length, icon: Ban, color: "text-red-500" },
    { label: "Revenue", value: "$4,290", icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Control Center</h1>
            <p className="text-slate-400 mt-1">Manage users, payments, and system security</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="border-white/10 hover:bg-white/5"
              onClick={() => {
                setAdmin(false);
                logout();
                navigate("/admin/login");
              }}
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-matte border-white/10">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Management Table */}
          <Card className="lg:col-span-2 glass-matte border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> User Management
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  placeholder="Search users..." 
                  className="bg-white/5 border-white/10 pl-10 h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-sm border-b border-white/5">
                      <th className="pb-4 font-medium">User</th>
                      <th className="pb-4 font-medium">Role</th>
                      <th className="pb-4 font-medium">Status</th>
                      <th className="pb-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">Loading users...</td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">No users found</td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {user.name?.[0] || user.email[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{user.name || "N/A"}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {user.role || 'user'}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {user.isBlocked ? (
                                <span className="flex items-center gap-1 text-xs text-red-400">
                                  <Ban className="h-3 w-3" /> Blocked
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-green-400">
                                  <CheckCircle className="h-3 w-3" /> Active
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={user.isBlocked ? "text-green-400 hover:text-green-300 hover:bg-green-500/10" : "text-red-400 hover:text-red-300 hover:bg-red-500/10"}
                              onClick={() => handleBlockToggle(user.id, !!user.isBlocked)}
                              disabled={user.role === 'admin'}
                            >
                              {user.isBlocked ? "Unblock" : "Block"}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Controls */}
          <div className="space-y-8">
            {/* Razorpay Integration */}
            <Card className="glass-matte border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-400" /> Razorpay Gateway
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-blue-300">Razorpay is currently active for all INR transactions.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Key ID</label>
                  <Input 
                    value="rzp_live_XXXXXXXXXXXXXX" 
                    readOnly 
                    className="bg-white/5 border-white/10 h-9 text-xs font-mono"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Manage API Keys
                </Button>
              </CardContent>
            </Card>

            {/* Giveaway / Coupon Management */}
            <Card className="glass-matte border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-400" /> Giveaway Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <p className="text-sm font-medium">TRIAL7</p>
                    <p className="text-xs text-slate-500">7-Day Pro Access</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Active</span>
                </div>
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
                  Create New Coupon
                </Button>
              </CardContent>
            </Card>

            {/* Security Alerts */}
            <Card className="glass-matte border-red-500/20 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-red-400">
                  <ShieldAlert className="h-5 w-5" /> Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-400">No unauthorized access attempts detected in the last 24 hours.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
