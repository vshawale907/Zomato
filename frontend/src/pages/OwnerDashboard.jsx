import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { showToast } from '../components/Toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BarChart2, Package, Store, DollarSign, Plus, Edit3, Trash2, X, ChevronDown, CheckCircle } from 'lucide-react';
import Pagination from '../components/Pagination';

const CATEGORIES = ['Starters', 'Main Course', 'Desserts', 'Beverages'];
const ORDER_STATUSES = ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Restaurant form
  const [showRestForm, setShowRestForm] = useState(false);
  const [editingRest, setEditingRest] = useState(null);
  const [restForm, setRestForm] = useState({ name: '', description: '', cuisineType: '', address: '', city: '', deliveryTime: 30, minimumOrder: 200, openingTime: '10:00 AM', closingTime: '11:00 PM', image: '', coverImage: '' });

  // Menu form
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: 'Main Course', veg: true, available: true, image: '' });

  const [orderPage, setOrderPage] = useState(0);
  const [orderTotalPages, setOrderTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, restRes, ordersRes] = await Promise.all([
        api.get('/api/owner/dashboard/stats'),
        api.get('/api/owner/restaurants?page=0&size=20'),
        api.get('/api/owner/orders?page=0&size=10'),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (restRes.data.success) setRestaurants(restRes.data.data.content);
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.data.content);
        setOrderTotalPages(ordersRes.data.data.totalPages);
      }
    } finally { setLoading(false); }
  };

  const loadMenuItems = async (restaurantId) => {
    const res = await api.get(`/api/menu/restaurant/${restaurantId}`);
    if (res.data.success) setMenuItems(res.data.data);
  };

  const saveRestaurant = async (e) => {
    e.preventDefault();
    try {
      if (editingRest) {
        await api.put(`/api/owner/restaurants/${editingRest.id}`, restForm);
        showToast('Restaurant updated!', 'success');
      } else {
        await api.post('/api/owner/restaurants', restForm);
        showToast('Restaurant created!', 'success');
      }
      setShowRestForm(false); setEditingRest(null);
      const res = await api.get('/api/owner/restaurants?page=0&size=20');
      if (res.data.success) setRestaurants(res.data.data.content);
    } catch (e) { showToast(e.response?.data?.message || 'Failed to save restaurant', 'error'); }
  };

  const deleteRestaurant = async (id) => {
    if (!window.confirm('Delete this restaurant?')) return;
    try {
      await api.delete(`/api/owner/restaurants/${id}`);
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
      showToast('Restaurant deleted', 'success');
    } catch (e) { showToast('Failed to delete', 'error'); }
  };

  const saveMenuItem = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/api/owner/menu-items/${editingItem.id}`, { ...menuForm, price: Number(menuForm.price) });
        showToast('Item updated!', 'success');
      } else {
        await api.post(`/api/owner/restaurants/${selectedRestaurant.id}/menu`, { ...menuForm, price: Number(menuForm.price) });
        showToast('Item added!', 'success');
      }
      setShowMenuForm(false); setEditingItem(null);
      await loadMenuItems(selectedRestaurant.id);
    } catch (e) { showToast(e.response?.data?.message || 'Failed to save item', 'error'); }
  };

  const deleteMenuItem = async (itemId) => {
    try {
      await api.delete(`/api/owner/menu-items/${itemId}`);
      setMenuItems((prev) => prev.filter((i) => i.id !== itemId));
      showToast('Item deleted', 'info');
    } catch (e) { showToast('Failed to delete', 'error'); }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/api/owner/orders/${orderId}/status?status=${status}`);
      showToast('Order status updated!', 'success');
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    } catch (e) { showToast('Failed to update status', 'error'); }
  };

  const TABS = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'restaurants', label: '🏪 Restaurants' },
    { id: 'menu', label: '🍽️ Menu' },
    { id: 'orders', label: '📦 Orders' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-softGray">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 w-full flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-darkCharcoal">Restaurant Owner Dashboard</h1>
          <span className="text-sm font-medium text-mutedGray">Welcome, {user?.fullName}</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-zomato-500 text-white shadow-sm' : 'bg-white border border-borderGray text-mutedGray hover:bg-softGray'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Restaurants', value: stats?.totalRestaurants || 0, icon: '🏪', color: 'from-blue-500 to-cyan-500' },
                { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦', color: 'from-purple-500 to-violet-500' },
                { label: 'Active Orders', value: stats?.activeOrders || 0, icon: '⚡', color: 'from-orange-500 to-yellow-500' },
                { label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: 'from-green-500 to-emerald-500' },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-2xl p-5 bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                  <p className="text-2xl mb-1">{stat.icon}</p>
                  <p className="text-2xl font-extrabold">{stat.value}</p>
                  <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-darkCharcoal">My Restaurants</h2>
              <button onClick={() => { setShowRestForm(true); setEditingRest(null); setRestForm({ name: '', description: '', cuisineType: '', address: '', city: '', deliveryTime: 30, minimumOrder: 200, openingTime: '10:00 AM', closingTime: '11:00 PM', image: '', coverImage: '' }); }} className="flex items-center gap-1.5 rounded-xl bg-zomato-500 px-4 py-2 text-sm font-semibold text-white hover:bg-zomato-600">
                <Plus className="h-4 w-4" /> Add Restaurant
              </button>
            </div>

            {showRestForm && (
              <div className="mb-5 bg-white rounded-2xl border border-borderGray p-5 shadow-card animate-fade-in">
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold text-darkCharcoal">{editingRest ? 'Edit Restaurant' : 'New Restaurant'}</h3>
                  <button onClick={() => setShowRestForm(false)}><X className="h-5 w-5 text-mutedGray" /></button>
                </div>
                <form onSubmit={saveRestaurant} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[['name', 'Restaurant Name', 'text'], ['cuisineType', 'Cuisine Types (comma separated)', 'text'], ['address', 'Full Address', 'text'], ['city', 'City', 'text'], ['deliveryTime', 'Delivery Time (mins)', 'number'], ['minimumOrder', 'Min Order (₹)', 'number'], ['openingTime', 'Opening Time', 'text'], ['closingTime', 'Closing Time', 'text'], ['image', 'Image URL', 'text'], ['coverImage', 'Cover Image URL', 'text']].map(([field, label, type]) => (
                    <div key={field}>
                      <label className="text-xs font-medium text-mutedGray block mb-1">{label}</label>
                      <input
                        type={type}
                        required={['name', 'cuisineType', 'address', 'city'].includes(field)}
                        value={restForm[field]}
                        onChange={(e) => setRestForm({ ...restForm, [field]: e.target.value })}
                        className="w-full rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none focus:border-zomato-400"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-mutedGray block mb-1">Description</label>
                    <textarea value={restForm.description} onChange={(e) => setRestForm({ ...restForm, description: e.target.value })} rows={2} className="w-full rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none focus:border-zomato-400 resize-none" />
                  </div>
                  <div className="sm:col-span-2 flex gap-2">
                    <button type="submit" className="rounded-xl bg-zomato-500 px-5 py-2 font-semibold text-white text-sm hover:bg-zomato-600">{editingRest ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => setShowRestForm(false)} className="rounded-xl border border-borderGray px-5 py-2 text-sm font-medium text-mutedGray hover:bg-softGray">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {restaurants.map((rest) => (
                <div key={rest.id} className="bg-white rounded-2xl border border-borderGray shadow-card overflow-hidden">
                  <img src={rest.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'} alt={rest.name} className="h-36 w-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'; }} />
                  <div className="p-4">
                    <h3 className="font-bold text-darkCharcoal">{rest.name}</h3>
                    <p className="text-xs text-mutedGray mt-0.5">{rest.cuisineType}</p>
                    <p className="text-xs text-mutedGray mt-0.5">{rest.city} · {rest.deliveryTime} mins</p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => { setEditingRest(rest); setRestForm({ ...rest }); setShowRestForm(true); }} className="flex-1 rounded-lg border border-borderGray py-1.5 text-xs font-medium text-darkCharcoal flex items-center justify-center gap-1 hover:bg-softGray">
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button onClick={() => deleteRestaurant(rest.id)} className="rounded-lg border border-red-200 py-1.5 px-3 text-xs font-medium text-red-500 hover:bg-red-50 flex items-center gap-1">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
              <select
                value={selectedRestaurant?.id || ''}
                onChange={(e) => {
                  const rest = restaurants.find((r) => r.id === Number(e.target.value));
                  setSelectedRestaurant(rest || null);
                  if (rest) loadMenuItems(rest.id);
                }}
                className="rounded-xl border border-borderGray px-3 py-2 text-sm bg-white outline-none"
              >
                <option value="">Select a restaurant</option>
                {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              {selectedRestaurant && (
                <button onClick={() => { setShowMenuForm(true); setEditingItem(null); setMenuForm({ name: '', description: '', price: '', category: 'Main Course', veg: true, available: true, image: '' }); }} className="flex items-center gap-1.5 rounded-xl bg-zomato-500 px-4 py-2 text-sm font-semibold text-white hover:bg-zomato-600">
                  <Plus className="h-4 w-4" /> Add Item
                </button>
              )}
            </div>

            {showMenuForm && selectedRestaurant && (
              <div className="mb-5 bg-white rounded-2xl border border-borderGray p-5 shadow-card animate-fade-in">
                <div className="flex justify-between mb-3">
                  <h3 className="font-bold text-darkCharcoal">{editingItem ? 'Edit Item' : 'New Menu Item'}</h3>
                  <button onClick={() => setShowMenuForm(false)}><X className="h-5 w-5 text-mutedGray" /></button>
                </div>
                <form onSubmit={saveMenuItem} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-mutedGray block mb-1">Item Name</label>
                    <input required value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} className="w-full rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-mutedGray block mb-1">Price (₹)</label>
                    <input required type="number" min="1" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} className="w-full rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-mutedGray block mb-1">Category</label>
                    <select value={menuForm.category} onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })} className="w-full rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none bg-white">
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-mutedGray block mb-1">Image URL</label>
                    <input value={menuForm.image} onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })} className="w-full rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none" placeholder="https://..." />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={menuForm.veg} onChange={(e) => setMenuForm({ ...menuForm, veg: e.target.checked })} className="accent-green-500" /> Veg
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={menuForm.available} onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })} className="accent-zomato-500" /> Available
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-mutedGray block mb-1">Description</label>
                    <textarea value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} rows={2} className="w-full rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none resize-none" />
                  </div>
                  <div className="sm:col-span-2 flex gap-2">
                    <button type="submit" className="rounded-xl bg-zomato-500 px-5 py-2 font-semibold text-white text-sm">{editingItem ? 'Update' : 'Add Item'}</button>
                    <button type="button" onClick={() => setShowMenuForm(false)} className="rounded-xl border border-borderGray px-5 py-2 text-sm font-medium text-mutedGray">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {!selectedRestaurant ? (
              <div className="text-center py-12 text-mutedGray">
                <p className="text-3xl mb-2">👆</p>
                <p className="font-medium">Select a restaurant to manage its menu</p>
              </div>
            ) : (
              <div className="space-y-2">
                {menuItems.length === 0 ? (
                  <div className="text-center py-10 text-mutedGray"><p>No menu items yet.</p></div>
                ) : (
                  menuItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl border border-borderGray p-3 shadow-card">
                      <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80'} alt={item.name} className="h-14 w-14 rounded-lg object-cover flex-shrink-0" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-darkCharcoal text-sm truncate">{item.name}</p>
                        <p className="text-xs text-mutedGray">{item.category} · {item.veg ? '🟢 Veg' : '🔴 Non-Veg'} · {item.available ? 'Available' : '⚠️ Unavailable'}</p>
                        <p className="text-sm font-bold text-zomato-600 mt-0.5">₹{item.price}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => { setEditingItem(item); setMenuForm({ ...item, price: item.price.toString() }); setShowMenuForm(true); }} className="p-1.5 text-mutedGray hover:text-darkCharcoal transition-colors"><Edit3 className="h-4 w-4" /></button>
                        <button onClick={() => deleteMenuItem(item.id)} className="p-1.5 text-mutedGray hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="font-bold text-darkCharcoal mb-4">Incoming Orders</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-borderGray shadow-card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-darkCharcoal">Order #{order.id}</p>
                      <p className="text-sm text-mutedGray">{order.userName || order.buyerName}</p>
                      <p className="text-xs text-mutedGray mt-0.5">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-mutedGray mb-3">
                    {order.orderItems.map((i) => `${i.menuItemName} × ${i.quantity}`).join(', ')}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-darkCharcoal">₹{order.totalAmount}</p>
                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="rounded-lg border border-borderGray px-3 py-1.5 text-xs font-medium bg-white outline-none cursor-pointer"
                      >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                      </select>
                    )}
                  </div>
                </div>
              ))}
              {orders.length === 0 && <div className="text-center py-12 text-mutedGray"><p className="text-3xl mb-2">📭</p><p>No orders yet</p></div>}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;
