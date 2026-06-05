import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { showToast } from './Toast';
import StarRating from './StarRating';
import { Clock, Bike, Heart, Plus, Leaf, Drumstick } from 'lucide-react';

const RestaurantCard = ({ restaurant, isFavorited = false, onToggleFavorite }) => {
  const { isAuthenticated } = useAuth();
  const [favorited, setFavorited] = useState(isFavorited);
  const navigate = useNavigate();

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please login to add favorites', 'info');
      navigate('/login');
      return;
    }
    setFavorited(!favorited);
    if (onToggleFavorite) onToggleFavorite(restaurant.id);
  };

  const cuisines = restaurant.cuisineType?.split(',').slice(0, 3).map((c) => c.trim()) || [];

  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group block rounded-2xl bg-white border border-borderGray shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-softGray">
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'; }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zomato-100 to-zomato-200 flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <StarRating rating={restaurant.rating} showCount={true} count={restaurant.numRatings} />
        </div>
        {/* Fav Button */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm p-1.5 shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${favorited ? 'fill-zomato-500 text-zomato-500' : 'text-mutedGray'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-darkCharcoal text-base leading-snug truncate group-hover:text-zomato-500 transition-colors">
          {restaurant.name}
        </h3>
        <p className="text-xs text-mutedGray mt-0.5 truncate">
          {cuisines.join(' • ')}
        </p>

        {/* Divider */}
        <div className="my-3 border-t border-dashed border-borderGray" />

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-mutedGray">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{restaurant.deliveryTime} mins</span>
          </div>
          <div className="h-3.5 w-px bg-borderGray" />
          <div className="flex items-center gap-1">
            <Bike className="h-3.5 w-3.5" />
            <span>₹{restaurant.minimumOrder} min</span>
          </div>
          <div className="h-3.5 w-px bg-borderGray" />
          <div className="flex items-center gap-1">
            <span className="text-mutedGray">{restaurant.city}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const SkeletonCard = () => (
  <div className="rounded-2xl bg-white border border-borderGray overflow-hidden">
    <div className="h-48 shimmer" />
    <div className="p-4 space-y-2">
      <div className="h-4 w-3/4 shimmer rounded" />
      <div className="h-3 w-1/2 shimmer rounded" />
      <div className="my-3 border-t border-dashed border-borderGray" />
      <div className="h-3 w-full shimmer rounded" />
    </div>
  </div>
);

export default RestaurantCard;
