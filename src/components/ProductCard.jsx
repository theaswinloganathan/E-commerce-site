import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Eye, Search, Star, X, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '../lib/utils'
import { useStore, useCartStore } from '../store/useStore'
import { cn } from '../lib/utils'

export default function ProductCard({ product, onQuickView }) {
  const [imgError, setImgError] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [showSizes, setShowSizes] = useState(false)
  
  const toggleWishlist = useStore((state) => state.toggleWishlist)
  const wishlist = useStore((state) => state.wishlist)
  const addItem = useCartStore((state) => state.addItem)
  
  if (!product) return null
  const isWishlisted = wishlist.some(p => p?.id === product?.id)
  
  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.sizes && product.sizes.length > 0 && !showSizes) {
      setShowSizes(true)
      return
    }

    const size = product.sizes?.[0] || 'Default'
    addItem(product, size, product.colors?.[0] || 'Default', 1)
    setIsAdded(true)
    setShowSizes(false)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleSizeSelect = (e, size) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, size, product.colors?.[0] || 'Default', 1)
    setIsAdded(true)
    setShowSizes(false)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-brand-50/50 hover:border-brand-100 hover:-translate-y-2"
    >
      <Link to={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-brand-50 block">
        {/* Images */}
        {!imgError && product.images?.[0] ? (
          <>
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className={cn(
                "object-cover w-full h-full transition-all duration-1000 ease-out group-hover:scale-105",
                product.images[1] ? "group-hover:opacity-0" : "group-hover:brightness-95"
              )}
              loading="lazy"
              onError={() => setImgError(true)}
            />
            {product.images[1] && (
              <img 
                src={product.images[1]} 
                alt={`${product.name} alternate view`} 
                className="absolute inset-0 object-cover w-full h-full opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-out group-hover:scale-105 group-hover:brightness-95"
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-brand-50 text-brand-300 p-6 text-center">
            <Search size={32} className="mb-3 opacity-20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Preview Pending</span>
            <span className="text-[8px] mt-2 font-medium opacity-50 uppercase tracking-widest">{product.category}</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
          {product.new_arrival && (
            <span className="bg-white/90 backdrop-blur-xl px-4 py-2 text-[8px] font-black tracking-[0.3em] rounded-full shadow-lg text-brand-950 uppercase border border-white/20">NEW</span>
          )}
          {product.discountPercentage > 0 && (
            <span className="bg-brand-950 text-white px-4 py-2 text-[8px] font-black tracking-[0.3em] rounded-full shadow-lg uppercase">-{product.discountPercentage}%</span>
          )}
        </div>
        <div className="absolute bottom-5 right-5 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
           <div className="bg-white/90 backdrop-blur-xl p-3 rounded-full shadow-2xl border border-white/20">
              <ShoppingBag size={16} className="text-brand-950" />
           </div>
        </div>

        {/* Wishlist Button */}
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={handleWishlist}
          className={cn(
            "absolute top-5 right-5 p-3 rounded-full shadow-xl bg-white/90 backdrop-blur-xl transition-all duration-500 hover:bg-white z-10 border border-white/20",
            isWishlisted ? "text-red-500" : "text-brand-400 hover:text-brand-950"
          )}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </motion.button>

        {/* Quick Actions Overlay (Mobile/Table View) */}
        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col gap-2">
           <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView?.() }}
              className="w-full bg-white/95 backdrop-blur-md text-brand-950 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-brand-950 hover:text-white transition-all transform hover:-translate-y-1"
           >
              Quick View
           </button>
        </div>

        {/* Size Selection Overlay */}
        <AnimatePresence>
          {showSizes && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/98 backdrop-blur-xl z-30 flex flex-col items-center justify-center p-8 text-center"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <button 
                onClick={() => setShowSizes(false)}
                className="absolute top-6 right-6 text-brand-300 hover:text-brand-950 p-2 transition-colors"
              >
                <X size={24} />
              </button>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-400 mb-8">Select Your Size</h4>
              <div className="flex flex-wrap justify-center gap-4">
                {product.sizes?.map(size => (
                  <button
                    key={size}
                    onClick={(e) => handleSizeSelect(e, size)}
                    className="w-14 h-14 border-2 border-brand-50 flex items-center justify-center text-sm font-bold hover:border-brand-950 hover:bg-brand-950 hover:text-white transition-all rounded-2xl active:scale-90"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
      
      {/* Product Info */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <p className="text-[9px] font-black text-brand-300 uppercase tracking-[0.25em]">{product.brand || product.category}</p>
          <div className="flex items-center gap-1.5 bg-brand-50/50 px-2.5 py-1 rounded-full">
            <Star size={10} className="fill-brand-950 text-brand-950" />
            <span className="text-[10px] font-black text-brand-950">{product.rating || '4.5'}</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`} className="block mb-4">
          <h3 className="font-serif font-bold text-brand-950 text-lg leading-snug line-clamp-1 group-hover:text-brand-600 transition-colors">{product.name}</h3>
        </Link>
        
        <div className="mt-auto pt-4 border-t border-brand-50/50 flex items-center justify-between">
          <div className="flex flex-col">
             <div className="flex items-baseline gap-2.5">
               <span className="font-black text-brand-950 text-xl tracking-tighter">{formatPrice(product.price)}</span>
               {product.originalPrice > product.price && (
                 <span className="text-xs text-brand-300 line-through font-medium">{formatPrice(product.originalPrice)}</span>
               )}
             </div>
             {product.stock > 0 && product.stock < 10 && (
               <span className="text-[8px] font-black text-orange-500 uppercase tracking-[0.2em] mt-2">Only {product.stock} Left</span>
             )}
          </div>
          
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={product.stock > 0 ? handleAddToCart : (e) => { e.preventDefault(); e.stopPropagation(); }}
            className={cn(
              "w-11 h-11 rounded-2xl border flex items-center justify-center transition-all duration-500 shadow-sm",
              isAdded 
                ? "bg-green-600 border-green-600 text-white shadow-green-200" 
                : "border-brand-100 text-brand-950 hover:bg-brand-950 hover:text-white hover:shadow-brand-900/20"
            )}
          >
             {isAdded ? <CheckCircle2 size={18} /> : <ShoppingBag size={18} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
