import React from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { formatPrice } from '../lib/utils'

export default function OrderConfirmationPage() {
  const location = useLocation()
  const { state } = location
  
  // Redirect to home if accessed without order data
  if (!state || !state.orderId) {
    return <Navigate to="/" replace />
  }

  const { orderId, total, method } = state

  return (
    <div className="pt-32 pb-24 bg-brand-50 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-sm border border-brand-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-brand-950">Thank You for Your Order!</h1>
          <p className="text-brand-500 mb-8 max-w-md mx-auto">
            Your order has been placed successfully. We've sent a confirmation email with your order details.
          </p>

          <div className="bg-brand-50 p-6 rounded-sm mb-8 text-left grid grid-cols-1 md:grid-cols-3 gap-6 border border-brand-100">
            <div>
              <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1">Order Number</p>
              <p className="font-medium text-brand-950">{orderId}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1">Payment Method</p>
              <p className="font-medium text-brand-950 capitalize">{method === 'cod' ? 'Cash on Delivery' : method}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1">Total Amount</p>
              <p className="font-bold text-brand-950">{formatPrice(total)}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="btn-primary w-full sm:w-auto flex justify-center items-center">
              Continue Shopping <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/" className="btn-outline w-full sm:w-auto flex justify-center items-center">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
