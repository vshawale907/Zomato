import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import api from '../services/api';
import { User, MapPin, Lock, Plus, Trash2, Edit3, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile
  const [profile, setProfile] = useState({ fullName: '', phone: '', profileImage: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ street: '', city: '', state: '', zipCode: '', isDefault: false });
  const [addingAddr, setAddingAddr] = useState(false);

  useEffect(() => {
    if (user) setProfile({ fullName: user.fullName, phone: user.phone, profileImage: user.profileImage || '' });
  }, [user]);

  useEffect(() => {
    api.get('/api/users/addresses').then((res) => {
      if (res.data.success) setAddresses(res.data.data);
    }).finally(() => setAddrLoading(false));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile(profile);
      showToast('Profile updated!', 'success');
    } catch (e) {
      showToast('Failed to update profile', 'error');
    } finally { setProfileLoading(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) { showToast('Password must be at least 6 characters', 'warning'); return; }
    setPwLoading(true);
    try {
      await api.put('/api/users/change-password', pwForm);
      showToast('Password changed!', 'success');
      setPwForm({ oldPassword: '', newPassword: '' });
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to change password', 'error');
    } finally { setPwLoading(false); }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    setAddingAddr(true);
    try {
      const res = await api.post('/api/users/addresses', newAddr);
      if (res.data.success) {
        setAddresses((prev) => [...prev, res.data.data]);
        setShowAddForm(false);
        setNewAddr({ street: '', city: '', state: '', zipCode: '', isDefault: false });
        showToast('Address added!', 'success');
      }
    } catch (e) { showToast('Failed to add address', 'error'); }
    finally { setAddingAddr(false); }
  };

  const deleteAddress = async (id) => {
    try {
      await api.delete(`/api/users/addresses/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast('Address removed', 'info');
    } catch (e) { showToast('Failed to delete address', 'error'); }
  };

  const TABS = [
    { id: 'profile', label: 'My Profile', icon: <User className="h-4 w-4" /> },
    { id: 'addresses', label: 'Saved Addresses', icon: <MapPin className="h-4 w-4" /> },
    { id: 'password', label: 'Change Password', icon: <Lock className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-softGray">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 w-full flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-zomato-500 to-orange-500 rounded-2xl p-6 mb-6 text-white shadow-md">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-2xl font-bold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-extrabold">{user?.fullName}</h1>
              <p className="text-white/80 text-sm">{user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="md:w-48 flex-shrink-0">
            <nav className="bg-white rounded-2xl border border-borderGray shadow-card overflow-hidden">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-borderGray last:border-0 transition-colors ${
                    activeTab === tab.id ? 'bg-zomato-50 text-zomato-600 border-l-2 border-l-zomato-500' : 'text-mutedGray hover:bg-softGray'
                  }`}
                >
                  {tab.icon}{tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-borderGray shadow-card p-6">
              {activeTab === 'profile' && (
                <form onSubmit={saveProfile} className="space-y-4">
                  <h2 className="font-bold text-darkCharcoal text-lg">My Profile</h2>
                  <div>
                    <label className="block text-sm font-medium text-darkCharcoal mb-1.5">Full Name</label>
                    <input
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full rounded-xl border border-borderGray px-4 py-3 text-sm outline-none focus:border-zomato-400 bg-softGray focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkCharcoal mb-1.5">Email (read only)</label>
                    <input
                      value={user?.email || ''}
                      readOnly
                      className="w-full rounded-xl border border-borderGray px-4 py-3 text-sm bg-gray-100 text-mutedGray cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkCharcoal mb-1.5">Phone</label>
                    <input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full rounded-xl border border-borderGray px-4 py-3 text-sm outline-none focus:border-zomato-400 bg-softGray focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkCharcoal mb-1.5">Profile Image URL</label>
                    <input
                      value={profile.profileImage}
                      onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
                      className="w-full rounded-xl border border-borderGray px-4 py-3 text-sm outline-none focus:border-zomato-400 bg-softGray focus:bg-white transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                  <button type="submit" disabled={profileLoading} className="rounded-xl bg-zomato-500 px-6 py-2.5 font-semibold text-white hover:bg-zomato-600 transition-colors disabled:opacity-70">
                    {profileLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-darkCharcoal text-lg">Saved Addresses</h2>
                    <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-1.5 text-sm font-medium text-zomato-500 hover:text-zomato-600">
                      <Plus className="h-4 w-4" /> Add new
                    </button>
                  </div>

                  {showAddForm && (
                    <form onSubmit={addAddress} className="mb-5 p-4 rounded-xl bg-softGray border border-borderGray space-y-3">
                      <h3 className="text-sm font-semibold text-darkCharcoal">New Address</h3>
                      <input required placeholder="Street address" value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} className="w-full rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none" />
                      <div className="grid grid-cols-2 gap-3">
                        <input required placeholder="City" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} className="rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none" />
                        <input required placeholder="State" value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} className="rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none" />
                      </div>
                      <input required placeholder="Zip Code" value={newAddr.zipCode} onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })} className="w-full rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none" />
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={newAddr.isDefault} onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })} className="accent-zomato-500" />
                        Set as default
                      </label>
                      <div className="flex gap-2">
                        <button type="submit" disabled={addingAddr} className="rounded-xl bg-zomato-500 px-4 py-2 text-sm font-semibold text-white">{addingAddr ? 'Saving...' : 'Save'}</button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="rounded-xl border border-borderGray px-4 py-2 text-sm font-medium text-mutedGray">Cancel</button>
                      </div>
                    </form>
                  )}

                  {addrLoading ? (
                    <div className="space-y-2">{[1, 2].map((i) => <div key={i} className="h-16 shimmer rounded-xl" />)}</div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8 text-mutedGray">
                      <MapPin className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No saved addresses yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="flex items-start justify-between rounded-xl border border-borderGray p-4">
                          <div>
                            <p className="text-sm font-medium text-darkCharcoal">{addr.street}</p>
                            <p className="text-xs text-mutedGray mt-0.5">{addr.city}, {addr.state} – {addr.zipCode}</p>
                            {addr.isDefault && <span className="text-[10px] font-bold uppercase text-green-600">Default</span>}
                          </div>
                          <button onClick={() => deleteAddress(addr.id)} className="p-1.5 text-mutedGray hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'password' && (
                <form onSubmit={changePassword} className="space-y-4">
                  <h2 className="font-bold text-darkCharcoal text-lg">Change Password</h2>
                  <div>
                    <label className="block text-sm font-medium text-darkCharcoal mb-1.5">Current Password</label>
                    <input type="password" value={pwForm.oldPassword} onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })} className="w-full rounded-xl border border-borderGray px-4 py-3 text-sm outline-none focus:border-zomato-400 bg-softGray focus:bg-white transition-colors" placeholder="Enter current password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkCharcoal mb-1.5">New Password</label>
                    <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="w-full rounded-xl border border-borderGray px-4 py-3 text-sm outline-none focus:border-zomato-400 bg-softGray focus:bg-white transition-colors" placeholder="Min. 6 characters" />
                  </div>
                  <button type="submit" disabled={pwLoading} className="rounded-xl bg-zomato-500 px-6 py-2.5 font-semibold text-white hover:bg-zomato-600 transition-colors disabled:opacity-70">
                    {pwLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
