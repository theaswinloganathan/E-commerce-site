import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Package, Truck, CheckCircle, Clock, ChevronRight, ChevronDown, ChevronUp, MapPin, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatPrice } from '../lib/utils';

const Orders = () => {
  const user = useStore((state) => state.user);
  const orders = useStore((state) => state.orders);
  const isLoading = useStore((state) => state.isLoadingOrders);
  const error = useStore((state) => state.orderError);
  const fetchOrders = useStore((state) => state.fetchOrders);
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);

  React.useEffect(() => {
    if (user) {
      fetchOrders(user.id);
    }
  }, [user, fetchOrders]);

  if (!user) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-4 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 bg-brand-50 rounded-full flex items-center justify-center mb-8 shadow-inner"
        >
          <Package size={48} className="text-brand-200" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-serif font-black mb-6 text-brand-950 tracking-tight">Access Your Archive</h1>
        <p className="text-brand-500 mb-10 max-w-md text-lg leading-relaxed font-medium">Please sign in to view your order history and track your pending deliveries.</p>
        <button 
          onClick={() => navigate('/login')}
          className="btn-primary px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-900/20 active:scale-95 transition-all"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-4 min-h-[80vh] flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-brand-950 border-t-transparent rounded-full mb-8"
        />
        <p className="text-brand-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing purchase history...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-4 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Package size={32} className="text-red-400" />
        </div>
        <h2 className="text-3xl font-serif font-black mb-4 text-brand-950">Sync Failed</h2>
        <p className="text-brand-500 mb-8 max-w-md mx-auto">{error}</p>
        <button onClick={() => fetchOrders(user.id)} className="btn-primary">Try Again</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-4 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 bg-brand-50 rounded-full flex items-center justify-center mb-8 shadow-inner"
        >
          <Package size={48} className="text-brand-200" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-serif font-black mb-6 text-brand-950 tracking-tight">No History Found</h1>
        <p className="text-brand-500 mb-10 max-w-md text-lg leading-relaxed font-medium">Your archive is currently empty. Start building your collection today.</p>
        <button 
          onClick={() => navigate('/shop')} 
          className="btn-primary px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-900/20 active:scale-95 transition-all"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing': return <Clock size={14} />;
      case 'Shipped': return <Truck size={14} />;
      case 'Delivered': return <CheckCircle size={14} />;
      default: return <Package size={14} />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Processing': return 'bg-amber-50 text-amber-900 border-amber-100';
      case 'Shipped': return 'bg-blue-50 text-blue-900 border-blue-100';
      case 'Delivered': return 'bg-green-50 text-green-900 border-green-100';
      default: return 'bg-brand-50 text-brand-900 border-brand-100';
    }
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mb-4">
               <Link to="/" className="hover:text-brand-950 transition-colors">Home</Link>
               <span>/</span>
               <Link to="/profile" className="hover:text-brand-950 transition-colors">Profile</Link>
               <span>/</span>
               <span className="text-brand-950">Orders</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-brand-950 tracking-tight">Purchase Archive</h1>
          </div>
          <p className="text-brand-500 font-bold text-sm bg-brand-50 px-6 py-2 rounded-full border border-brand-100 uppercase tracking-widest">{orders.length} Deliveries</p>
        </div>

        <div className="space-y-12">
          {orders.map((order, orderIdx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: orderIdx * 0.1 }}
              key={order.id} 
              className="bg-white border border-brand-50 shadow-2xl shadow-brand-900/5 rounded-[2.5rem] overflow-hidden group hover:-translate-y-1 transition-all duration-500"
            >
              {/* Order Header */}
              <div className="bg-brand-50/50 px-10 py-8 border-b border-brand-50 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-brand-300 uppercase tracking-widest">Order Placed</p>
                  <p className="text-xs font-black text-brand-950 uppercase">{order.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-brand-300 uppercase tracking-widest">Total Value</p>
                  <p className="text-xs font-black text-brand-950 uppercase">{formatPrice(order.total)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-brand-300 uppercase tracking-widest">Order Reference</p>
                  <p className="text-xs font-black text-brand-950 uppercase tracking-tighter">#{order.id}</p>
                </div>
                <div className="flex justify-end">
                   <div className={cn(
                     "px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 self-start",
                     getStatusStyle(order.status)
                   )}>
                      {getStatusIcon(order.status)}
                      {order.status}
                   </div>
                </div>
              </div>

              <div className="p-10">
                <div className="space-y-8 mb-10">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-8 group/item">
                      <div className="w-24 h-32 rounded-2xl bg-brand-50 overflow-hidden flex-shrink-0 border border-brand-50 shadow-xl shadow-brand-900/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover/item:scale-110 duration-700" />
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-2">
                           <h4 className="text-xl font-serif font-black text-brand-950 uppercase tracking-tight leading-none">{item.name}</h4>
                           <p className="text-sm font-black text-brand-950">{formatPrice(item.price)}</p>
                         </div>
                         <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-6">Quantity: {item.qty}</p>
                         <button 
                          onClick={() => navigate(`/product/${item.id}#reviews`)}
                          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gold-600 hover:text-gold-500 transition-all active:scale-95 bg-gold-400/5 px-4 py-2 rounded-full border border-gold-400/10"
                        >
                          <Star size={12} fill="currentColor" /> Write a Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-10 border-t border-brand-50">
                   <button 
                      onClick={() => setTrackingOrder(trackingOrder === order.id ? null : order.id)}
                      className="btn-primary px-8 py-4 text-[9px] tracking-[0.2em]"
                    >
                      {trackingOrder === order.id ? 'Close Map' : 'Live Tracking'}
                    </button>
                    <button 
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="btn-outline px-8 py-4 text-[9px] tracking-[0.2em]"
                    >
                      {expandedOrder === order.id ? 'Hide Overview' : 'Full Details'}
                    </button>
                </div>

                {/* Tracking Visualizer */}
                <AnimatePresence>
                  {trackingOrder === order.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-12 overflow-hidden"
                    >
                      <div className="p-10 bg-brand-50 rounded-[2rem] border border-brand-100">
                        <h5 className="text-[10px] font-black text-brand-950 uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                          <Truck size={16} /> Live Delivery Protocol
                        </h5>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-8 md:gap-0">
                          {/* Progress Line */}
                          <div className="absolute left-4 md:left-0 md:top-5 w-0.5 md:w-full h-full md:h-0.5 bg-brand-100 md:-z-0" />
                          
                          {['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                            const isCompleted = order.trackingSteps?.includes(step) || order.status === 'Delivered';
                            const isCurrent = order.status === step;
                            return (
                              <div key={step} className="relative z-10 flex md:flex-col items-center gap-6 md:gap-4 flex-1 w-full md:w-auto">
                                <div className={cn(
                                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-xl",
                                  isCompleted ? "bg-brand-950 text-white scale-110" : "bg-white border-2 border-brand-100 text-brand-200"
                                )}>
                                  {isCompleted ? <CheckCircle size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                </div>
                                <div className="text-left md:text-center">
                                  <p className={cn(
                                    "text-[9px] font-black uppercase tracking-widest",
                                    isCompleted ? "text-brand-950" : "text-brand-300"
                                  )}>
                                    {step}
                                  </p>
                                  {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-brand-950 mx-auto mt-2 animate-ping" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Details Section */}
                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-12 overflow-hidden pt-12 border-t border-brand-50"
                    >
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-6">
                             <p className="text-[10px] font-black text-brand-300 uppercase tracking-widest">Delivery Coordinates</p>
                             <div className="flex gap-4 p-6 bg-brand-50/50 rounded-2xl border border-brand-50">
                                <MapPin size={20} className="text-brand-950 mt-1 shrink-0" />
                                <p className="text-sm font-bold text-brand-600 leading-relaxed italic pr-4">"{order.address}"</p>
                             </div>
                          </div>
                          <div className="space-y-6">
                             <p className="text-[10px] font-black text-brand-300 uppercase tracking-widest">Financial Overview</p>
                             <div className="p-8 bg-brand-50/50 rounded-2xl border border-brand-50 space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-brand-100/50">
                                   <span className="text-[9px] font-black text-brand-400 uppercase tracking-widest">Payment Method</span>
                                   <span className="text-[9px] font-black text-brand-950 uppercase tracking-widest">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</span>
                                </div>
                                <div className="space-y-2 pt-2">
                                   <div className="flex justify-between">
                                      <span className="text-[10px] font-bold text-brand-500 uppercase">Subtotal</span>
                                      <span className="text-xs font-black text-brand-950">{formatPrice(order.total)}</span>
                                   </div>
                                   <div className="flex justify-between">
                                      <span className="text-[10px] font-bold text-brand-500 uppercase">Shipping</span>
                                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Complimentary</span>
                                   </div>
                                   <div className="flex justify-between pt-4 mt-2 border-t border-brand-100">
                                      <span className="text-[10px] font-black text-brand-950 uppercase tracking-widest">Grand Total</span>
                                      <span className="text-xl font-black text-brand-950">{formatPrice(order.total)}</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
