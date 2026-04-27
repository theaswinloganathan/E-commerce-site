import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import EditProfile from './pages/EditProfile'
import ChangePassword from './pages/ChangePassword'
import Address from './pages/Address'
import Notifications from './pages/Notifications'
import AdminDashboard from './pages/AdminDashboard'
import { ContactPage, FAQPage, ShippingPage, SizeGuidePage, PrivacyPage, TermsPage } from './pages/SupportPages'
import { supabase } from './lib/supabase'
import { useStore } from './store/useStore'

function App() {
  const setUser = useStore(state => state.setUser)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setInitialized(true)
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setInitialized(true)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-950 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-brand-950 font-serif font-medium tracking-widest animate-pulse uppercase text-xs">DA Fassion</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="category/:categorySlug" element={<ShopPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="address" element={<Address />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="shipping" element={<ShippingPage />} />
          <Route path="size-guide" element={<SizeGuidePage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </>
  )
}

export default App
