import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { Loader2, Info, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const setUser = useStore((state) => state.setUser)
  const navigate = useNavigate()
  const location = useLocation()
  const signupSuccess = location.state?.signupSuccess

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      setUser(data.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-stretch">
      {/* Visual side */}
      <div className="hidden lg:block w-1/2 relative bg-brand-100">
        <img 
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1500" 
          alt="Fashion" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-950/20 mix-blend-multiply" />
        <div className="absolute bottom-16 left-16 right-16 text-white text-center">
          <h2 className="font-serif text-4xl mb-4 font-bold">Premium Style.</h2>
          <p className="text-white/90">Sign in to access your wishlist, order history, and exclusive member benefits.</p>
        </div>
      </div>
      
      {/* Form side */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-20 py-12 relative bg-white">
        <Link to="/" className="absolute top-12 left-8 md:left-20 text-xl font-serif font-bold tracking-wider text-brand-950">
          LAKSHMI FASHION
        </Link>
        <div className="max-w-sm w-full mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-2">Welcome Back</h1>
          <p className="text-brand-500 mb-6 text-sm">Please sign in to your account.</p>

          <AnimatePresence>
            {signupSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6 flex items-start gap-3"
              >
                <CheckCircle2 size={18} className="text-green-600 mt-0.5 shrink-0" />
                <p className="text-[11px] leading-relaxed text-green-700 font-medium">
                  Account created successfully! Please verify your email before signing in.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-md mb-4">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Email</label>
              <input 
                type="email" 
                required
                placeholder="you@example.com" 
                className="input-field" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-brand-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-500 hover:text-brand-950">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                className="input-field" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex items-center mb-6">
              <input type="checkbox" id="remember" className="w-4 h-4 accent-brand-950 rounded-sm" />
              <label htmlFor="remember" className="ml-2 text-sm text-brand-600">Remember me</label>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="bg-brand-50/50 p-4 rounded-xl border border-brand-100 mt-10 mb-6 flex items-start gap-3">
            <Info size={18} className="text-brand-400 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-relaxed text-brand-600">
              If you are new, please <Link to="/signup" className="text-brand-950 font-bold hover:underline hover:text-brand-800 transition-all">create an account</Link> first. 
              After signing up, verify your email, then sign in to continue.
            </p>
          </div>
          
          <div className="text-center text-sm text-brand-500">
            Don't have an account? <Link to="/signup" className="text-brand-950 font-bold hover:text-brand-700 transition-all hover:underline underline-offset-4 ml-1">Sign up here</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
