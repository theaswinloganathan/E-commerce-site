import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, Heart, User, Menu, X, MapPin, ChevronRight } from 'lucide-react'
import { useCartStore, useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'
import { cn } from '../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import LocationModal from './LocationModal'

const menMenuData = [
  {
    sections: [
      { title: 'Clothing', items: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Jeans', 'Shorts', 'Track Pants'], hasViewAll: true },
      { title: 'Winter Wear', items: ['Jackets', 'Sweaters', 'Sweatshirts', 'Coats'], hasViewAll: true },
      { title: 'Sportswear', items: ['Active T-Shirts', 'Active Shorts', 'Tracksuits'], hasViewAll: true },
    ]
  }
]

const womenMenuData = [
  {
    sections: [
      { title: 'Indian & Fusion Wear', items: ['Kurtas', 'Kurtis', 'Sarees', 'Ethnic Wear', 'Palazzos', 'Dupattas'], hasViewAll: true },
      { title: 'Western Wear', items: ['Tops', 'T-shirts', 'Dresses', 'Jumpsuits', 'Skirts', 'Jeans'], hasViewAll: true },
    ]
  }
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const navigate = useNavigate()
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)
  const deliveryLocation = useStore((state) => state.deliveryLocation)
  const cartItems = useCartStore((state) => state.items)
  const wishlist = useStore((state) => state.wishlist)
  const location = useLocation()

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300 flex flex-col',
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white lg:bg-transparent'
        )}
      >
        {/* Delivery Location Header Bar */}
        <div
          className="bg-brand-900 text-white w-full cursor-pointer hover:bg-brand-950 transition-colors border-b border-brand-800"
          onClick={() => setIsLocationModalOpen(true)}
        >
          <div className="container mx-auto px-4 md:px-8 py-2 max-w-7xl flex items-center justify-center sm:justify-start gap-2 text-xs">
            <MapPin size={14} className="text-white/80" />
            <span className="font-medium opacity-90 truncate max-w-[200px] sm:max-w-xs">
              {deliveryLocation ? `Delivering to ${deliveryLocation.city} - ${deliveryLocation.pincode}` : 'Location not set'}
            </span>
            <span className="font-medium opacity-100 underline decoration-brand-600 decoration-2 underline-offset-2 ml-1 hidden sm:inline">
              Select delivery location
            </span>
            <ChevronRight size={14} className="opacity-70 ml-auto sm:ml-0" />
          </div>
        </div>

        <div className={cn("container mx-auto px-4 md:px-8 transition-all duration-300", isScrolled ? "py-4" : "py-6")}>
          <div className="flex items-center justify-between">

            {/* Mobile menu toggle */}
            <button className="lg:hidden text-brand-950" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="relative overflow-hidden rounded-lg">
                <img src="/logo.png" alt="Lakshmi Fashion Logo" className="h-10 sm:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110" onError={(e) => e.target.style.display = 'none'} />
              </div>
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-wider text-brand-950 ml-2 uppercase hidden sm:block">Lakshmi Fashion</span>
              <span className="text-lg font-serif font-bold tracking-wider text-brand-950 ml-2 uppercase sm:hidden">Lakshmi Fashion</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-brand-950 after:transition-all after:duration-300 hover:after:w-full hover:text-brand-950 transition-colors">Home</Link>
              <Link to="/shop" className="text-sm font-medium relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-brand-950 after:transition-all after:duration-300 hover:after:w-full hover:text-brand-950 transition-colors">Shop</Link>
              <div
                className="relative py-2"
                onMouseEnter={() => setActiveMenu('women')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link to="/shop?category=women" className="text-sm font-medium relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-brand-950 after:transition-all after:duration-300 hover:after:w-full hover:text-brand-950 transition-colors">Women</Link>

                <AnimatePresence>
                  {activeMenu === 'women' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[800px] bg-white shadow-2xl rounded-lg overflow-hidden border border-brand-100 flex p-8 z-[100]"
                    >
                      {womenMenuData.map((column, colIdx) => (
                        <div key={colIdx} className={cn("flex-1 space-y-8 px-6", colIdx !== 0 && "border-l border-brand-100")}>
                          {column.sections.map((section, secIdx) => (
                            <div key={secIdx} className="space-y-3">
                              <h3 className="font-bold text-brand-950 text-[15px]">{section.title}</h3>
                              <ul className="space-y-2">
                                {section.items.map((item, itemIdx) => (
                                  <li key={itemIdx}>
                                    <Link to={`/category/${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-brand-600 hover:text-brand-950 transition-colors block">
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                                {section.hasViewAll && (
                                  <li>
                                    <Link to={`/category/${section.title.toLowerCase().replace(/ /g, '-')}`} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center">
                                      View All <span className="ml-1 text-[10px]">{">"}</span>
                                    </Link>
                                  </li>
                                )}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div
                className="relative py-2"
                onMouseEnter={() => setActiveMenu('men')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link to="/shop?category=men" className="text-sm font-medium relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-brand-950 after:transition-all after:duration-300 hover:after:w-full hover:text-brand-950 transition-colors">Men</Link>

                <AnimatePresence>
                  {activeMenu === 'men' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[800px] bg-white shadow-2xl rounded-lg overflow-hidden border border-brand-100 flex p-8 z-[100]"
                    >
                      {menMenuData.map((column, colIdx) => (
                        <div key={colIdx} className={cn("flex-1 space-y-8 px-6", colIdx !== 0 && "border-l border-brand-100")}>
                          {column.sections.map((section, secIdx) => (
                            <div key={secIdx} className="space-y-3">
                              <h3 className="font-bold text-brand-950 text-[15px]">{section.title}</h3>
                              <ul className="space-y-2">
                                {section.items.map((item, itemIdx) => (
                                  <li key={itemIdx}>
                                    <Link to={`/category/${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-brand-600 hover:text-brand-950 transition-colors block">
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                                {section.hasViewAll && (
                                  <li>
                                    <Link to={`/category/${section.title.toLowerCase().replace(/ /g, '-')}`} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center">
                                      View All <span className="ml-1 text-[10px]">{">"}</span>
                                    </Link>
                                  </li>
                                )}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to="/shop?category=accessories" className="text-sm font-medium relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-brand-950 after:transition-all after:duration-300 hover:after:w-full hover:text-brand-950 transition-colors">Accessories</Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-2 sm:space-x-5">
              <div className="relative flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 200, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (searchQuery.trim()) {
                          navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
                          setIsSearchOpen(false)
                        }
                      }}
                      className="absolute right-full mr-2 hidden sm:block"
                    >
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search collection..."
                        className="w-full bg-brand-50 border-2 border-brand-100 rounded-full py-2 px-5 text-sm focus:outline-none focus:border-brand-950 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-brand-950 hover:bg-brand-50 rounded-full transition-all active:scale-90"
                >
                  {isSearchOpen ? <X size={22} /> : <Search size={22} />}
                </button>
              </div>

              {/* Account */}
              {user ? (
                <div className="relative">
                  <button
                    className="w-9 h-9 bg-brand-950 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase hover:bg-brand-800 transition-all active:scale-90 shadow-md"
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  >
                    {user.user_metadata?.full_name ? user.user_metadata.full_name[0] : user.email[0]}
                  </button>

                  <AnimatePresence>
                    {isAccountMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-2xl border border-brand-100 py-3 z-[100] overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-brand-50 mb-1">
                          <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">Account</p>
                          <p className="text-sm font-semibold text-brand-950 truncate">{user.email}</p>
                        </div>
                        <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm text-brand-600 hover:bg-brand-50 hover:text-brand-950 transition-colors" onClick={() => setIsAccountMenuOpen(false)}>My Profile</Link>
                        <Link to="/orders" className="flex items-center px-4 py-2.5 text-sm text-brand-600 hover:bg-brand-50 hover:text-brand-950 transition-colors" onClick={() => setIsAccountMenuOpen(false)}>My Orders</Link>
                        <Link to="/wishlist" className="flex items-center px-4 py-2.5 text-sm text-brand-600 hover:bg-brand-50 hover:text-brand-950 transition-colors sm:hidden" onClick={() => setIsAccountMenuOpen(false)}>Wishlist</Link>
                        <div className="border-t border-brand-50 mt-1 pt-1">
                          <button
                            onClick={async () => {
                              await supabase.auth.signOut();
                              setUser(null);
                              navigate('/');
                              setIsAccountMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold"
                          >
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="p-2 text-brand-950 hover:bg-brand-50 rounded-full transition-all active:scale-90 hidden sm:block">
                  <User size={22} />
                </Link>
              )}

              <Link to="/wishlist" className="p-2 text-brand-950 hover:bg-brand-50 rounded-full transition-all active:scale-90 relative hidden sm:block">
                <Heart size={22} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-brand-950 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              
              <Link to="/cart" className="p-2 text-brand-950 hover:bg-brand-50 rounded-full transition-all active:scale-90 relative">
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-brand-950 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[70] lg:hidden shadow-2xl flex flex-col"
              >
                <div className="p-5 flex items-center justify-between border-b border-brand-50">
                  <div className="flex items-center min-w-0 mr-4">
                    <img src="/logo.png" alt="Lakshmi Fashion Logo" className="h-7 w-auto mr-2 shrink-0" />
                    <span className="text-base font-serif font-bold text-brand-950 uppercase">Lakshmi Fashion</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-brand-50 rounded-full transition-colors shrink-0">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6 px-6 space-y-1">
                  <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.2em] mb-4">Navigation</p>
                  <Link to="/" className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-50 transition-colors font-medium">Home <ChevronRight size={16}/></Link>
                  <Link to="/shop" className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-50 transition-colors font-medium">Shop Collection <ChevronRight size={16}/></Link>
                  <Link to="/shop?category=women" className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-50 transition-colors font-medium">Women <ChevronRight size={16}/></Link>
                  <Link to="/shop?category=men" className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-50 transition-colors font-medium">Men <ChevronRight size={16}/></Link>
                  <Link to="/shop?category=kids" className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-50 transition-colors font-medium">Kids <ChevronRight size={16}/></Link>
                  
                  <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.2em] mt-8 mb-4">Account</p>
                  {user ? (
                    <div className="space-y-1">
                      <div className="flex items-center p-3 space-x-3 mb-4 bg-brand-50 rounded-2xl">
                        <div className="w-10 h-10 bg-brand-950 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-bold text-brand-950">{user.user_metadata?.full_name || 'User'}</p>
                          <p className="text-xs text-brand-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <Link to="/profile" className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-50 transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
                      <Link to="/orders" className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-50 transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
                      <Link to="/wishlist" className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-50 transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Wishlist</Link>
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setUser(null);
                          navigate('/');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left p-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors mt-4"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" className="flex items-center justify-center p-4 bg-brand-950 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-brand-900/20" onClick={() => setIsMobileMenuOpen(false)}>
                      <User size={18} className="mr-2" />
                      Sign In / Register
                    </Link>
                  )}
                </div>
                
                <div className="p-6 border-t border-brand-50 bg-brand-50/50">
                   <p className="text-[10px] text-center text-brand-400 font-medium">© 2026 Lakshmi Fashion. Premium Quality.</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </>
  )
}
