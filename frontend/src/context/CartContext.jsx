import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialCart = {
  items: [],
  totalAmount: 0.0,
  restaurantId: null,
  restaurantName: null,
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(initialCart);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!isAuthenticated) {
      setCart(initialCart);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get('/api/cart');
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  const addToCart = async (menuItemId, quantity = 1) => {
    try {
      const response = await api.post(`/api/cart/items?menuItemId=${menuItemId}&quantity=${quantity}`);
      if (response.data.success) {
        setCart(response.data.data);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || '';
      if (msg.startsWith('CART_CONFLICT:')) {
        return {
          success: false,
          conflict: true,
          message: msg.split('CART_CONFLICT:')[1],
        };
      }
      return { success: false, message: msg || 'Failed to add item' };
    }
    return { success: false, message: 'Failed to add item' };
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const response = await api.put(`/api/cart/items/${cartItemId}?quantity=${quantity}`);
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Failed to update quantity', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await api.delete(`/api/cart/items/${cartItemId}`);
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Failed to remove item', error);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/api/cart');
      setCart(initialCart);
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
