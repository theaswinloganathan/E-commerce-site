import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useParams, Link } from 'react-router-dom'
import { Star, Truck, Shield, RotateCcw, Heart, Share2, Plus, Minus, ShoppingBag, Search, MapPin, ArrowRight } from 'lucide-react'
import { products } from '../lib/mockData'
import { formatPrice, cn } from '../lib/utils'
import { useCartStore, useStore } from '../store/useStore'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import SizeGuideModal from '../components/shop/SizeGuideModal'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const product = products.find(p => p.id === id || p.slug === id)
  
  const [mainImage, setMainImage] = useState(null)
  const [imgError, setImgError] = useState(false)
  const [thumbErrors, setThumbErrors] = useState({})
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState('Default')
  const [sizeError, setSizeError] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isAdded, setIsAdded] = useState(false)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)

  const addItem = useCartStore((state) => state.addItem)
  const toggleWishlist = useStore((state) => state.toggleWishlist)
  const wishlist = useStore((state) => state.wishlist || [])
  const isWishlisted = wishlist.some(p => p?.id === product?.id)
  
  const [reviews, setReviews] = useState([
    { id: 'mock-1', user_name: 'Sophia L.', rating: 5, comment: 'Absolutely stunning! The quality of the fabric is even better than I expected. Fits perfectly and looks very premium.', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'mock-2', user_name: 'James R.', rating: 4, comment: 'Great style and comfort. Shipping was fast too. Highly recommend for anyone looking for classic pieces.', created_at: new Date(Date.now() - 86400000 * 5).toISOString() }
  ])
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const user = useStore(state => state.user)
  const setUser = useStore(state => state.setUser)
  const deliveryLocation = useStore(state => state.deliveryLocation)

  useEffect(() => {
    if (product) {
      setMainImage(product.images?.[0] || null)
      setImgError(false)
      setThumbErrors({})
      setSelectedSize(null)
      setSelectedColor(product.colors?.[0] || 'Default')
      setQuantity(1)
      setSizeError(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      // Fetch reviews for this product
      fetchReviews()

      // Set up real-time subscription with a unique channel name
      const channel = supabase
        .channel(`reviews-product-${product.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'reviews',
          filter: `product_id=eq.${product.id}`
        }, (payload) => {
          setReviews(prev => [payload.new, ...prev])
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [product])

  const fetchReviews = async () => {
    if (!product) return
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', product.id)
      .order('created_at', { ascending: false })
    
    if (data) {
      // Merge with mock reviews for initial premium feel if DB is empty
      if (data.length === 0) {
        setReviews([
          { id: 'mock-1', user_name: 'Sophia L.', rating: 5, comment: 'Absolutely stunning! The quality of the fabric is even better than I expected. Fits perfectly and looks very premium.', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
          { id: 'mock-2', user_name: 'James R.', rating: 4, comment: 'Great style and comfort. Shipping was fast too. Highly recommend for anyone looking for classic pieces.', created_at: new Date(Date.now() - 86400000 * 5).toISOString() }
        ])
      } else {
        setReviews(data)
      }
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setSubmitError("Please sign in to share your experience.")
      return
    }
    if (!newReview.comment.trim()) {
      setSubmitError("Please write your thoughts before posting.")
      return
    }

    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      const { error: insertError } = await supabase
        .from('reviews')
        .insert({
          product_id: product.id,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email.split('@')[0],
          rating: newReview.rating,
          comment: newReview.comment
        })

      if (insertError) throw insertError
      
      setSubmitSuccess(true)
      setNewReview({ rating: 5, comment: '' })
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeError(true)
      return
    }
    addItem(product, selectedSize || 'Default', selectedColor, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4)

  if (!product) {
    return (
      <div className="pt-40 pb-20 text-center min-h-[80vh] flex flex-col items-center justify-center px-4 bg-white">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-32 h-32 bg-brand-50 rounded-full flex items-center justify-center mb-10 shadow-inner">
          <Search size={48} className="text-brand-200" />
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 text-brand-950 tracking-tight">Product Not Found</h2>
        <p className="text-brand-500 mb-10 max-w-md text-lg leading-relaxed font-medium">This masterpiece might have moved to a different collection or is currently unavailable.</p>
        <Link to="/shop" className="btn-primary px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-900/20 active:scale-95 transition-all">
          Explore Collection
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mb-12">
            <Link to="/" className="hover:text-brand-950 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-brand-950 transition-colors">Collection</Link>
            <span>/</span>
            <span className="text-brand-950">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 mb-32">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-brand-50 relative group shadow-2xl shadow-brand-900/5 border border-brand-50"
            >
              {!imgError ? (
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                  <ShoppingBag size={64} className="text-brand-100 mb-6" />
                  <p className="text-xs font-black text-brand-300 uppercase tracking-widest">Image under preparation</p>
                </div>
              )}
              {product.discountPercentage > 0 && (
                <div className="absolute top-8 left-8 bg-brand-950 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded shadow-xl">
                  {product.discountPercentage}% OFF
                </div>
              )}
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4 sm:gap-6">
               {product.images?.map((img, idx) => (
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  onClick={() => {
                    setMainImage(img)
                    setImgError(false)
                  }}
                  className={cn(
                    "aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all duration-500 hover:scale-105 active:scale-95",
                    mainImage === img ? "border-brand-950 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                   <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col">
            <div className="mb-10">
              <p className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mb-4">{product.brand || 'LAKSHMI FASHION'}</p>
              <h1 className="text-4xl md:text-6xl font-serif font-black text-brand-950 mb-6 tracking-tight leading-tight uppercase">{product.name}</h1>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center bg-brand-50 px-4 py-2 rounded-full border border-brand-100 shadow-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(product.rating || 0) ? "#0c0a09" : "none"} color="#0c0a09" strokeWidth={1} />
                  ))}
                  <span className="text-[10px] font-black text-brand-950 ml-3 uppercase tracking-widest">{product.rating}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-100" />
                <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">{product.review_count} Verified Reviews</span>
              </div>

              <div className="flex items-end gap-4 mb-10">
                <span className="text-4xl font-black text-brand-950 tracking-tighter leading-none">{formatPrice(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-brand-400 line-through tracking-tighter mb-1">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              <p className="text-brand-500 text-lg leading-relaxed font-medium mb-10 max-w-lg">
                {product.description || 'Elevate your daily ensemble with this timeless piece, meticulously designed to balance modern aesthetics with exceptional comfort and durability.'}
              </p>
            </div>

            {/* Size & Color Selections */}
            <div className="space-y-12 mb-12">
              {product.sizes && product.sizes.length > 0 && (
                <div id="size-selection">
                  <div className="flex justify-between items-center mb-6">
                     <h4 className={cn("text-[10px] font-black uppercase tracking-[0.2em]", sizeError ? "text-red-500" : "text-brand-950")}>
                        Select Size {sizeError && <span className="text-red-400 ml-2">(Selection Required)</span>}
                     </h4>
                     <button 
                       onClick={() => setIsSizeGuideOpen(true)}
                       className="text-[10px] font-bold text-brand-400 uppercase tracking-widest hover:text-brand-950 transition-colors"
                     >
                       Size Guide
                     </button>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {product.sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => { setSelectedSize(size); setSizeError(false); }}
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-300 active:scale-95",
                          selectedSize === size ? "bg-brand-950 text-white shadow-xl scale-110" : "bg-brand-50 text-brand-950 hover:bg-brand-100"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-brand-950">Color Palette</h4>
                  <div className="flex flex-wrap gap-6">
                    {product.colors.map(color => (
                      <button 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className="flex flex-col items-center gap-3 group"
                      >
                         <div className={cn(
                           "w-10 h-10 rounded-full border-2 p-1 transition-all group-hover:scale-110 active:scale-90",
                           selectedColor === color ? "border-brand-950 scale-110 shadow-lg" : "border-transparent"
                         )}>
                            <div className="w-full h-full rounded-full bg-brand-950" style={{ backgroundColor: color.toLowerCase() }} />
                         </div>
                         <span className={cn("text-[10px] font-black uppercase tracking-widest", selectedColor === color ? "text-brand-950" : "text-brand-400 group-hover:text-brand-950")}>{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
               <div className="flex items-center bg-brand-50 rounded-2xl p-1 border border-brand-100 shadow-sm">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-14 flex items-center justify-center text-brand-950 hover:bg-white rounded-xl transition-all shadow-sm"
                  >
                    <Minus size={18} strokeWidth={3} />
                  </motion.button>
                  <span className="w-12 text-center text-sm font-black text-brand-950 tracking-tighter">{quantity}</span>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-14 h-14 flex items-center justify-center text-brand-950 hover:bg-white rounded-xl transition-all shadow-sm"
                  >
                    <Plus size={18} strokeWidth={3} />
                  </motion.button>
               </div>
               
               <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={cn(
                  "flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl",
                  product.stock > 0 
                    ? (isAdded ? "bg-green-600 text-white shadow-green-900/20" : "bg-brand-950 text-white shadow-brand-900/20 active:bg-brand-900") 
                    : "bg-brand-50 text-brand-400 cursor-not-allowed"
                )}
               >
                 {isAdded ? (
                   <>Added Successfully <ShoppingBag size={18} /></>
                 ) : (
                   <>{product.stock > 0 ? 'Initialize Purchase' : 'Sold Out'} <ArrowRight size={18} /></>
                 )}
               </motion.button>

               <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={() => toggleWishlist(product)}
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all shadow-xl",
                  isWishlisted ? "bg-red-50 border-red-200 text-red-500 shadow-red-900/5" : "bg-white border-brand-50 text-brand-950 shadow-brand-900/5 hover:border-brand-200"
                )}
               >
                 <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={isWishlisted ? 0 : 2} />
               </motion.button>
            </div>

            {/* Benefits Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-10 bg-brand-50/50 rounded-[2rem] border border-brand-100 mb-12">
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-950 shadow-lg shadow-brand-900/5">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-950 mb-1">Express Delivery</h5>
                    <p className="text-[10px] font-bold text-brand-400 uppercase tracking-tighter">Complementary shipping on orders above ₹2500.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-950 shadow-lg shadow-brand-900/5">
                    <RotateCcw size={24} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-950 mb-1">Authentic Returns</h5>
                    <p className="text-[10px] font-bold text-brand-400 uppercase tracking-tighter">Enjoy 14-day hassle-free returns for absolute peace of mind.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Tabs & Information */}
        <div className="mb-32">
          <div className="flex items-center justify-center gap-12 border-b border-brand-50 mb-16 overflow-x-auto hide-scrollbar">
            {['description', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-6 text-[10px] font-black uppercase tracking-[0.4em] transition-all relative group",
                  activeTab === tab ? "text-brand-950" : "text-brand-300 hover:text-brand-950"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-950 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-center sm:text-left">
                <h3 className="text-3xl font-serif font-black text-brand-950 uppercase tracking-tight">The Vision</h3>
                <p className="text-xl text-brand-500 leading-relaxed font-medium">
                   Every piece in our collection is born from a desire to combine luxury with practicality. We believe that true elegance lies in the details—from the choice of premium fabrics to the precision of every stitch. This {product.type?.toLowerCase() || 'item'} represents our commitment to timeless design and sustainable craftsmanship.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8">
                   <div className="p-6 bg-brand-50 rounded-3xl text-center">
                      <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-2">Fabrication</p>
                      <p className="text-xs font-black text-brand-950 uppercase">100% Premium Core</p>
                   </div>
                   <div className="p-6 bg-brand-50 rounded-3xl text-center">
                      <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-2">Artisan Made</p>
                      <p className="text-xs font-black text-brand-950 uppercase">Hand-Finished Details</p>
                   </div>
                   <div className="p-6 bg-brand-50 rounded-3xl text-center">
                      <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-2">Sustainable</p>
                      <p className="text-xs font-black text-brand-950 uppercase">Eco-Conscious Source</p>
                   </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'reviews' && (
              <div id="reviews-section" className="space-y-16">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-brand-50">
                    <div>
                       <h3 className="text-4xl font-serif font-black text-brand-950 mb-2 uppercase tracking-tight">Client Reviews</h3>
                       <p className="text-sm font-bold text-brand-400 uppercase tracking-widest">Shared experiences from our global community.</p>
                    </div>
                    <div className="flex flex-col items-center sm:items-end">
                       <div className="flex items-center gap-2 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={24} fill="#0c0a09" strokeWidth={0} />
                          ))}
                          <span className="text-3xl font-black text-brand-950 ml-2 tracking-tighter">4.9</span>
                       </div>
                       <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Based on {product.review_count || reviews.length} ratings</p>
                    </div>
                 </div>

                 {/* Review Submission Form */}
                 <div className="bg-brand-50/50 p-10 md:p-12 rounded-[3rem] border border-brand-100">
                    <h4 className="text-xl font-serif font-black text-brand-950 mb-8 uppercase tracking-tight">Write a Masterpiece Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-8">
                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Rating</p>
                          <div className="flex gap-4">
                             {[1, 2, 3, 4, 5].map((star) => (
                               <button 
                                 key={star} 
                                 type="button" 
                                 onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                 className="transition-transform active:scale-90"
                               >
                                 <Star size={32} fill={star <= newReview.rating ? "#0c0a09" : "none"} color="#0c0a09" strokeWidth={1.5} />
                               </button>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest block">Your Perspective</label>
                          <textarea 
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            className="w-full bg-white border-2 border-brand-50 rounded-3xl p-8 text-sm focus:outline-none focus:border-brand-950 transition-all min-h-[160px] font-medium" 
                            placeholder="Share your experience with this premium piece..."
                          />
                       </div>
                       
                       {submitError && <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{submitError}</p>}
                       {submitSuccess && <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Your review has been immortalized!</p>}

                       <button 
                         disabled={isSubmitting}
                         className="btn-primary w-full md:w-auto px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] disabled:opacity-50"
                       >
                         {isSubmitting ? 'Submitting...' : 'Post Perspective'}
                       </button>
                    </form>
                 </div>

                 <div className="grid grid-cols-1 gap-12">
                    {reviews.length > 0 ? reviews.map((review, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={review.id} 
                        className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-brand-900/5 border border-brand-50 relative group"
                      >
                         <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-brand-950 text-white flex items-center justify-center font-black text-lg shadow-xl shadow-brand-900/20 uppercase">
                                  {review.user_name?.[0] || 'U'}
                               </div>
                               <div>
                                  <h5 className="text-xs font-black text-brand-950 uppercase tracking-widest">{review.user_name}</h5>
                                  <p className="text-[10px] font-bold text-brand-400 uppercase tracking-tighter mt-0.5">Verified Purchase</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <div className="flex gap-1 mb-2 justify-end">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} fill={i < review.rating ? "#0c0a09" : "none"} color="#0c0a09" strokeWidth={1} />
                                  ))}
                               </div>
                               <span className="text-[9px] font-black text-brand-300 uppercase tracking-[0.2em]">{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                         </div>
                         <p className="text-lg text-brand-600 font-medium leading-relaxed italic pr-8">"{review.comment}"</p>
                      </motion.div>
                    )) : (
                      <div className="text-center py-20 border-2 border-dashed border-brand-100 rounded-[3rem]">
                        <p className="text-sm font-black text-brand-300 uppercase tracking-widest">No reviews yet. Be the first to share your thoughts.</p>
                      </div>
                    )}
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-24 border-t border-brand-50">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
               <div>
                  <p className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mb-4">Curated Selections</p>
                  <h2 className="text-4xl md:text-5xl font-serif font-black text-brand-950 tracking-tight uppercase">You May Also Admire</h2>
               </div>
               <Link to="/shop" className="text-[10px] font-black text-brand-950 uppercase tracking-[0.3em] border-b-2 border-brand-950 pb-2 hover:text-brand-500 hover:border-brand-300 transition-all">View All Masterpieces</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  )
}
