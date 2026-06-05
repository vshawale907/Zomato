import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
import StarRating, { StarInput } from '../components/StarRating';
import { showToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { MapPin, Clock, Bike, Heart, Search, Star, ChevronDown, X, CheckCircle } from 'lucide-react';

const CATEGORIES = ['Starters', 'Main Course', 'Desserts', 'Beverages'];

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  const [activeCategory, setActiveCategory] = useState('');
  const [vegFilter, setVegFilter] = useState(null);
  const [menuSearch, setMenuSearch] = useState('');

  // Cart conflict dialog
  const [cartConflict, setCartConflict] = useState(null);

  // Review form
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Active section
  const [activeTab, setActiveTab] = useState('menu');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [restRes, menuRes, reviewRes] = await Promise.all([
        api.get(`/api/restaurants/${id}`),
        api.get(`/api/menu/restaurant/${id}`),
        api.get(`/api/reviews/restaurant/${id}`),
      ]);
      if (restRes.data.success) setRestaurant(restRes.data.data);
      if (menuRes.data.success) setMenuItems(menuRes.data.data);
      if (reviewRes.data.success) setReviews(reviewRes.data.data);

      // Check favourite status
      if (isAuthenticated) {
        const favRes = await api.get(`/api/favorites/check/${id}`);
        if (favRes.data.success) setIsFav(favRes.data.data);
      }
    } catch (e) {
      showToast('Failed to load restaurant details', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleFav = async () => {
    if (!isAuthenticated) { showToast('Please login', 'info'); navigate('/login'); return; }
    const res = await api.post(`/api/favorites/toggle/${id}`);
    if (res.data.success) {
      setIsFav(res.data.data);
      showToast(res.data.data ? 'Added to wishlist! ❤️' : 'Removed from wishlist', res.data.data ? 'success' : 'info');
    }
  };

  const filteredMenu = menuItems.filter((item) => {
    if (activeCategory && item.category !== activeCategory) return false;
    if (vegFilter !== null && item.veg !== vegFilter) return false;
    if (menuSearch && !item.name.toLowerCase().includes(menuSearch.toLowerCase())) return false;
    return true;
  });

  const groupedMenu = CATEGORIES.reduce((acc, cat) => {
    const items = filteredMenu.filter((i) => i.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const handleCartConflict = (item) => {
    setCartConflict(item);
  };

  const handleClearAndAdd = async () => {
    await clearCart();
    setCartConflict(null);
    showToast('Cart cleared! Please add the item again.', 'info');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { showToast('Please login to review', 'info'); navigate('/login'); return; }
    if (reviewRating === 0) { showToast('Please select a rating', 'warning'); return; }
    if (!reviewComment.trim()) { showToast('Please write a comment', 'warning'); return; }
    setReviewLoading(true);
    try {
      if (editingReview) {
        await api.put(`/api/reviews/${editingReview.id}`, { rating: reviewRating, comment: reviewComment });
        showToast('Review updated!', 'success');
      } else {
        await api.post(`/api/reviews/restaurant/${id}`, { rating: reviewRating, comment: reviewComment });
        showToast('Review submitted!', 'success');
      }
      setReviewRating(0); setReviewComment(''); setEditingReview(null);
      const reviewRes = await api.get(`/api/reviews/restaurant/${id}`);
      if (reviewRes.data.success) setReviews(reviewRes.data.data);
      const restRes = await api.get(`/api/restaurants/${id}`);
      if (restRes.data.success) setRestaurant(restRes.data.data);
    } catch (e) {
      showToast('Failed to submit review', 'error');
    } finally { setReviewLoading(false); }
  };

  const deleteReview = async (reviewId) => {
    try {
      await api.delete(`/api/reviews/${reviewId}`);
      showToast('Review deleted', 'info');
      const reviewRes = await api.get(`/api/reviews/restaurant/${id}`);
      if (reviewRes.data.success) setReviews(reviewRes.data.data);
    } catch (e) { showToast('Failed to delete review', 'error'); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zomato-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Cover Image */}
      <div className="relative h-56 sm:h-72 bg-gray-200 overflow-hidden">
        <img
          src={restaurant.coverImage || restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
          alt={restaurant.name}
          className="h-full w-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
      </div>

      {/* Restaurant Header */}
      <div className="bg-white border-b border-borderGray shadow-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex gap-4">
              <img
                src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150'}
                alt={restaurant.name}
                className="h-20 w-20 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150'; }}
              />
              <div>
                <h1 className="text-2xl font-extrabold text-darkCharcoal">{restaurant.name}</h1>
                <p className="text-sm text-mutedGray mt-0.5">{restaurant.cuisineType}</p>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-mutedGray">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{restaurant.address}, {restaurant.city}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <StarRating rating={restaurant.rating} showCount={true} count={restaurant.numRatings} size="md" />
              <button onClick={toggleFav} className="rounded-full border border-borderGray p-2 hover:bg-softGray transition-colors">
                <Heart className={`h-5 w-5 ${isFav ? 'fill-zomato-500 text-zomato-500' : 'text-mutedGray'}`} />
              </button>
            </div>
          </div>

          {/* Meta Chips */}
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-green-700 font-medium">
              <Clock className="h-3.5 w-3.5" /> {restaurant.deliveryTime} mins
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-blue-700 font-medium">
              <Bike className="h-3.5 w-3.5" /> Min order ₹{restaurant.minimumOrder}
            </div>
            <div className="rounded-full bg-gray-100 border border-borderGray px-3 py-1 text-mutedGray font-medium">
              {restaurant.openingTime} – {restaurant.closingTime}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[80px] z-30 bg-white border-b border-borderGray shadow-sm">
        <div className="mx-auto max-w-5xl px-4 flex gap-8">
          {['menu', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-semibold capitalize border-b-2 transition-colors ${
                activeTab === tab ? 'border-zomato-500 text-zomato-600' : 'border-transparent text-mutedGray hover:text-darkCharcoal'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${reviews.length})` : 'Menu'}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {activeTab === 'menu' && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left sidebar */}
            <div className="lg:w-52 flex-shrink-0">
              <div className="sticky top-[130px] space-y-1">
                <button
                  onClick={() => setActiveCategory('')}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors ${!activeCategory ? 'bg-zomato-50 text-zomato-600' : 'text-mutedGray hover:bg-softGray'}`}
                >
                  All Items
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
                    className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-zomato-50 text-zomato-600' : 'text-mutedGray hover:bg-softGray'}`}
                  >
                    {cat}
                    <span className="ml-1 text-xs text-mutedGray">({menuItems.filter((i) => i.category === cat).length})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Content */}
            <div className="flex-1 min-w-0">
              {/* Menu Controls */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex items-center gap-2 rounded-xl border border-borderGray bg-softGray px-3 py-2 flex-1">
                  <Search className="h-4 w-4 text-mutedGray flex-shrink-0" />
                  <input
                    className="w-full text-sm outline-none bg-transparent placeholder-mutedGray"
                    placeholder="Search for dishes..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {[{ label: 'Veg', val: true }, { label: 'Non-Veg', val: false }].map(({ label, val }) => (
                    <button
                      key={label}
                      onClick={() => setVegFilter(vegFilter === val ? null : val)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                        vegFilter === val
                          ? val ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-600'
                          : 'border-borderGray text-mutedGray hover:bg-softGray'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {Object.keys(groupedMenu).length === 0 ? (
                <div className="text-center py-12 text-mutedGray">
                  <p className="text-4xl mb-2">🍽️</p>
                  <p className="font-medium">No items found</p>
                </div>
              ) : (
                Object.entries(groupedMenu).map(([category, items]) => (
                  <div key={category} className="mb-8">
                    <h3 className="text-lg font-bold text-darkCharcoal mb-1">{category}</h3>
                    <p className="text-xs text-mutedGray mb-3">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                    <div>
                      {items.map((item) => (
                        <FoodCard key={item.id} item={item} onCartConflict={handleCartConflict} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Write Review */}
            {isAuthenticated && (
              <div className="rounded-2xl bg-white border border-borderGray shadow-card p-6">
                <h3 className="font-bold text-darkCharcoal mb-4">{editingReview ? 'Edit your review' : 'Write a Review'}</h3>
                <form onSubmit={submitReview} className="space-y-4">
                  <StarInput value={reviewRating} onChange={setReviewRating} />
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-borderGray p-3 text-sm outline-none focus:border-zomato-400 resize-none bg-softGray focus:bg-white transition-colors"
                    placeholder="Share your experience..."
                  />
                  <div className="flex gap-2">
                    <button type="submit" disabled={reviewLoading} className="rounded-xl bg-zomato-500 px-5 py-2 font-semibold text-white hover:bg-zomato-600 transition-colors disabled:opacity-70">
                      {reviewLoading ? 'Submitting...' : (editingReview ? 'Update' : 'Submit Review')}
                    </button>
                    {editingReview && (
                      <button type="button" onClick={() => { setEditingReview(null); setReviewRating(0); setReviewComment(''); }} className="rounded-xl border border-borderGray px-5 py-2 text-sm font-medium text-mutedGray hover:bg-softGray transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Review List */}
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-mutedGray">
                <p className="text-4xl mb-2">💬</p>
                <p className="font-medium">No reviews yet. Be the first!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-2xl bg-white border border-borderGray shadow-card p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-zomato-100 flex items-center justify-center font-bold text-zomato-600 text-sm">
                        {review.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-darkCharcoal text-sm">{review.userName}</p>
                        <p className="text-xs text-mutedGray">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="mt-3 text-sm text-mutedGray leading-relaxed">{review.comment}</p>
                  {user && user.id === review.userId && (
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => { setEditingReview(review); setReviewRating(review.rating); setReviewComment(review.comment); setActiveTab('reviews'); }} className="text-xs font-medium text-zomato-500 hover:underline">Edit</button>
                      <button onClick={() => deleteReview(review.id)} className="text-xs font-medium text-mutedGray hover:text-red-500">Delete</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Cart Conflict Dialog */}
      {cartConflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-hover max-w-sm w-full p-6 animate-fade-in">
            <h3 className="font-bold text-darkCharcoal text-lg">Start a new cart?</h3>
            <p className="mt-2 text-sm text-mutedGray">
              Your cart contains items from <strong>{cart.restaurantName}</strong>. Adding items from <strong>{restaurant.name}</strong> will clear your current cart.
            </p>
            <div className="mt-5 flex gap-3">
              <button onClick={handleClearAndAdd} className="flex-1 rounded-xl bg-zomato-500 py-2.5 font-semibold text-white hover:bg-zomato-600 transition-colors">
                Yes, start new cart
              </button>
              <button onClick={() => setCartConflict(null)} className="flex-1 rounded-xl border border-borderGray py-2.5 text-sm font-medium text-darkCharcoal hover:bg-softGray transition-colors">
                Keep existing
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RestaurantDetailsPage;
