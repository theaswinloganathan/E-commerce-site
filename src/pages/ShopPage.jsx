import React, { useState, useEffect } from 'react'
import { useSearchParams, Link, useParams, useNavigate } from 'react-router-dom'
import { SlidersHorizontal, X, Star, Search } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { largeProducts as allProducts } from '../lib/largeProducts'
import { cn } from '../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import FilterSidebar from '../components/shop/FilterSidebar'
import { useCartStore } from '../store/useStore'

export default function ShopPage() {
  const { categorySlug } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  
  // Basic routing state
  const [activeCategory, setActiveCategory] = useState(categorySlug || searchParams.get('category') || 'All')
  const [activeSubcategory, setActiveSubcategory] = useState(searchParams.get('subcategory') || 'All')
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'All')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  
  // Sorting & Pagination
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest')
  const [visibleCount, setVisibleCount] = useState(12)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [quickViewSize, setQuickViewSize] = useState('Default')
  const [isQuickAdded, setIsQuickAdded] = useState(false)
  const ITEMS_PER_PAGE = 12

  const addItem = useCartStore((state) => state.addItem)

  const handleQuickView = (product) => {
    setQuickViewProduct(product)
    setQuickViewSize(product.sizes?.[0] || 'Default')
  }

  // Complex Filter State
  const initialFilters = {
    brands: [],
    colors: [],
    sizes: [],
    priceMax: 50000,
    minRating: 0,
    minDiscount: 0,
  }
  const [activeFilters, setActiveFilters] = useState(initialFilters)
  const [availableFilters, setAvailableFilters] = useState({})

  // Clean and unique array elements
  const cleanOptions = (arr) => [...new Set(arr)].filter(Boolean).sort();

  // Compute available filters dynamically based on current base category/subcategory/type
  useEffect(() => {
    const slug = (categorySlug || activeCategory || 'All').toLowerCase().replace(/-/g, ' ')
    
    let baseProducts = [...allProducts];
    if (slug !== 'all') {
      baseProducts = baseProducts.filter(p => {
        const cat = p?.category?.toLowerCase()?.replace(/-/g, ' ') || '';
        const sub = p?.subcategory?.toLowerCase()?.replace(/-/g, ' ') || '';
        const type = p?.type?.toLowerCase()?.replace(/-/g, ' ') || '';
        const name = p?.name?.toLowerCase()?.replace(/-/g, ' ') || '';
        return cat === slug || sub === slug || type === slug || name.includes(slug);
      });
    }

    if (activeSubcategory !== 'All' && activeSubcategory.toLowerCase() !== slug) {
      const sub = activeSubcategory.toLowerCase().replace(/-/g, ' ');
      baseProducts = baseProducts.filter(p => (p?.subcategory?.toLowerCase()?.replace(/-/g, ' ') === sub));
    }

    if (activeType !== 'All' && activeType.toLowerCase() !== slug) {
      const t = activeType.toLowerCase().replace(/-/g, ' ');
      baseProducts = baseProducts.filter(p => (p?.type?.toLowerCase()?.replace(/-/g, ' ') === t));
    }

    // Extract unique values
    const extract = (key) => cleanOptions(baseProducts.flatMap(p => p[key] ? (Array.isArray(p[key]) ? p[key] : [p[key]]) : []));

    setAvailableFilters({
      brands: extract('brand'),
      colors: cleanOptions([...extract('color'), ...extract('colors')]), 
      sizes: cleanOptions([...extract('size'), ...extract('sizes')]), 
      ratings: [4, 3, 2, 1],
      discounts: [10, 20, 30, 40, 50]
    });
  }, [activeCategory, activeSubcategory, activeType, categorySlug]);

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearAllFilters = () => {
    setActiveFilters(initialFilters);
  };

  const handleCategoryClick = (category) => {
    setActiveSubcategory('All')
    setActiveType('All')
    handleClearAllFilters() // Clear complex filters on category change
    if (category === 'All') {
      navigate('/shop')
    } else {
      navigate(`/category/\${category.toLowerCase().replace(/ /g, '-')}`)
    }
  }

  useEffect(() => {
    setActiveCategory(categorySlug || searchParams.get('category') || 'All')
    setActiveSubcategory(searchParams.get('subcategory') || 'All')
    setActiveType(searchParams.get('type') || 'All')
    setSearchQuery(searchParams.get('search') || '')
  }, [searchParams, categorySlug])

  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true)
      
      try {
        let localResults = [...allProducts]
        const slug = (categorySlug || activeCategory || 'All').toLowerCase().replace(/-/g, ' ')
        
        // Base category filtering - make it more precise
        if (slug !== 'all') {
          localResults = localResults.filter(p => {
            const cat = p?.category?.toLowerCase()?.replace(/-/g, ' ') || '';
            const sub = p?.subcategory?.toLowerCase()?.replace(/-/g, ' ') || '';
            const type = p?.type?.toLowerCase()?.replace(/-/g, ' ') || '';
            const name = p?.name?.toLowerCase()?.replace(/-/g, ' ') || '';
            
            // Check for exact matches in hierarchy first, then name
            return cat === slug || sub === slug || type === slug || name.includes(slug);
          });
        }

        if (activeSubcategory !== 'All' && activeSubcategory.toLowerCase() !== slug) {
          const sub = activeSubcategory.toLowerCase().replace(/-/g, ' ');
          localResults = localResults.filter(p => (p?.subcategory?.toLowerCase()?.replace(/-/g, ' ') === sub));
        }

        if (activeType !== 'All' && activeType.toLowerCase() !== slug) {
          const t = activeType.toLowerCase().replace(/-/g, ' ');
          localResults = localResults.filter(p => (p?.type?.toLowerCase()?.replace(/-/g, ' ') === t));
        }

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          localResults = localResults.filter(p => p?.name?.toLowerCase()?.includes(q));
        }

        // Apply Complex Filters (Price, Rating, Discount)
        // Price: show products within range
        if (activeFilters.priceMax < 50000) {
          localResults = localResults.filter(p => {
            const productPrice = Number(p.discount_price || p.price);
            return productPrice <= activeFilters.priceMax;
          });
        }
        
        // Rating: show products above or equal to selected rating
        if (activeFilters.minRating > 0) {
          localResults = localResults.filter(p => Number(p.rating || 0) >= activeFilters.minRating);
        }
        
        // Discount: show products above or equal to selected discount
        if (activeFilters.minDiscount > 0) {
          localResults = localResults.filter(p => Number(p.discount || 0) >= activeFilters.minDiscount);
        }
        
        // Selection Filters (Brand, Color, Size)
        const checkMatch = (productValue, activeFilterArray) => {
          if (!activeFilterArray || activeFilterArray.length === 0) return true;
          if (!productValue) return false;
          
          const lowerActiveFilters = activeFilterArray.map(f => String(f).toLowerCase().trim());
          
          if (Array.isArray(productValue)) {
            return productValue.some(val => typeof val === 'string' && lowerActiveFilters.includes(val.toLowerCase().trim()));
          }
          
          return typeof productValue === 'string' && lowerActiveFilters.includes(productValue.toLowerCase().trim());
        };

        // Brand logic based explicitly on the requested correct logic example
        localResults = localResults.filter(product => {
          const selectedBrands = activeFilters.brands || [];
          const matchesBrand = 
            selectedBrands.length === 0 ||
            selectedBrands.some(
              brand => product.brand?.toLowerCase().trim() === brand.toLowerCase().trim()
            );
          return matchesBrand;
        });

        localResults = localResults.filter(p => checkMatch(p.color || p.colors, activeFilters.colors));
        localResults = localResults.filter(p => checkMatch(p.size || p.sizes, activeFilters.sizes));

        // Sorting
        switch (sortOption) {
          case 'price-low':
            localResults.sort((a, b) => Number(a.discount_price || a.price) - Number(b.discount_price || b.price));
            break;
          case 'price-high':
            localResults.sort((a, b) => Number(b.discount_price || b.price) - Number(a.discount_price || a.price));
            break;
          case 'popular':
            localResults.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
            break;
          case 'trending':
            localResults.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
          default:
            // newest
            localResults.sort((a, b) => (b.new_arrival ? 1 : 0) - (a.new_arrival ? 1 : 0));
        }

        setFilteredProducts(localResults.slice(0, visibleCount))
        setTotalCount(localResults.length)
      } catch (err) {
        console.error('Error in filtering logic:', err)
      } finally {
        setLoading(false)
      }
    }

    // Debounce to prevent lag when clicking filters quickly
    const timer = setTimeout(() => {
      fetchProducts()
    }, 50);
    return () => clearTimeout(timer);
  }, [activeCategory, activeSubcategory, activeType, searchQuery, activeFilters, sortOption, visibleCount, categorySlug])

  return (
    <div className="pt-24 pb-20">
      {/* Page Header */}
      <div className="bg-brand-50/50 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-100/50 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative">
          <div className="flex items-center space-x-2 text-[10px] font-black text-brand-400 mb-6 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-brand-950 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" onClick={() => handleCategoryClick('All')} className={cn("hover:text-brand-950 transition-colors", activeCategory === 'All' && "text-brand-950")}>Shop</Link>
            {activeCategory !== 'All' && (
              <>
                <span>/</span>
                <button onClick={() => handleCategoryClick(activeCategory)} className={cn("hover:text-brand-950 capitalize", activeSubcategory === 'All' && "text-brand-950")}>{activeCategory}</button>
              </>
            )}
            {activeSubcategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-brand-950 font-bold capitalize">{activeSubcategory.replace(/-/g, ' ')}</span>
              </>
            )}
          </div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-serif font-black mb-6 capitalize tracking-tight"
          >
            {activeType !== 'All' ? activeType.replace(/-/g, ' ') : (activeSubcategory !== 'All' ? activeSubcategory.replace(/-/g, ' ') : (activeCategory !== 'All' ? activeCategory : 'The Collection'))}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-500 max-w-2xl text-lg leading-relaxed font-medium"
          >
            Discover our curated selection of premium {activeCategory.toLowerCase() === 'all' ? 'fashion' : activeCategory.toLowerCase()} pieces, crafted with elegance and timeless style.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex items-center justify-between py-6 px-4 bg-white sticky top-20 z-40 border-b border-brand-50">
          <button 
            className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] bg-brand-950 text-white px-6 py-3 rounded-xl shadow-lg active:scale-95 transition-all"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={14} className="mr-3" />
            Filters
          </button>
          
          <div className="relative">
            <select 
              className="text-[10px] font-black uppercase tracking-[0.2em] border-2 border-brand-100 rounded-xl px-4 py-3 focus:border-brand-950 outline-none bg-white transition-all"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 pr-4 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            

            <FilterSidebar 
              availableFilters={availableFilters}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAllFilters}
            />

          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Active Filters / Desktop Sort */}
          <div className="hidden md:flex flex-col mb-10 pb-6 border-b border-brand-50 gap-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <p className="text-xs font-black text-brand-950 uppercase tracking-widest">Collection</p>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-200" />
                <p className="text-xs font-medium text-brand-400 italic">{totalCount} items found</p>
              </div>
              <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="text-brand-400">Sort by:</span>
                <select 
                  className="text-brand-950 border-b-2 border-transparent hover:border-brand-950 focus:border-brand-950 outline-none cursor-pointer bg-transparent py-1 transition-all"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">New Arrivals</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="trending">Trending Now</option>
                </select>
              </div>
            </div>
            
            {/* Filter Chips */}
            {(activeFilters.brands?.length > 0 || activeFilters.sizes?.length > 0 || activeFilters.priceMax < 50000 || activeFilters.minRating > 0 || activeFilters.minDiscount > 0) && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mr-2">Filters:</span>
                {activeFilters.brands?.map(brand => (
                  <span key={brand} className="flex items-center gap-2 bg-brand-50 text-brand-950 px-4 py-1.5 rounded-full text-[10px] font-bold border border-brand-100 hover:border-brand-300 transition-colors shadow-sm">
                    {brand}
                    <button onClick={() => handleFilterChange('brands', activeFilters.brands.filter(b => b !== brand))} className="hover:text-red-500 transition-colors"><X size={14}/></button>
                  </span>
                ))}
                {activeFilters.sizes?.map(size => (
                  <span key={size} className="flex items-center gap-2 bg-brand-50 text-brand-950 px-4 py-1.5 rounded-full text-[10px] font-bold border border-brand-100 hover:border-brand-300 transition-colors shadow-sm">
                    SIZE {size}
                    <button onClick={() => handleFilterChange('sizes', activeFilters.sizes.filter(s => s !== size))} className="hover:text-red-500 transition-colors"><X size={14}/></button>
                  </span>
                ))}
                {activeFilters.priceMax < 50000 && (
                  <span className="flex items-center gap-2 bg-brand-50 text-brand-950 px-4 py-1.5 rounded-full text-[10px] font-bold border border-brand-100 hover:border-brand-300 transition-colors shadow-sm">
                    UNDER ₹{activeFilters.priceMax.toLocaleString()}
                    <button onClick={() => handleFilterChange('priceMax', 50000)} className="hover:text-red-500 transition-colors"><X size={14}/></button>
                  </span>
                )}
                {activeFilters.minRating > 0 && (
                  <span className="flex items-center gap-2 bg-brand-50 text-brand-950 px-4 py-1.5 rounded-full text-[10px] font-bold border border-brand-100 hover:border-brand-300 transition-colors shadow-sm">
                    {activeFilters.minRating}★ PLUS
                    <button onClick={() => handleFilterChange('minRating', 0)} className="hover:text-red-500 transition-colors"><X size={14}/></button>
                  </span>
                )}
                <button 
                  onClick={handleClearAllFilters}
                  className="text-[10px] font-black text-red-600 hover:text-red-700 underline decoration-red-200 underline-offset-4 tracking-[0.1em] ml-2 uppercase"
                >
                  Reset All
                </button>
              </div>
            )}
          </div>

          {loading && filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-brand-100 border-t-brand-950 rounded-full mb-8" 
              />
              <p className="text-brand-400 font-serif text-2xl italic">Elegance is loading...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 mb-20 transition-opacity duration-300", loading ? "opacity-50" : "opacity-100")}>
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onQuickView={() => handleQuickView(product)}
                  />
                ))}
              </div>
              
              {filteredProducts.length < totalCount && (
                <div className="flex justify-center mt-20">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                    disabled={loading}
                    className="btn-primary px-16 py-5 rounded-2xl disabled:opacity-50 transition-all text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-900/20"
                  >
                    {loading ? 'Discovering...' : 'View More'}
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-40 bg-brand-50/30 rounded-3xl border-2 border-dashed border-brand-100">
              <div className="max-w-md mx-auto px-6">
                <Search size={48} className="mx-auto text-brand-200 mb-6" />
                <h3 className="text-3xl font-serif font-bold text-brand-950 mb-4">No pieces found</h3>
                <p className="text-brand-500 mb-8 leading-relaxed font-medium">We couldn't find any products matching your current filters. Try adjusting your selection or reset all filters.</p>
                <button 
                  onClick={handleClearAllFilters}
                  className="btn-primary inline-flex transition-all px-10"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[360px] bg-white p-6 shadow-xl overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-brand-100">
                <h3 className="font-serif font-bold text-xl">Filters & Categories</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="text-brand-500 hover:text-brand-950 p-2">
                  <X size={24} />
                </button>
              </div>
              

              <FilterSidebar 
                availableFilters={availableFilters}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAllFilters}
              />
              
              <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-brand-100 mt-8">
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full btn-primary py-3"
                >
                  Show Results ({totalCount})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-full md:w-1/2 aspect-[3/4] md:h-[600px]">
                <img 
                  src={quickViewProduct.images[0]} 
                  alt={quickViewProduct.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[600px]">
                <div className="flex items-center space-x-2 text-xs text-brand-500 mb-4 uppercase tracking-widest">
                  <span>{quickViewProduct.category}</span>
                  <span>/</span>
                  <span>{quickViewProduct.subcategory}</span>
                </div>
                <h2 className="text-3xl font-serif font-bold mb-2">{quickViewProduct.name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold text-brand-950">{quickViewProduct.rating || '4.5'}</span>
                  <span className="text-sm text-brand-400">| {quickViewProduct.review_count || Math.floor(Math.random() * 150 + 10)} reviews</span>
                </div>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-2xl font-bold text-brand-950">₹{(quickViewProduct.discount_price || quickViewProduct.price).toLocaleString()}</span>
                  {quickViewProduct.discount_price && (
                    <span className="text-lg text-brand-400 line-through">₹{quickViewProduct.price.toLocaleString()}</span>
                  )}
                </div>
                <p className="text-brand-600 mb-8 leading-relaxed">
                  {quickViewProduct.description}
                </p>
                <div className="mb-8">
                  <h4 className="text-sm font-bold mb-3 uppercase tracking-wider">Select Size</h4>
                  <div className="flex flex-wrap gap-3">
                    {quickViewProduct.sizes?.map(size => (
                      <button 
                        key={size} 
                        onClick={() => setQuickViewSize(size)}
                        className={cn(
                          "w-12 h-12 flex items-center justify-center text-sm font-medium transition-all duration-200 border active:scale-95 hover:scale-105",
                          quickViewSize === size ? "border-brand-950 bg-brand-950 text-white" : "border-brand-200 text-brand-950 hover:border-brand-500"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    addItem(quickViewProduct, quickViewSize, quickViewProduct.color || quickViewProduct.colors?.[0] || 'Default', 1)
                    setIsQuickAdded(true)
                    setTimeout(() => {
                      setIsQuickAdded(false)
                      setQuickViewProduct(null)
                    }, 1000)
                  }}
                  className={cn(
                    "btn-primary w-full py-4 rounded-none uppercase tracking-widest text-sm font-bold transition-all duration-200",
                    isQuickAdded && "bg-green-600 text-white border-green-600 hover:bg-green-700"
                  )}
                >
                  {isQuickAdded ? 'ADDED ✓' : 'Add to Cart'}
                </motion.button>
                <Link 
                  to={`/product/${quickViewProduct.id}`}
                  className="inline-block text-center mt-4 text-sm font-medium text-brand-500 hover:text-brand-950 underline transition-all duration-300 hover:scale-105 active:scale-95"
                  onClick={() => setQuickViewProduct(null)}
                >
                  View Full Details
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
