import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RestaurantCard, { SkeletonCard } from '../components/RestaurantCard';
import Pagination from '../components/Pagination';
import { Search, MapPin, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

const CUISINES = [
  { name: 'North Indian', emoji: '🍛', color: 'from-orange-400 to-red-400' },
  { name: 'Pizza', emoji: '🍕', color: 'from-yellow-400 to-orange-400' },
  { name: 'Chinese', emoji: '🥡', color: 'from-red-400 to-pink-400' },
  { name: 'Biryani', emoji: '🍚', color: 'from-amber-400 to-yellow-400' },
  { name: 'Desserts', emoji: '🍰', color: 'from-pink-400 to-rose-400' },
  { name: 'Beverages', emoji: '🥤', color: 'from-blue-400 to-cyan-400' },
  { name: 'Street Food', emoji: '🌮', color: 'from-green-400 to-teal-400' },
  { name: 'Healthy Food', emoji: '🥗', color: 'from-emerald-400 to-green-400' },
];

const SORT_OPTIONS = [
  { value: 'rating,desc', label: 'Rating: High to Low' },
  { value: 'deliveryTime,asc', label: 'Delivery Time' },
  { value: 'minimumOrder,asc', label: 'Cost: Low to High' },
  { value: 'minimumOrder,desc', label: 'Cost: High to Low' },
  { value: 'id,desc', label: 'Newest First' },
];

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Filters
  const [city, setCity] = useState(searchParams.get('city') || 'Mumbai');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxDelivery, setMaxDelivery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortValue, setSortValue] = useState('rating,desc');
  const [showFilters, setShowFilters] = useState(false);

  const [favorites, setFavorites] = useState({});

  const [sortBy, sortDir] = sortValue.split(',');

  const fetchRestaurants = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (search) params.append('search', search);
      if (selectedCuisine) params.append('cuisine', selectedCuisine);
      if (minRating) params.append('minRating', minRating);
      if (maxDelivery) params.append('maxDeliveryTime', maxDelivery);
      if (vegOnly) params.append('vegOnly', 'true');
      params.append('page', page);
      params.append('size', 9);
      params.append('sortBy', sortBy);
      params.append('sortDir', sortDir);

      const response = await api.get(`/api/restaurants?${params.toString()}`);
      if (response.data.success) {
        const pageData = response.data.data;
        setRestaurants(pageData.content);
        setTotalPages(pageData.totalPages);
        setCurrentPage(pageData.number);
      }
    } catch (error) {
      console.error('Failed to fetch restaurants', error);
    } finally {
      setLoading(false);
    }
  }, [city, search, selectedCuisine, minRating, maxDelivery, vegOnly, sortBy, sortDir]);

  useEffect(() => {
    fetchRestaurants(0);
  }, [fetchRestaurants]);

  // Load favorites for logged-in user
  useEffect(() => {
    if (!isAuthenticated) return;
    api.get('/api/favorites').then((res) => {
      if (res.data.success) {
        const favMap = {};
        res.data.data.forEach((r) => { favMap[r.id] = true; });
        setFavorites(favMap);
      }
    }).catch(() => {});
  }, [isAuthenticated]);

  const handleToggleFavorite = async (restaurantId) => {
    if (!isAuthenticated) { showToast('Please login to add favorites', 'info'); return; }
    try {
      const res = await api.post(`/api/favorites/toggle/${restaurantId}`);
      if (res.data.success) {
        const isFav = res.data.data;
        setFavorites((prev) => ({ ...prev, [restaurantId]: isFav }));
        showToast(isFav ? 'Added to wishlist!' : 'Removed from wishlist', isFav ? 'success' : 'info');
      }
    } catch (e) {
      showToast('Failed to update favorites', 'error');
    }
  };

  const handleSearchSubmit = (searchVal, cityVal) => {
    setSearch(searchVal);
    setCity(cityVal);
  };

  const clearFilters = () => {
    setSelectedCuisine('');
    setMinRating('');
    setMaxDelivery('');
    setVegOnly(false);
    setSortValue('rating,desc');
  };

  const hasFilters = selectedCuisine || minRating || maxDelivery || vegOnly;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        currentCity={city}
        setCurrentCity={setCity}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-zomato-50 via-white to-orange-50 py-14 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-zomato-100/40 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-orange-100/50 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-darkCharcoal leading-tight">
            Order food & groceries. <br />
            <span className="bg-gradient-to-r from-zomato-500 to-orange-500 bg-clip-text text-transparent">
              Discover best restaurants.
            </span>
          </h1>
          <p className="mt-4 text-lg text-mutedGray">
            Delivering to your doorstep in {city || 'your city'}
          </p>

          {/* Hero Search */}
          <form
            onSubmit={(e) => { e.preventDefault(); fetchRestaurants(0); }}
            className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center"
          >
            <div className="flex items-center gap-2 rounded-xl border-2 border-borderGray bg-white px-4 py-3 shadow-premium w-full sm:w-56">
              <MapPin className="h-5 w-5 text-zomato-500 flex-shrink-0" />
              <input
                className="w-full text-sm outline-none font-medium placeholder-mutedGray"
                placeholder="Your location"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-xl border-2 border-borderGray bg-white px-4 py-3 shadow-premium w-full">
              <Search className="h-5 w-5 text-mutedGray flex-shrink-0" />
              <input
                className="w-full text-sm outline-none placeholder-mutedGray"
                placeholder="Search for restaurant, cuisine or a dish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-zomato-500 px-8 py-3 font-bold text-white shadow-md hover:bg-zomato-600 transition-colors flex-shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Cuisine Tiles */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-bold text-darkCharcoal mb-6">What's on your mind?</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {CUISINES.map((cuisine) => (
              <button
                key={cuisine.name}
                onClick={() => setSelectedCuisine(selectedCuisine === cuisine.name ? '' : cuisine.name)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                  selectedCuisine === cuisine.name
                    ? 'ring-2 ring-zomato-500 shadow-md scale-105'
                    : 'hover:scale-105'
                }`}
              >
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${cuisine.color} flex items-center justify-center text-2xl shadow-sm`}>
                  {cuisine.emoji}
                </div>
                <span className="text-xs font-medium text-darkCharcoal text-center leading-tight">{cuisine.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant Listing Section */}
      <section className="pb-14 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-darkCharcoal">
                Restaurants in {city || 'your city'}
              </h2>
              {search && (
                <p className="text-sm text-mutedGray mt-0.5">Results for "{search}"</p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Veg Toggle */}
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  vegOnly ? 'border-green-500 bg-green-50 text-green-700' : 'border-borderGray text-mutedGray hover:bg-softGray'
                }`}
              >
                <span className={`h-3 w-3 rounded-sm border-2 ${vegOnly ? 'border-green-600 bg-green-600' : 'border-gray-400'}`} />
                Pure Veg
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortValue}
                  onChange={(e) => setSortValue(e.target.value)}
                  className="appearance-none rounded-lg border border-borderGray bg-white px-3 py-1.5 pr-8 text-sm font-medium text-darkCharcoal focus:outline-none hover:bg-softGray cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-mutedGray pointer-events-none" />
              </div>

              {/* More Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  hasFilters ? 'border-zomato-400 bg-zomato-50 text-zomato-600' : 'border-borderGray text-mutedGray hover:bg-softGray'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters {hasFilters && '•'}
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mb-6 p-4 rounded-xl bg-softGray border border-borderGray animate-fade-in">
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="text-xs font-semibold text-mutedGray uppercase tracking-wider block mb-1">Min Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="border border-borderGray rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none"
                  >
                    <option value="">Any</option>
                    <option value="4.5">4.5+</option>
                    <option value="4.0">4.0+</option>
                    <option value="3.5">3.5+</option>
                    <option value="3.0">3.0+</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-mutedGray uppercase tracking-wider block mb-1">Max Delivery Time</label>
                  <select
                    value={maxDelivery}
                    onChange={(e) => setMaxDelivery(e.target.value)}
                    className="border border-borderGray rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none"
                  >
                    <option value="">Any</option>
                    <option value="20">Under 20 mins</option>
                    <option value="30">Under 30 mins</option>
                    <option value="45">Under 45 mins</option>
                    <option value="60">Under 60 mins</option>
                  </select>
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm font-medium text-zomato-500 hover:text-zomato-600 transition-colors">
                    <X className="h-4 w-4" /> Clear All
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Restaurant Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-6xl mb-4">🍽️</span>
              <h3 className="text-xl font-bold text-darkCharcoal">No restaurants found</h3>
              <p className="text-mutedGray mt-2">Try adjusting your search or filters</p>
              <button onClick={clearFilters} className="mt-4 text-sm font-medium text-zomato-500 hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  isFavorited={!!favorites[restaurant.id]}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => fetchRestaurants(p)}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
