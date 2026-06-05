import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';
import api from '../services/api';
import { showToast } from '../components/Toast';
import { Package, ChevronRight, Clock, MapPin, Bike, X } from 'lucide-react';
import Pagination from '../components/Pagination';

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
const STATUS_LABELS = {
  PLACED: 'Order Placed',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};
const STATUS_ICONS = ['📋', '✅', '👨‍🍳', '🛵', '🎉'];

const OrderStatusTracker = ({ status }) => {
  const isCancelled = status === 'CANCELLED';
  const currentStep = STATUS_STEPS.indexOf(status);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-4">
        <X className="h-8 w-8 text-red-500" />
        <div>
          <p className="font-bold text-red-600">Order Cancelled</p>
          <p className="text-sm text-red-400">Your order has been cancelled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-center min-w-max">
        {STATUS_STEPS.map((step, idx) => {
          const isActive = idx <= currentStep;
          const isCurrent = idx === currentStep;
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                  isCurrent ? 'border-zomato-500 bg-zomato-500 shadow-md scale-110' :
                  isActive ? 'border-green-500 bg-green-500' : 'border-borderGray bg-white text-mutedGray'
                }`}>
                  {STATUS_ICONS[idx]}
                </div>
                <p className={`text-[11px] font-medium text-center whitespace-nowrap ${isActive ? 'text-darkCharcoal' : 'text-mutedGray'}`}>
                  {STATUS_LABELS[step]}
                </p>
              </div>
              {idx < STATUS_STEPS.length - 1 && (
                <div className={`h-0.5 w-12 sm:w-16 mx-1 rounded-full transition-colors ${idx < currentStep ? 'bg-green-500' : 'bg-borderGray'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const OrderCard = ({ order, onCancel }) => (
  <div className="bg-white rounded-2xl border border-borderGray shadow-card overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-borderGray bg-softGray">
      <div className="flex items-center gap-3">
        <img
          src={order.restaurantImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80'}
          alt={order.restaurantName}
          className="h-10 w-10 rounded-lg object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80'; }}
        />
        <div>
          <p className="font-bold text-darkCharcoal text-sm">{order.restaurantName}</p>
          <p className="text-xs text-mutedGray">Order #{order.id}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-mutedGray">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        <p className="text-xs text-mutedGray">{new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>

    {/* Tracker */}
    <div className="p-4 border-b border-borderGray">
      <OrderStatusTracker status={order.status} />
    </div>

    {/* Items */}
    <div className="p-4">
      <p className="text-xs font-semibold uppercase text-mutedGray tracking-wider mb-2">Items</p>
      <div className="space-y-1">
        {order.orderItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-darkCharcoal">{item.itemName} × {item.quantity}</span>
            <span className="text-mutedGray">₹{item.subtotal}</span>
          </div>
        ))}
      </div>

      {/* Address & Total */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-dashed border-borderGray">
        <div className="flex items-start gap-1.5 text-xs text-mutedGray">
          <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <span className="leading-relaxed">{order.deliveryAddress}</span>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-mutedGray">{order.paymentMethod.replace(/_/g, ' ')}</p>
          <p className="text-lg font-bold text-darkCharcoal">₹{order.totalAmount}</p>
        </div>
      </div>

      {/* Actions */}
      {order.status === 'PLACED' && (
        <button
          onClick={() => onCancel(order.id)}
          className="mt-3 w-full rounded-xl border border-red-300 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          Cancel Order
        </button>
      )}

      <Link
        to={`/orders/${order.id}`}
        className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border border-borderGray py-2 text-sm font-medium text-darkCharcoal hover:bg-softGray transition-colors"
      >
        View Details <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

const OrdersPage = () => {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [singleOrder, setSingleOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (orderId) {
      api.get(`/api/orders/${orderId}`)
        .then((res) => { if (res.data.success) setSingleOrder(res.data.data); })
        .finally(() => setLoading(false));
    } else {
      fetchOrders(0);
    }
  }, [orderId]);

  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/orders?page=${page}&size=10`);
      if (res.data.success) {
        setOrders(res.data.data.content);
        setTotalPages(res.data.data.totalPages);
        setCurrentPage(res.data.data.number);
      }
    } finally { setLoading(false); }
  };

  const cancelOrder = async (id) => {
    try {
      await api.post(`/api/orders/${id}/cancel`);
      showToast('Order cancelled', 'success');
      fetchOrders(currentPage);
    } catch (e) { showToast(e.response?.data?.message || 'Failed to cancel', 'error'); }
  };

  if (orderId && singleOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-softGray">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-8 w-full flex-1">
          <Link to="/orders" className="text-sm font-medium text-zomato-500 hover:underline mb-4 inline-block">← Back to Orders</Link>
          <OrderCard order={singleOrder} onCancel={cancelOrder} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-softGray">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8 w-full flex-1">
        <h1 className="text-2xl font-extrabold text-darkCharcoal mb-6 flex items-center gap-2">
          <Package className="h-6 w-6 text-zomato-500" /> My Orders
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-48 shimmer rounded-2xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl">📦</span>
            <h3 className="mt-4 text-xl font-bold text-darkCharcoal">No orders yet</h3>
            <p className="text-mutedGray mt-2">Your order history will appear here once you place an order</p>
            <Link to="/" className="mt-6 inline-block rounded-xl bg-zomato-500 px-6 py-3 font-bold text-white hover:bg-zomato-600 transition-colors">
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={cancelOrder} />
            ))}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={fetchOrders} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
