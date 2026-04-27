import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { Loader2, Eye, EyeOff, CheckCircle2, AlertCircle, Mail, Globe, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const setUser = useStore((state) => state.setUser)
  const navigate = useNavigate()

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required'
        break
      case 'email':
        if (!value.trim()) {
          error = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Please enter a valid email'
        }
        break
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required'
        } else if (!/^\+?[0-9]{10,12}$/.test(value.replace(/[\s-]/g, ''))) {
          error = 'Please enter a valid phone number'
        }
        break
      case 'password':
        if (!value) {
          error = 'Password is required'
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters'
        }
        break
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Passwords do not match'
        }
        break
      case 'terms':
        if (!value) error = 'You must accept the terms'
        break
      default:
        break
    }
    return error
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setFormData(prev => ({ ...prev, [name]: val }))
    
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setServerError('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone
          }
        }
      })

      if (error) throw error
      
      setSuccess(true)
      if (data.user && data.session) {
        setUser(data.user)
        setTimeout(() => navigate('/'), 2000)
      }
    } catch (err) {
      setServerError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    // Show "Coming Soon" message for demo purposes if not configured
    alert(`${provider} login coming soon! We are configuring the authentication provider.`)
  }

  const isFormValid = () => {
    return Object.keys(formData).every(key => !validateField(key, formData[key]))
  }

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      {/* Form side */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 relative bg-white order-2 lg:order-1 overflow-y-auto">
        <Link to="/" className="absolute top-8 left-6 md:left-16 lg:left-24 flex items-center group">
          <span className="text-2xl font-serif font-black tracking-tighter text-brand-950 group-hover:scale-105 transition-transform">LAKSHMI FASHION</span>
        </Link>

        <div className="max-w-md w-full mx-auto mt-8">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-serif font-bold mb-3 tracking-tight">Create Your Account</h1>
            <p className="text-brand-500 font-medium">Join Lakshmi Fashion for a premium shopping experience.</p>
          </div>
          
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 px-8 bg-brand-50 rounded-3xl border border-brand-100"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Registration Successful!</h2>
              <p className="text-brand-600 mb-8 leading-relaxed">
                We've sent a verification link to <span className="font-bold text-brand-950">{formData.email}</span>. 
                Please check your inbox to activate your account.
              </p>
              <div className="space-y-4">
                <Link to="/login" className="btn-primary w-full shadow-lg">Proceed to Login</Link>
                <Link to="/" className="text-brand-500 hover:text-brand-950 text-sm font-bold uppercase tracking-widest block py-2 transition-colors">Back to Home</Link>
              </div>
            </motion.div>
          ) : (
            <form className="space-y-5" onSubmit={handleSignup}>
              {serverError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center gap-3 shadow-sm"
                >
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <span>{serverError}</span>
                </motion.div>
              )}

              {/* Full Name */}
              <div className="group">
                <label className="premium-label ml-1">Full Name</label>
                <div className="relative">
                   <input 
                    name="fullName"
                    type="text" 
                    required
                    placeholder="Enter your full name" 
                    className={cn(
                      "input-field focus:ring-4 transition-all duration-300",
                      errors.fullName ? "border-red-200 focus:border-red-500 focus:ring-red-500/10" : "focus:ring-brand-950/5"
                    )}
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={(e) => setErrors(prev => ({ ...prev, fullName: validateField('fullName', e.target.value) }))}
                  />
                  {errors.fullName && <p className="text-[10px] font-bold text-red-500 mt-2 px-1 animate-in fade-in slide-in-from-top-1">{errors.fullName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Email */}
                <div className="group">
                  <label className="premium-label ml-1">Email Address</label>
                  <div className="relative">
                    <input 
                      name="email"
                      type="email" 
                      required
                      placeholder="you@example.com" 
                      className={cn(
                        "input-field focus:ring-4 transition-all duration-300",
                        errors.email ? "border-red-200 focus:border-red-500 focus:ring-red-500/10" : "focus:ring-brand-950/5"
                      )}
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={(e) => setErrors(prev => ({ ...prev, email: validateField('email', e.target.value) }))}
                    />
                    {errors.email && <p className="text-[10px] font-bold text-red-500 mt-2 px-1 animate-in fade-in slide-in-from-top-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="premium-label ml-1">Phone Number</label>
                  <div className="relative">
                    <input 
                      name="phone"
                      type="tel" 
                      required
                      placeholder="+91 0000000000" 
                      className={cn(
                        "input-field focus:ring-4 transition-all duration-300",
                        errors.phone ? "border-red-200 focus:border-red-500 focus:ring-red-500/10" : "focus:ring-brand-950/5"
                      )}
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={(e) => setErrors(prev => ({ ...prev, phone: validateField('phone', e.target.value) }))}
                    />
                    {errors.phone && <p className="text-[10px] font-bold text-red-500 mt-2 px-1 animate-in fade-in slide-in-from-top-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Password */}
                <div className="group">
                  <label className="premium-label ml-1">Password</label>
                  <div className="relative">
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••" 
                      className={cn(
                        "input-field pr-12 focus:ring-4 transition-all duration-300",
                        errors.password ? "border-red-200 focus:border-red-500 focus:ring-red-500/10" : "focus:ring-brand-950/5"
                      )}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={(e) => setErrors(prev => ({ ...prev, password: validateField('password', e.target.value) }))}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-brand-300 hover:text-brand-950 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.password && <p className="text-[10px] font-bold text-red-500 mt-2 px-1 animate-in fade-in slide-in-from-top-1">{errors.password}</p>}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="group">
                  <label className="premium-label ml-1">Confirm Password</label>
                  <div className="relative">
                    <input 
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••" 
                      className={cn(
                        "input-field pr-12 focus:ring-4 transition-all duration-300",
                        errors.confirmPassword ? "border-red-200 focus:border-red-500 focus:ring-red-500/10" : "focus:ring-brand-950/5"
                      )}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={(e) => setErrors(prev => ({ ...prev, confirmPassword: validateField('confirmPassword', e.target.value) }))}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-brand-300 hover:text-brand-950 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 mt-2 px-1 animate-in fade-in slide-in-from-top-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
              

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 mt-8">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="w-5 h-5 accent-brand-950 rounded-lg border-2 border-brand-200 mt-0.5 cursor-pointer"
                  checked={formData.terms}
                  onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                />
                <label htmlFor="terms" className="text-xs text-brand-500 leading-relaxed cursor-pointer select-none">
                  By creating an account, you agree to our <Link to="/terms" className="text-brand-950 font-bold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-950 font-bold hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                disabled={isLoading || !isFormValid()}
                className="btn-primary w-full mt-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] group"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>Create Your Account</>
                )}
              </button>

              <div className="relative my-12">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.3em] font-black"><span className="bg-white px-6 text-brand-300">Or Join With</span></div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button 
                  type="button" 
                  onClick={() => handleSocialLogin('Google')}
                  className="flex items-center justify-center p-5 border-2 border-brand-50 rounded-2xl hover:bg-brand-50 hover:border-brand-200 transition-all active:scale-95 group"
                >
                  <Mail size={20} className="text-brand-400 group-hover:text-brand-950 transition-colors" />
                </button>
                <button 
                  type="button" 
                  onClick={() => handleSocialLogin('Facebook')}
                  className="flex items-center justify-center p-5 border-2 border-brand-50 rounded-2xl hover:bg-brand-50 hover:border-brand-200 transition-all active:scale-95 group"
                >
                  <MessageSquare size={20} className="text-brand-400 group-hover:text-brand-950 transition-colors" />
                </button>
                <button 
                  type="button" 
                  onClick={() => handleSocialLogin('Apple')}
                  className="flex items-center justify-center p-5 border-2 border-brand-50 rounded-2xl hover:bg-brand-50 hover:border-brand-200 transition-all active:scale-95 group"
                >
                  <Globe size={20} className="text-brand-400 group-hover:text-brand-950 transition-colors" />
                </button>
              </div>
            </form>
          )}
          
          {!success && (
            <div className="mt-12 text-center text-sm font-medium text-brand-500">
              Already have an account? <Link to="/login" className="text-brand-950 font-bold hover:underline transition-all ml-1">Sign in here</Link>
            </div>
          )}
        </div>
      </div>

      {/* Visual side */}
      <div className="hidden lg:block w-5/12 relative bg-brand-950 order-1 lg:order-2 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000" 
          alt="Premium Fashion" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/20 to-transparent" />
        <div className="absolute bottom-16 left-12 right-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="inline-block bg-white text-brand-950 px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded mb-4">Elite Collection</span>
            <h2 className="text-5xl font-serif font-bold mb-6 leading-tight">Elevate Your <br /> Wardrobe.</h2>
            <p className="text-white/80 text-lg font-medium leading-relaxed max-w-sm">
              Discover pieces that define you. Join our exclusive circle of fashion enthusiasts and pioneers.
            </p>
          </motion.div>
        </div>
        
        {/* Floating elements for premium look */}
        <div className="absolute top-12 right-12">
           <div className="w-16 h-16 border-2 border-white/10 rounded-full animate-pulse" />
        </div>
        <div className="absolute top-1/4 -right-8 w-24 h-24 border border-white/5 rounded-full" />
      </div>
    </div>
  )
}
