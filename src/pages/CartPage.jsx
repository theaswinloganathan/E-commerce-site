import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, Heart, ShieldCheck, Truck, RotateCcw, CreditCard, ArrowRight, MapPin, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore, useStore } from '../store/useStore'
import { formatPrice, cn } from '../lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore()
  const { toggleWishlist, wishlist, user, deliveryLocation } = useStore()
  const navigate = useNavigate()
  
  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.price || 0
    return acc + price * item.quantity
  }, 0)
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  
  const deliveryFee = 150.00
  const isFreeDelivery = subtotal >= 2500
  const total = subtotal + (subtotal > 0 && !isFreeDelivery ? deliveryFee : 0)

  const isWishlisted = (productId) => wishlist.some(p => p.id === productId)

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-4 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 bg-brand-50 rounded-full flex items-center justify-center mb-8 shadow-inner"
        >
          <ShoppingBag size={48} className="text-brand-200" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-serif font-black mb-6 text-brand-950 tracking-tight text-balance">Your selection is waiting.</h1>
        <p className="text-brand-500 mb-10 max-w-md text-lg leading-relaxed font-medium">Your shopping bag is currently empty. Discover our latest collection and elevate your style.</p>
        <Link to="/shop" className="btn-primary px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-900/20 active:scale-95 transition-all">Start Exploring</Link>
        {!user && (
          <div className="mt-12 text-xs font-bold text-brand-400 uppercase tracking-widest">
            Have an account? <Link to="/login" className="text-brand-950 underline underline-offset-8 decoration-brand-200">Sign In</Link> to view your bag.
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mb-4">
               <Link to="/" className="hover:text-brand-950 transition-colors">Home</Link>
               <span>/</span>
               <span className="text-brand-950">Shopping Bag</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-brand-950 tracking-tight">Your Bag</h1>
          </div>
          <p className="text-brand-500 font-bold text-sm bg-brand-50 px-4 py-2 rounded-full border border-brand-100 uppercase tracking-widest">{totalItems} {totalItems === 1 ? 'Piece' : 'Pieces'} Selected</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
          {/* Left Column: Cart Items */}
          <div className="flex-1">
            <div className="space-y-10">
              {items.filter(item => item && item.product).map((item) => {
                const price = item.product.price;
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.id} 
                    className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-brand-50 last:border-0 group"
                  >
                    <Link to={`/product/${item.product.id}`} className="w-full sm:w-48 aspect-[3/4] flex-shrink-0 bg-brand-50 overflow-hidden rounded-2xl relative shadow-sm border border-brand-50">
                      <img src={item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      {item.product.discountPercentage > 0 && (
                        <div className="absolute top-4 left-4 bg-brand-950 text-white text-[9px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-widest">-{item.product.discountPercentage}%</div>
                      )}
                    </Link>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em] mb-2">{item.product.brand || 'LAKSHMI FASHION'}</p>
                          <Link to={`/product/${item.product.id}`} className="font-serif font-black text-2xl text-brand-950 mb-3 hover:text-brand-600 transition-colors block leading-tight">
                            {item.product.name}
                          </Link>
                          <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-brand-500">
                            <span className="bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 text-brand-950">Size: {item.size}</span>
                            <span className="bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 text-brand-950">Color: {item.color}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-brand-950 text-xl tracking-tight">{formatPrice(price)}</p>
                          {item.product.originalPrice > price && (
                            <p className="text-xs text-brand-400 line-through font-medium">{formatPrice(item.product.originalPrice)}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-brand-50">
                        {/* Quantity Control */}
                        <div className="flex items-center bg-brand-50 rounded-xl p-1 border border-brand-100">
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center text-brand-950 hover:bg-white rounded-lg transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} strokeWidth={3} />
                          </motion.button>
                          <span className="w-12 text-center text-sm font-black text-brand-950 tracking-tighter">{item.quantity}</span>
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-brand-950 hover:bg-white rounded-lg transition-all shadow-sm"
                          >
                            <Plus size={16} strokeWidth={3} />
                          </motion.button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-6">
                          <button 
                            onClick={() => toggleWishlist(item.product)}
                            className={cn(
                                "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95",
                                isWishlisted(item.product.id) ? "text-red-500" : "text-brand-400 hover:text-brand-950"
                            )}
                          >
                            <Heart size={18} fill={isWishlisted(item.product.id) ? "currentColor" : "none"} strokeWidth={isWishlisted(item.product.id) ? 0 : 2} />
                            <span className="hidden sm:inline">Save for later</span>
                          </button>
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-100 hidden sm:block" />
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-400 hover:text-red-600 transition-all hover:scale-105 active:scale-95"
                          >
                            <Trash2 size={18} />
                            <span className="hidden sm:inline">Remove Item</span>
                          </button>
                        </div>

                        {/* Subtotal Display */}
                        <div className="hidden sm:block text-right">
                           <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Item Total</p>
                           <p className="font-black text-brand-950 text-xl tracking-tight">{formatPrice(price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            
            <div className="mt-16 p-8 bg-brand-50 rounded-3xl border-2 border-dashed border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-brand-950">
                  <RotateCcw size={24} />
                </div>
                <div>
                  <p className="font-black text-brand-950 uppercase text-xs tracking-widest mb-1">Hassle-Free Returns</p>
                  <p className="text-sm text-brand-500 font-medium">Changed your mind? Return within 14 days for a full refund.</p>
                </div>
              </div>
              <Link to="/shop" className="btn-outline whitespace-nowrap px-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-white border-2 border-brand-100 hover:border-brand-950 shadow-sm transition-all hover:-translate-y-1">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[420px] flex-shrink-0">
            <div className="bg-white border-2 border-brand-50 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-brand-900/5 sticky top-24">
              <h2 className="text-3xl font-serif font-black mb-10 text-brand-950 tracking-tight">Summary</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-brand-400 uppercase tracking-widest">Order Subtotal</span>
                  <span className="font-black text-brand-950">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-400 uppercase tracking-widest">Shipping</span>
                    {isFreeDelivery && <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Complimentary</span>}
                  </div>
                  <span className={cn("font-black text-brand-950", isFreeDelivery && "text-green-600")}>
                    {isFreeDelivery ? '₹0' : formatPrice(deliveryFee)}
                  </span>
                </div>
                
                {!isFreeDelivery && (
                  <div className="bg-brand-50/50 p-5 rounded-2xl border border-brand-100">
                    <div className="flex items-center justify-between mb-3">
                       <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Unlock Free Shipping</span>
                       <span className="text-[10px] font-black text-brand-950 uppercase tracking-widest">₹{subtotal}/₹2500</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden border border-brand-100">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(subtotal / 2500) * 100}%` }}
                        className="h-full bg-brand-950 rounded-full" 
                       />
                    </div>
                    <p className="mt-4 text-[10px] text-brand-500 font-bold text-center uppercase tracking-widest">Add <span className="text-brand-950">{formatPrice(2500 - subtotal)}</span> more for complimentary delivery</p>
                  </div>
                )}
              </div>
              
              <div className="pt-8 border-t-2 border-brand-50 mb-10">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-black text-brand-950 text-xl uppercase tracking-tighter">Grand Total</span>
                  <span className="font-black text-4xl text-brand-950 tracking-tighter">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-brand-400 text-right uppercase tracking-[0.2em]">All Taxes Included</p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')} 
                className="btn-primary w-full py-6 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.3em] mb-6 shadow-2xl shadow-brand-900/20 active:scale-95 transition-all group"
              >
                Checkout Now <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
              </motion.button>

              <div className="space-y-6 pt-10 border-t-2 border-brand-50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-950 flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-brand-950 uppercase tracking-widest mb-1">Encrypted Security</p>
                    <p className="text-[11px] text-brand-400 font-medium leading-relaxed">Your data is safe with our military-grade 256-bit SSL encryption.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-950 flex-shrink-0">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-brand-950 uppercase tracking-widest mb-1">Express Delivery</p>
                    {deliveryLocation ? (
                       <p className="text-[11px] text-brand-950 font-bold leading-relaxed">Delivering to {deliveryLocation.city} in <span className="text-green-600">2-4 business days.</span></p>
                    ) : (
                       <p className="text-[11px] text-brand-400 font-medium leading-relaxed">Select a destination in the header for real-time delivery estimates.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
