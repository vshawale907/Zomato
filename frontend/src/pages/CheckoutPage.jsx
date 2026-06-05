import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import api from '../services/api';
import { MapPin, CreditCard, Smartphone, Banknote, CheckCircle, Plus } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI', icon: <Smartphone className="h-5 w-5" />, desc: 'Pay via any UPI app' },
  { id: 'CREDIT_CARD', label: 'Credit Card', icon: <CreditCard className="h-5 w-5" />, desc: 'Visa, Mastercard, Amex' },
  { id: 'DEBIT_CARD', label: 'Debit Card', icon: <CreditCard className="h-5 w-5" />, desc: 'All major bank cards' },
  { id: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', icon: <Banknote className="h-5 w-5" />, desc: 'Pay when order arrives' },
];

const CheckoutPage = () => {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);

  // New address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ street: '', city: '', state: '', zipCode: '', isDefault: false });
  const [addingAddr, setAddingAddr] = useState(false);

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/');
      return;
    }
    setLoading(true);
    api.get('/api/users/addresses').then((res) => {
      if (res.data.success) {
        setAddresses(res.data.data);
        const def = res.data.data.find((a) => a.isDefault) || res.data.data[0];
        if (def) setSelectedAddress(def.id);
      }
    }).finally(() => setLoading(false));
  }, []);

  const addAddress = async (e) => {
    e.preventDefault();
    setAddingAddr(true);
    try {
      const res = await api.post('/api/users/addresses', newAddr);
      if (res.data.success) {
        const added = res.data.data;
        setAddresses((prev) => [...prev, added]);
        setSelectedAddress(added.id);
        setShowAddressForm(false);
        setNewAddr({ street: '', city: '', state: '', zipCode: '', isDefault: false });
        showToast('Address added!', 'success');
      }
    } catch (e) {
      showToast('Failed to add address', 'error');
    } finally { setAddingAddr(false); }
  };

  const placeOrder = async () => {
    if (!selectedAddress) { showToast('Please select a delivery address', 'warning'); return; }
    setPlacing(true);
    try {
      const res = await api.post('/api/orders', { addressId: selectedAddress, paymentMethod: selectedPayment });
      if (res.data.success) {
        const order = res.data.data;
        await refreshCart();
        showToast('Order placed successfully! 🎉', 'success');
        navigate(`/orders/${order.id}`);
      }
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to place order', 'error');
    } finally { setPlacing(false); }
  };

  const deliveryFee = cart.totalAmount >= 500 ? 0 : 40;
  const gst = Math.round(cart.totalAmount * 0.05);
  const grandTotal = cart.totalAmount + deliveryFee + gst;

  return (
    <div className="min-h-screen flex flex-col bg-softGray">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <h1 className="text-2xl font-extrabold text-darkCharcoal mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Address + Payment */}
          <div className="lg:col-span-2 space-y-5">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-card border border-borderGray p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-darkCharcoal flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-zomato-500" /> Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-1 text-sm font-medium text-zomato-500 hover:text-zomato-600 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Add new
                </button>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => <div key={i} className="h-16 shimmer rounded-xl" />)}
                </div>
              ) : addresses.length === 0 && !showAddressForm ? (
                <div className="text-center py-6 text-mutedGray">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No saved addresses. Add one below.</p>
                  <button onClick={() => setShowAddressForm(true)} className="mt-3 text-sm font-medium text-zomato-500 hover:underline">
                    + Add address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label key={addr.id} className={`flex items-start gap-3 rounded-xl p-3 cursor-pointer border-2 transition-colors ${selectedAddress === addr.id ? 'border-zomato-500 bg-zomato-50' : 'border-borderGray hover:border-zomato-200'}`}>
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        className="mt-0.5 accent-zomato-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-darkCharcoal leading-snug">{addr.street}</p>
                        <p className="text-xs text-mutedGray mt-0.5">{addr.city}, {addr.state} – {addr.zipCode}</p>
                        {addr.isDefault && <span className="text-[10px] font-bold uppercase text-green-600">Default</span>}
                      </div>
                      {selectedAddress === addr.id && <CheckCircle className="h-5 w-5 text-zomato-500 flex-shrink-0 mt-0.5" />}
                    </label>
                  ))}
                </div>
              )}

              {/* Add Address Form */}
              {showAddressForm && (
                <form onSubmit={addAddress} className="mt-4 space-y-3 p-4 rounded-xl bg-softGray border border-borderGray animate-fade-in">
                  <h3 className="font-semibold text-sm text-darkCharcoal">New Address</h3>
                  <input
                    className="w-full rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none focus:border-zomato-400"
                    placeholder="Street address"
                    required
                    value={newAddr.street}
                    onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none focus:border-zomato-400" placeholder="City" required value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} />
                    <input className="rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none focus:border-zomato-400" placeholder="State" required value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} />
                  </div>
                  <input className="w-full rounded-xl border border-borderGray px-3 py-2.5 text-sm outline-none focus:border-zomato-400" placeholder="Zip Code" required value={newAddr.zipCode} onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })} />
                  <label className="flex items-center gap-2 text-sm text-darkCharcoal cursor-pointer">
                    <input type="checkbox" checked={newAddr.isDefault} onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })} className="accent-zomato-500" />
                    Set as default address
                  </label>
                  <div className="flex gap-2">
                    <button type="submit" disabled={addingAddr} className="rounded-xl bg-zomato-500 px-4 py-2 text-sm font-semibold text-white hover:bg-zomato-600 transition-colors">
                      {addingAddr ? 'Saving...' : 'Save Address'}
                    </button>
                    <button type="button" onClick={() => setShowAddressForm(false)} className="rounded-xl border border-borderGray px-4 py-2 text-sm font-medium text-mutedGray hover:bg-softGray transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-card border border-borderGray p-5">
              <h2 className="font-bold text-darkCharcoal mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-zomato-500" /> Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-colors ${
                      selectedPayment === method.id ? 'border-zomato-500 bg-zomato-50' : 'border-borderGray hover:border-zomato-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                      className="accent-zomato-500"
                    />
                    <div className={`rounded-lg p-1.5 ${selectedPayment === method.id ? 'text-zomato-500 bg-zomato-100' : 'text-mutedGray bg-softGray'}`}>
                      {method.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-darkCharcoal">{method.label}</p>
                      <p className="text-[11px] text-mutedGray">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-card border border-borderGray p-5 sticky top-24">
              <h2 className="font-bold text-darkCharcoal mb-4">Order Summary</h2>
              <p className="text-xs font-medium text-mutedGray uppercase tracking-wider mb-2">From {cart.restaurantName}</p>

              <div className="space-y-2 mb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-darkCharcoal truncate flex-1 mr-2">{item.menuItemName} × {item.quantity}</span>
                    <span className="font-medium text-darkCharcoal flex-shrink-0">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-borderGray pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-mutedGray">
                  <span>Subtotal</span><span>₹{cart.totalAmount}</span>
                </div>
                <div className="flex justify-between text-mutedGray">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-mutedGray">
                  <span>GST (5%)</span><span>₹{gst}</span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-green-600">Free delivery on orders above ₹500</p>
                )}
              </div>

              <div className="mt-3 border-t border-borderGray pt-3 flex justify-between font-bold text-darkCharcoal text-lg">
                <span>Total</span><span>₹{grandTotal}</span>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing || cart.items.length === 0}
                className="mt-5 w-full rounded-xl bg-zomato-500 py-3.5 font-bold text-white shadow-md hover:bg-zomato-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {placing ? (
                  <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <><CheckCircle className="h-5 w-5" /> Place Order</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
