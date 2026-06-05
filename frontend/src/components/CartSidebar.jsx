import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-hover animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-borderGray p-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-zomato-500" />
            <span className="font-semibold text-lg">My Cart</span>
            {cart.items.length > 0 && (
              <span className="rounded-full bg-zomato-50 px-2 py-0.5 text-xs font-bold text-zomato-500">
                {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 text-mutedGray hover:bg-softGray hover:text-darkCharcoal transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-full bg-softGray p-6 text-mutedGray mb-4">
                <ShoppingBag className="h-12 w-12" />
              </div>
              <p className="font-semibold text-lg text-darkCharcoal">Your cart is empty</p>
              <p className="text-sm text-mutedGray mt-1">Add items from your favorite restaurants to get started!</p>
              <button 
                onClick={onClose}
                className="mt-6 rounded-lg bg-zomato-500 px-6 py-2.5 font-medium text-white shadow-sm hover:bg-zomato-600 transition-colors"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-mutedGray">Ordering From</span>
                <h3 className="font-semibold text-darkCharcoal text-base">{cart.restaurantName}</h3>
              </div>
              
              <div className="divide-y divide-borderGray">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4">
                    {item.menuItemImage ? (
                      <img 
                        src={item.menuItemImage} 
                        alt={item.menuItemName} 
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-md bg-softGray flex items-center justify-center text-xs text-mutedGray">
                        Food
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-darkCharcoal text-sm leading-snug">{item.menuItemName}</h4>
                      <p className="text-sm font-semibold text-zomato-600 mt-1">₹{item.menuItemPrice}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 border border-borderGray rounded-lg bg-white px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-mutedGray hover:text-zomato-500 transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-mutedGray hover:text-zomato-500 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-mutedGray hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t border-borderGray bg-softGray/50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={clearCart}
                className="flex items-center gap-1.5 text-sm font-medium text-mutedGray hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" /> Clear Cart
              </button>
              <div className="text-right">
                <p className="text-xs text-mutedGray">Grand Total</p>
                <p className="text-xl font-bold text-darkCharcoal">₹{cart.totalAmount}</p>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full rounded-lg bg-zomato-500 py-3 font-semibold text-white shadow-md hover:bg-zomato-600 transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
