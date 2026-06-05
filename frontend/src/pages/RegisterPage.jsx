import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const ROLES = [
  { value: 'CUSTOMER', label: '🛒 Customer', desc: 'Order food from restaurants' },
  { value: 'RESTAURANT_OWNER', label: '🏪 Restaurant Owner', desc: 'List and manage your restaurant' },
];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', role: 'CUSTOMER' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.fullName || form.fullName.length < 2) errs.fullName = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.phone || form.phone.length < 10) errs.phone = 'Enter a valid phone number';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.phone, form.password, form.role);
      showToast('Account created successfully! Please log in.', 'success');
      navigate('/login');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const setField = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Decorative left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative bg-gradient-to-br from-orange-500 to-zomato-600 overflow-hidden p-12">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 text-white text-center">
          <h1 className="font-black italic text-5xl mb-4 tracking-tight">zomato</h1>
          <p className="text-white/80 text-lg font-medium">Join 15 million food lovers today</p>
          <div className="mt-12 space-y-4 text-left">
            {['🚀 Order from 15,000+ restaurants', '❤️ Save your favourites', '🎁 Exclusive member offers', '📦 Track orders live'].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl p-3 text-sm font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-12 xl:px-20 overflow-y-auto">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <span className="font-black italic text-4xl text-zomato-500">zomato</span>
          </div>

          <h2 className="text-2xl font-extrabold text-darkCharcoal">Create your account</h2>
          <p className="mt-1 text-sm text-mutedGray">Start ordering your favourite food today</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-darkCharcoal mb-2">I want to join as</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setField('role', role.value)}
                    className={`rounded-xl border-2 p-3 text-left transition-colors ${
                      form.role === role.value
                        ? 'border-zomato-500 bg-zomato-50'
                        : 'border-borderGray hover:border-zomato-200'
                    }`}
                  >
                    <p className="text-sm font-semibold text-darkCharcoal">{role.label}</p>
                    <p className="text-[11px] text-mutedGray mt-0.5">{role.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-darkCharcoal mb-1.5">Full Name</label>
              <input
                value={form.fullName}
                onChange={(e) => setField('fullName', e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-borderGray focus:border-zomato-400 bg-softGray focus:bg-white'}`}
                placeholder="John Doe"
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-darkCharcoal mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.email ? 'border-red-400 bg-red-50' : 'border-borderGray focus:border-zomato-400 bg-softGray focus:bg-white'}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-darkCharcoal mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.phone ? 'border-red-400 bg-red-50' : 'border-borderGray focus:border-zomato-400 bg-softGray focus:bg-white'}`}
                placeholder="9876543210"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-darkCharcoal mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition-colors ${errors.password ? 'border-red-400 bg-red-50' : 'border-borderGray focus:border-zomato-400 bg-softGray focus:bg-white'}`}
                  placeholder="Min. 6 characters"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mutedGray">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-zomato-500 py-3 font-bold text-white shadow-md hover:bg-zomato-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <><UserPlus className="h-4 w-4" /> Create Account</>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-mutedGray">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-zomato-500 hover:text-zomato-600 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
