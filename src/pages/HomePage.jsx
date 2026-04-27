import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Truck, Shield, Clock, Banknote, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { largeProducts } from '../lib/largeProducts'

const customCategories = [
  { id: 1, name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800' },
  { id: 2, name: 'Men', slug: 'men', image: '/images/men/clothing/casual-shirts/shirt1.webp' },
  { id: 3, name: 'Kids', slug: 'kids', image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=80&w=800' },
  { id: 4, name: 'Party Wear', slug: 'party-wear', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800' },
  { id: 5, name: 'New Arrivals', slug: 'new', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800' },
  { id: 6, name: 'Offers', slug: 'offers', image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&q=80&w=800' },
];

const heroSlides = [
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2000"
];

export default function HomePage() {
  const trendingProducts = largeProducts.filter(p => p.rating > 4).slice(0, 8);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="pb-0">
      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentSlide}
            src={heroSlides[currentSlide]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            alt="Premium Fashion Banner" 
            className="absolute inset-0 w-full h-full object-cover object-[center_20%] z-0"
          />
        </AnimatePresence>
        
        {/* Dark Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40 z-0" />
        
        <div className="container relative z-10 mx-auto px-4 md:px-8 mt-20">
          <div className="max-w-3xl text-white text-center md:text-left mx-auto md:mx-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block bg-orange-600/90 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6"
            >
              <span className="text-xs md:text-sm tracking-widest uppercase font-bold text-white flex items-center">
                🔥 Up to 30% OFF – Limited Time
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight drop-shadow-xl"
            >
              Premium Fashion Collection
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-medium drop-shadow-md mx-auto md:mx-0"
            >
              Discover elegant styles, trending looks, and timeless outfits for every occasion. Curated exclusively for you.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link to="/shop" className="group w-full sm:w-auto inline-flex items-center justify-center bg-white text-brand-950 hover:bg-brand-950 hover:text-white border-2 border-transparent hover:border-white transition-all duration-500 rounded-full px-12 py-4 uppercase tracking-[0.2em] text-sm font-bold shadow-[0_8px_30px_rgb(255,255,255,0.15)] hover:shadow-[0_8px_40px_rgb(255,255,255,0.3)] hover:-translate-y-1">
                Shop Now <ArrowRight size={18} className="ml-3 transform group-hover:translate-x-2 transition-transform duration-500" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button onClick={prevSlide} className="absolute left-4 z-20 p-3 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors backdrop-blur-sm hidden md:block">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 z-20 p-3 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors backdrop-blur-sm hidden md:block">
          <ChevronRight size={24} />
        </button>
      </section>

      {/* Top Info Bar */}
      <section className="py-10 bg-white border-b border-brand-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="p-4 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
              <Truck size={28} className="mx-auto mb-3 text-brand-950 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h3 className="font-serif font-semibold text-sm mb-1">Free Shipping</h3>
            </div>
            <div className="p-4 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
              <Shield size={28} className="mx-auto mb-3 text-brand-950 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h3 className="font-serif font-semibold text-sm mb-1">Premium Quality</h3>
            </div>
            <div className="p-4 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
              <Clock size={28} className="mx-auto mb-3 text-brand-950 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h3 className="font-serif font-semibold text-sm mb-1">Secure Checkout</h3>
            </div>
            <div className="p-4 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
              <Banknote size={28} className="mx-auto mb-3 text-brand-950 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h3 className="font-serif font-semibold text-sm mb-1">Cash on Delivery</h3>
            </div>
            <div className="p-4 group cursor-pointer hover:-translate-y-1 transition-transform duration-300 col-span-2 md:col-span-1">
              <RotateCcw size={28} className="mx-auto mb-3 text-brand-950 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h3 className="font-serif font-semibold text-sm mb-1">Easy Returns</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 container mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Shop by Category</h2>
          <div className="w-16 h-[1px] bg-brand-900 mx-auto" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {customCategories.map((category) => (
            <Link 
              key={category.id} 
              to={`/shop?category=${category.slug}`}
              className="group relative h-[250px] md:h-[350px] overflow-hidden rounded-xl block shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white text-2xl md:text-3xl font-serif font-medium mb-3 drop-shadow-md">{category.name}</h3>
                <span className="bg-white text-brand-950 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Collection Promotional Banners */}
      <section className="container mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Banner 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-brand-50 relative overflow-hidden h-[350px] md:h-[400px] flex items-center group cursor-pointer rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="relative z-10 pl-8 md:pl-12 w-1/2">
              <span className="inline-block bg-brand-950 text-white px-2 py-1 text-[10px] font-bold tracking-widest uppercase mb-4 rounded shadow-sm">Flat 20% OFF</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight text-brand-950">New Arrivals <br/> Just In</h2>
              <Link to="/shop?category=new" className="inline-block bg-white text-brand-950 px-6 py-3 rounded-md text-xs font-bold uppercase tracking-widest shadow-md hover:bg-brand-950 hover:text-white transition-colors duration-300">
                Shop Now
              </Link>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2">
              <img 
                src="/images/promo/promo1.png" 
                alt="New Collection" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-50 to-transparent" />
            </div>
          </motion.div>
          
          {/* Banner 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-brand-950 text-white relative overflow-hidden h-[350px] md:h-[400px] flex items-center group cursor-pointer rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="relative z-10 pl-8 md:pl-12 w-1/2">
              <span className="inline-block bg-white text-brand-950 px-2 py-1 text-[10px] font-bold tracking-widest uppercase mb-4 rounded shadow-sm">Essentials</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight text-white">Modern Men's <br /> Lookbook</h2>
              <Link to="/shop?category=men" className="inline-block bg-white text-brand-950 px-6 py-3 rounded-md text-xs font-bold uppercase tracking-widest shadow-md hover:bg-brand-900 hover:text-white transition-colors duration-300">
                Shop Men
              </Link>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2">
              <img 
                src="/images/promo/promo2.png" 
                alt="Men's Collection" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-950 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Products (Horizontal Scroll) */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center">
                  🔥 Trending Now
                </span>
                <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest hidden sm:flex items-center">
                  Best Sellers
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">Most Loved Products</h2>
            </div>
            <Link to="/shop?sort=popular" className="hidden md:flex items-center text-sm font-bold uppercase tracking-widest text-brand-950 hover:text-brand-500 transition-colors group">
              View All <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {trendingProducts.map((product) => (
              <div key={product.id} className="min-w-[280px] w-[280px] sm:min-w-[300px] sm:w-[300px] flex-shrink-0 snap-start">
                <ProductCard product={{...product, isLimitedStock: Math.random() > 0.7 }} />
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center md:hidden">
            <Link to="/shop?sort=popular" className="btn-outline inline-block w-full text-sm font-bold tracking-widest">
              View All Trending
            </Link>
          </div>
        </div>
      </section>

      {/* Seasonal Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px] flex items-center shadow-2xl group"
          >
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2000" 
                alt="Summer Sale" 
                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-950/80 to-transparent mix-blend-multiply" />
            </div>
            
            <div className="relative z-10 w-full md:w-2/3 lg:w-1/2 p-8 md:p-16 text-white">
              <span className="inline-block bg-white text-brand-950 px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full mb-6 shadow-lg">Limited Edition</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">Shop Summer Collection</h2>
              <p className="text-base md:text-lg text-white/90 mb-8 max-w-md font-medium drop-shadow-md">
                Bold colors, breathable fabrics, and elegant silhouettes designed for the ultimate summer escape. Grab them before they're gone.
              </p>
              <Link to="/shop?collection=summer" className="btn-primary bg-white text-brand-950 hover:bg-brand-50 hover:scale-105 transition-all duration-300 inline-flex items-center rounded px-10 py-4 uppercase tracking-widest text-sm font-bold shadow-2xl">
                Explore Summer <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
