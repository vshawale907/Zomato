import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { showToast } from './Toast';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Leaf, AlertCircle } from 'lucide-react';

const FoodCard = ({ item, onCartConflict }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const cartItem = cart.items.find((ci) => ci.menuItemId === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = async () => {
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'info');
      navigate('/login');
      return;
    }
    setLoading(true);
    const result = await addToCart(item.id, 1);
    setLoading(false);
    if (result.success) {
      showToast(`${item.name} added to cart!`, 'success');
    } else if (result.conflict) {
      if (onCartConflict) onCartConflict(item);
    } else {
      showToast(result.message || 'Failed to add item', 'error');
    }
  };

  const handleIncrease = () => {
    if (cartItem) updateQuantity(cartItem.id, cartItem.quantity + 1);
  };

  const handleDecrease = () => {
    if (cartItem) {
      if (cartItem.quantity === 1) removeFromCart(cartItem.id);
      else updateQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  return (
    <div className="flex gap-4 py-5 border-b border-dashed border-borderGray last:border-0">
      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Veg indicator */}
        <div className={`inline-flex items-center border rounded-sm p-0.5 mb-1.5 ${item.veg ? 'border-green-600 text-green-600' : 'border-red-500 text-red-500'}`}>
          {item.veg ? <Leaf className="h-3 w-3 fill-current" /> : <span className="h-3 w-3 text-xs leading-none font-bold">N</span>}
        </div>

        <h4 className="font-semibold text-darkCharcoal text-sm leading-snug">{item.name}</h4>
        <p className="text-base font-bold text-darkCharcoal mt-1">₹{item.price}</p>
        {item.description && (
          <p className="text-xs text-mutedGray mt-1.5 leading-relaxed line-clamp-2">{item.description}</p>
        )}
      </div>

      {/* Image + Add Button */}
      <div className="flex-shrink-0 flex flex-col items-center gap-2">
        <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-softGray">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'; }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-2xl bg-gradient-to-br from-zomato-50 to-zomato-100">🍽️</div>
          )}
        </div>

        {/* Quantity / Add Button */}
        {quantity > 0 ? (
          <div className="flex items-center gap-2 rounded-lg border-2 border-zomato-500 bg-white px-2 py-1 shadow-sm">
            <button onClick={handleDecrease} className="text-zomato-500 font-bold">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-5 text-center text-sm font-bold text-zomato-600">{quantity}</span>
            <button onClick={handleIncrease} className="text-zomato-500 font-bold">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
        <button
            onClick={handleAdd}
            disabled={loading}
            className="flex items-center gap-1 rounded-lg border-2 border-zomato-500 px-3 py-1 text-xs font-bold text-zomato-500 bg-white hover:bg-zomato-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <span className="h-3 w-3 border-2 border-zomato-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            ADD
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
