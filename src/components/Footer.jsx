import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-brand-950 text-white pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold tracking-wider">Lakshmi Fashion</h3>
            <p className="text-brand-400 text-sm leading-relaxed max-w-xs">
              Premium Style for Every Occasion. Discover elegant styles, trending looks, and timeless outfits.
            </p>
            <div className="flex items-center space-x-6 text-brand-400 font-serif text-sm">
              <a href="#" aria-label="Lakshmi Fashion on Instagram" className="hover:text-white transition-colors duration-300 transform hover:scale-110">
                IG
              </a>
              <a href="#" aria-label="Lakshmi Fashion on Facebook" className="hover:text-white transition-colors duration-300 transform hover:scale-110">
                FB
              </a>
              <a href="#" aria-label="Lakshmi Fashion on Twitter" className="hover:text-white transition-colors duration-300 transform hover:scale-110">
                TW
              </a>
              <a href="#" aria-label="Lakshmi Fashion on Youtube" className="hover:text-white transition-colors duration-300 transform hover:scale-110">
                YT
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-6 tracking-wide">Shop</h4>
            <ul className="space-y-4 text-brand-400 text-sm">
              <li><Link to="/shop?category=new" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">New Arrivals</Link></li>
              <li><Link to="/shop?category=women" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Women's Fashion</Link></li>
              <li><Link to="/shop?category=men" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Men's Fashion</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-6 tracking-wide">Support</h4>
            <ul className="space-y-4 text-brand-400 text-sm">
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">FAQ</Link></li>
              <li><Link to="/size-guide" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-6 tracking-wide">Newsletter</h4>
            <p className="text-brand-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            {subscribed ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-900/50 border border-brand-800 p-4 rounded-md text-sm text-brand-200"
              >
                Thank you for subscribing!
              </motion.div>
            ) : (
              <form className="flex" onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address..." 
                  className="bg-brand-900 border border-brand-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:border-brand-600 text-sm"
                  required
                />
                <button 
                  type="submit"
                  className="bg-white text-brand-950 px-4 py-2 rounded-r-md text-sm font-medium hover:bg-brand-200 transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div className="border-t border-brand-800 pt-8 flex flex-col md:flex-row items-center justify-between text-brand-500 text-sm flex-wrap gap-4">
          <p>© {new Date().getFullYear()} Lakshmi Fashion. All rights reserved.</p>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center space-x-3 text-brand-400 opacity-80 mr-0 md:mr-8">
              <CreditCard size={24} />
              <div className="flex gap-2 items-center">
                <span className="font-serif italic font-bold text-lg leading-none">Visa</span>
                <span className="bg-white text-brand-950 px-1.5 py-0.5 text-[10px] font-bold rounded-sm leading-none">UPI</span>
                <span className="font-sans font-bold text-blue-400 text-sm tracking-tighter leading-none">Razorpay</span>
              </div>
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
