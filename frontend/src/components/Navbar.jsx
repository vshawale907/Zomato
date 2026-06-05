import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartSidebar from './CartSidebar';
import { MapPin, Search, ChevronDown, ShoppingBag, User, LogOut, Heart, ClipboardList, Settings, Menu } from 'lucide-react';

const Navbar = ({ currentCity, setCurrentCity, onSearchSubmit }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [cityVal, setCityVal] = useState(currentCity || 'Mumbai');

  const totalCartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchVal, cityVal);
    } else {
      navigate(`/?search=${searchVal}&city=${cityVal}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-borderGray shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="font-extrabold italic text-3xl tracking-tight text-zomato-500 font-sans">
              zomato
            </span>
          </Link>

          {/* Search Bar Wrapper */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl items-center border border-borderGray rounded-lg shadow-premium h-12 overflow-hidden bg-white"
          >
            {/* Location Selector */}
            <div className="flex items-center px-3 gap-2 w-1/3 min-w-[140px] border-r border-borderGray">
              <MapPin className="h-5 w-5 text-zomato-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="City"
                value={cityVal}
                onChange={(e) => setCityVal(e.target.value)}
                className="w-full text-sm outline-none text-darkCharcoal placeholder-mutedGray font-medium bg-transparent"
              />
              <ChevronDown className="h-4 w-4 text-mutedGray flex-shrink-0" />
            </div>

            {/* Search Input */}
            <div className="flex items-center px-3 gap-2 flex-1">
              <Search className="h-5 w-5 text-mutedGray flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for restaurant, cuisine or a dish"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full text-sm outline-none text-darkCharcoal placeholder-mutedGray bg-transparent"
              />
            </div>
            <button type="submit" className="hidden">Search</button>
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            
            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-softGray text-darkCharcoal transition-colors flex items-center justify-center"
            >
              <ShoppingBag className="h-6 w-6" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zomato-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Controls */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-95 transition-opacity"
                >
                  <img 
                    src={user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
                    alt={user.fullName} 
                    className="h-9 w-9 rounded-full object-cover border border-borderGray"
                  />
                  <span className="hidden sm:inline text-sm font-medium text-darkCharcoal max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-mutedGray" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-hover ring-1 ring-black/5 focus:outline-none divide-y divide-borderGray py-1 z-50">
                    <div className="px-4 py-2.5">
                      <p className="text-xs text-mutedGray">Logged in as</p>
                      <p className="text-sm font-semibold text-darkCharcoal truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-darkCharcoal hover:bg-softGray transition-colors"
                      >
                        <User className="h-4 w-4 text-mutedGray" /> Profile
                      </Link>
                      <Link 
                        to="/favorites" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-darkCharcoal hover:bg-softGray transition-colors"
                      >
                        <Heart className="h-4 w-4 text-mutedGray" /> Wishlist
                      </Link>
                      <Link 
                        to="/orders" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-darkCharcoal hover:bg-softGray transition-colors"
                      >
                        <ClipboardList className="h-4 w-4 text-mutedGray" /> Order History
                      </Link>
                    </div>

                    {/* Role-based dashboard links */}
                    {(user.role === 'RESTAURANT_OWNER' || user.role === 'ADMIN') && (
                      <div className="py-1">
                        <Link 
                          to="/owner" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-darkCharcoal hover:bg-softGray transition-colors"
                        >
                          <Settings className="h-4 w-4 text-mutedGray" /> Owner Panel
                        </Link>
                      </div>
                    )}
                    {user.role === 'ADMIN' && (
                      <div className="py-1">
                        <Link 
                          to="/admin" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-darkCharcoal hover:bg-softGray transition-colors"
                        >
                          <Settings className="h-4 w-4 text-mutedGray" /> Admin Dashboard
                        </Link>
                      </div>
                    )}

                    <div className="py-1">
                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-mutedGray hover:text-darkCharcoal transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="rounded-lg bg-zomato-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zomato-600 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer Overlay */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
