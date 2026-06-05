import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RestaurantCard from '../components/RestaurantCard';
import api from '../services/api';
import { showToast } from '../components/Toast';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/favorites');
      if (res.data.success) setFavorites(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadFavorites(); }, []);

  const handleToggle = async (restaurantId) => {
    try {
      const res = await api.post(`/api/favorites/toggle/${restaurantId}`);
      if (res.data.success && !res.data.data) {
        setFavorites((prev) => prev.filter((r) => r.id !== restaurantId));
        showToast('Removed from wishlist', 'info');
      }
    } catch (e) { showToast('Failed to update favorites', 'error'); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-softGray">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <h1 className="text-2xl font-extrabold text-darkCharcoal mb-6 flex items-center gap-2">
          <Heart className="h-6 w-6 fill-zomato-500 text-zomato-500" /> My Favourites
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 shimmer rounded-2xl" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-mutedGray mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-bold text-darkCharcoal">No favourites yet</h3>
            <p className="text-mutedGray mt-2">Heart a restaurant to save it here</p>
            <Link to="/" className="mt-6 inline-block rounded-xl bg-zomato-500 px-6 py-3 font-bold text-white hover:bg-zomato-600 transition-colors">
              Explore Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isFavorited={true}
                onToggleFavorite={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
