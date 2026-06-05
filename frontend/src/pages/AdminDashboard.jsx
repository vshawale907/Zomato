import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { showToast } from '../components/Toast';
import api from '../services/api';
import Pagination from '../components/Pagination';
import { Users, Store, Package, DollarSign, Trash2, TrendingUp, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(0);
  const [userTotalPages, setUserTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); loadUsers(0); }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/dashboard/stats');
      if (res.data.success) setStats(res.data.data);
    } finally { setLoading(false); }
  };

  const loadUsers = async (page) => {
    try {
      const res = await api.get(`/api/admin/users?page=${page}&size=10`);
      if (res.data.success) {
        setUsers(res.data.data.content);
        setUserTotalPages(res.data.data.totalPages);
        setUserPage(res.data.data.number);
      }
    } catch (e) { console.error(e); }
  };

  const updateRole = async (userId, role) => {
    try {
      await api.put(`/api/admin/users/${userId}/role?role=${role}`);
      showToast('User role updated!', 'success');
      loadUsers(userPage);
    } catch (e) { showToast('Failed to update role', 'error'); }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      showToast('User deleted', 'success');
      loadUsers(userPage);
    } catch (e) { showToast('Failed to delete user', 'error'); }
  };

  const TABS = [
    { id: 'overview', label: '📊 Overview', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'users', label: '👥 Users', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-softGray">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 w-full flex-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-gradient-to-br from-zomato-500 to-orange-500 p-2.5 text-white">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-darkCharcoal">Admin Dashboard</h1>
            <p className="text-sm text-mutedGray">Manage your platform</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-zomato-500 text-white shadow-sm'
                  : 'bg-white border border-borderGray text-mutedGray hover:bg-softGray'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: stats?.totalUsers || 0, icon: <Users className="h-6 w-6" />, color: 'from-blue-500 to-indigo-500' },
                { label: 'Total Restaurants', value: stats?.totalRestaurants || 0, icon: <Store className="h-6 w-6" />, color: 'from-purple-500 to-violet-500' },
                { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <Package className="h-6 w-6" />, color: 'from-orange-500 to-amber-500' },
                { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <DollarSign className="h-6 w-6" />, color: 'from-green-500 to-emerald-500' },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-2xl bg-gradient-to-br ${stat.color} p-5 text-white shadow-md`}>
                  <div className="mb-2 opacity-80">{stat.icon}</div>
                  <p className="text-2xl font-extrabold">{stat.value}</p>
                  <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Top Restaurants */}
            {stats?.topRestaurants && stats.topRestaurants.length > 0 && (
              <div className="bg-white rounded-2xl border border-borderGray shadow-card p-5">
                <h2 className="font-bold text-darkCharcoal mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-zomato-500" /> Top Restaurants by Orders
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-borderGray text-left text-xs font-semibold uppercase tracking-wider text-mutedGray">
                        <th className="py-3 pr-4">#</th>
                        <th className="py-3 pr-4">Restaurant</th>
                        <th className="py-3">Orders</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-borderGray">
                      {stats.topRestaurants.map((rest, idx) => (
                        <tr key={rest.restaurantId} className="hover:bg-softGray transition-colors">
                          <td className="py-3 pr-4 font-bold text-mutedGray">{idx + 1}</td>
                          <td className="py-3 pr-4 font-semibold text-darkCharcoal">{rest.restaurantName}</td>
                          <td className="py-3">
                            <span className="rounded-full bg-zomato-50 px-2.5 py-0.5 text-xs font-bold text-zomato-600">
                              {rest.orderCount} orders
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div>
            <h2 className="font-bold text-darkCharcoal mb-4">All Users</h2>
            <div className="bg-white rounded-2xl border border-borderGray shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-softGray border-b border-borderGray text-left text-xs font-semibold uppercase tracking-wider text-mutedGray">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderGray">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-softGray transition-colors">
                        <td className="py-3 px-4 text-mutedGray font-mono text-xs">#{u.id}</td>
                        <td className="py-3 px-4 font-semibold text-darkCharcoal">{u.fullName}</td>
                        <td className="py-3 px-4 text-mutedGray">{u.email}</td>
                        <td className="py-3 px-4 text-mutedGray">{u.phone}</td>
                        <td className="py-3 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => updateRole(u.id, e.target.value)}
                            className="rounded-lg border border-borderGray px-2 py-1 text-xs font-medium bg-white outline-none cursor-pointer"
                          >
                            <option value="CUSTOMER">Customer</option>
                            <option value="RESTAURANT_OWNER">Owner</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="p-1.5 text-mutedGray hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.length === 0 && (
                <div className="text-center py-10 text-mutedGray"><p>No users found</p></div>
              )}
            </div>
            <Pagination currentPage={userPage} totalPages={userTotalPages} onPageChange={loadUsers} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
