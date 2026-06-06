import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.fullName}! 🎉`, 'success');
      // Redirect based on role
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'RESTAURANT_OWNER') navigate('/owner');
      else navigate(from, { replace: true });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Login failed';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel (decorative) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative bg-gradient-to-br from-zomato-500 to-orange-500 overflow-hidden p-12">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 text-white text-center">
          <h1 className="font-black italic text-5xl mb-4 tracking-tight">zomato</h1>
          <p className="text-white/80 text-lg">Delivering happiness to your door</p>
          <div className="mt-16 grid grid-cols-2 gap-4 text-left">
            {['🍕 15,000+ restaurants', '⚡ Fast delivery', '💯 Quality guaranteed', '❤️ Your favorites saved'].map((item) => (
              <div key={item} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-sm font-medium">{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <span className="font-black italic text-4xl text-zomato-500">zomato</span>
          </div>

          <h2 className="text-2xl font-extrabold text-darkCharcoal">Welcome back</h2>
          <p className="mt-1 text-sm text-mutedGray">Sign in to your account to continue</p>



          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-darkCharcoal mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
                  errors.email ? 'border-red-400 bg-red-50' : 'border-borderGray focus:border-zomato-400 bg-softGray focus:bg-white'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-darkCharcoal mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition-colors ${
                    errors.password ? 'border-red-400 bg-red-50' : 'border-borderGray focus:border-zomato-400 bg-softGray focus:bg-white'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mutedGray hover:text-darkCharcoal"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-zomato-500 py-3 font-bold text-white shadow-md hover:bg-zomato-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Sign In
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-mutedGray">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-zomato-500 hover:text-zomato-600 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
