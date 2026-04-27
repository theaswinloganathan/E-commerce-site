import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore, useCartStore } from '../store/useStore'
import ProductCard from '../components/ProductCard'

export default function WishlistPage() {
  const wishlist = useStore((state) => state.wishlist)

  if (wishlist.length === 0) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-4 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 bg-brand-50 rounded-full flex items-center justify-center mb-8 shadow-inner"
        >
          <Heart size={48} className="text-brand-200" strokeWidth={1} />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-serif font-black mb-6 text-brand-950 tracking-tight">Your Curated List</h1>
        <p className="text-brand-500 mb-10 max-w-md text-lg leading-relaxed font-medium">Keep track of the pieces you admire. Discover our collection and save your favorites here.</p>
        <Link to="/shop" className="btn-primary px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-900/20 active:scale-95 transition-all">Start Discovering</Link>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mb-4">
               <Link to="/" className="hover:text-brand-950 transition-colors">Home</Link>
               <span>/</span>
               <span className="text-brand-950">Wishlist</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-brand-950 tracking-tight">My Wishlist</h1>
          </div>
          <p className="text-brand-500 font-bold text-sm bg-brand-50 px-6 py-2 rounded-full border border-brand-100 uppercase tracking-widest">{wishlist.length} Items Saved</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
