import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCartStore, useStore } from '../store/useStore'
import { formatPrice, cn } from '../lib/utils'
import { Shield, ChevronLeft, CreditCard, Banknote, Phone, Truck, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const user = useStore((state) => state.user)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })
  
  const [paymentMethod, setPaymentMethod] = useState('card') // card, upi, upi_qr, cod
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment

  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.price || 0
    return acc + price * item.quantity
  }, 0)
  
  const deliveryFee = 150.00
  const isFreeDelivery = subtotal >= 2500
  const total = subtotal + (subtotal > 0 && !isFreeDelivery ? deliveryFee : 0)

  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      navigate('/cart')
    }
  }, [items.length, navigate, isProcessing])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateShipping = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode']
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        setError(`Please enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }
    if (formData.phone.length < 10) {
      setError("Please enter a valid phone number")
      return false
    }
    setError('')
    return true
  }

  const handlePlaceOrder = async (paymentId = null, paymentStatus = 'Pending') => {
    try {
      const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`
      
      const newOrder = {
        id: orderId,
        total: total,
        status: 'Processing',
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        razorpay_payment_id: paymentId,
        customer_details: formData,
        user_id: user?.id || null,
        date: new Date().toISOString(),
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}`,
        items: items
          .filter(item => item && item.product)
          .map(item => ({
            id: item.product.id,
            name: item.product.name,
            qty: item.quantity,
            price: item.product.price,
            image: item.product.images?.[0] || ''
          })),
        trackingSteps: ['Order Placed', paymentStatus === 'Paid' ? 'Payment Successful' : 'Awaiting Payment']
      }

      const result = await useStore.getState().placeOrder(newOrder)
      
      if (result.success) {
        clearCart()
        navigate('/order-confirmation', { 
          state: { orderId, total, method: paymentMethod } 
        })
      } else {
        throw new Error(result.error || "Failed to save order to database")
      }
    } catch (err) {
      console.error("Order placement error:", err)
      setError(`Failed to save order: ${err.message}. Please contact support.`)
      setIsProcessing(false)
    }
  }

  const handlePayment = async (e) => {
    if (e) e.preventDefault()
    if (!validateShipping()) return
    setIsProcessing(true)

    if (!user) {
      setError("Please sign in to place your order.")
      setIsProcessing(false)
      // Redirect to login after a short delay
      setTimeout(() => navigate('/login', { state: { from: '/checkout' } }), 1500)
      return
    }

    if (paymentMethod === 'cod') {
      await handlePlaceOrder(null, 'Pending')
      return
    }

    // Razorpay Integration
    try {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) throw new Error("Razorpay Key ID is missing");

      // 1. Create order on backend
      const response = await fetch('http://localhost:5000/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, currency: 'INR' }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      const order = data.order;
      
      // 2. Open Razorpay Popup
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "DA Fassion",
        description: "Premium Fashion Order",
        order_id: order.id,
        handler: async function (res) {
          try {
            // 3. Verify payment on backend
            const verifyRes = await fetch('http://localhost:5000/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature
              }),
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              await handlePlaceOrder(res.razorpay_payment_id, 'Paid');
            } else {
              setError("Payment verification failed. Please contact support.");
              setIsProcessing(false);
            }
          } catch (err) {
            setError("Payment verification error.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
          method: paymentMethod === 'upi_qr' ? 'upi' : (paymentMethod === 'upi' ? 'upi' : (paymentMethod === 'card' ? 'card' : '')),
        },
        theme: { color: "#0f0d0c" },
        modal: { 
          ondismiss: () => setIsProcessing(false) 
        }
      };

      // If UPI QR is selected, we hint to Razorpay to show QR flow
      if (paymentMethod === 'upi_qr') {
        options.config = {
          display: {
            preferences: {
              show_default_blocks: true,
            }
          }
        };
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || "Failed to initialize payment.");
      setIsProcessing(false);
    }
  }

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-4 text-center min-h-screen flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6">
          <Truck size={32} className="text-brand-400" />
        </div>
        <h2 className="text-3xl font-serif font-black mb-4 text-brand-950">Your Bag is Empty</h2>
        <p className="text-brand-500 mb-8 max-w-md mx-auto">Add some premium pieces to your bag before proceeding to checkout.</p>
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-24 bg-brand-50/30 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
          {/* Left Column: Form Steps */}
          <div className="flex-1">
            <div className="mb-12">
               <Link to="/cart" className="inline-flex items-center text-[10px] font-black text-brand-400 hover:text-brand-950 uppercase tracking-[0.2em] mb-8 transition-colors">
                <ChevronLeft size={14} className="mr-2" /> Return to Bag
              </Link>
              <h1 className="text-4xl md:text-6xl font-serif font-black text-brand-950 tracking-tight mb-8">Checkout</h1>
              
              {/* Step Indicator */}
              <div className="flex items-center gap-4 mb-12">
                <button 
                  onClick={() => setStep(1)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-2xl transition-all",
                    step === 1 ? "bg-brand-950 text-white shadow-xl" : "bg-white text-brand-400 border border-brand-100"
                  )}
                >
                  <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black", step === 1 ? "bg-white text-brand-950" : "bg-brand-50 text-brand-400")}>1</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Shipping</span>
                </button>
                <div className="w-12 h-0.5 bg-brand-100" />
                <button 
                  onClick={() => step > 1 && setStep(2)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-2xl transition-all",
                    step === 2 ? "bg-brand-950 text-white shadow-xl" : "bg-white text-brand-400 border border-brand-100"
                  )}
                  disabled={step < 2}
                >
                  <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black", step === 2 ? "bg-white text-brand-950" : "bg-brand-50 text-brand-400")}>2</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Payment</span>
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-6 rounded-2xl mb-8 text-xs font-bold border-2 border-red-100 flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">!</div>
                {error}
              </motion.div>
            )}

            <div className="space-y-12">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-brand-900/5 border border-brand-50"
                  >
                    <h2 className="text-2xl font-serif font-black mb-10 text-brand-950">Shipping Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-2">
                        <label className="premium-label ml-1">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="input-field" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <label className="premium-label ml-1">Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="input-field" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-2">
                        <label className="premium-label ml-1">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field" placeholder="john@example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="premium-label ml-1">Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field" placeholder="+91 00000 00000" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-8">
                      <label className="premium-label ml-1">Full Address</label>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="input-field" placeholder="Street, Building, Apartment" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="premium-label ml-1">City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="input-field" />
                      </div>
                      <div className="space-y-2">
                        <label className="premium-label ml-1">State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="input-field" />
                      </div>
                      <div className="space-y-2">
                        <label className="premium-label ml-1">Pincode</label>
                        <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="input-field" />
                      </div>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      onClick={() => validateShipping() && setStep(2)}
                      className="btn-primary w-full mt-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl"
                    >
                      Continue to Payment
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-brand-900/5 border border-brand-50"
                  >
                    <h2 className="text-2xl font-serif font-black mb-10 text-brand-950">Payment Method</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[
                        { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard />, desc: 'Visa, Mastercard, RuPay' },
                        { id: 'upi', name: 'UPI Apps', icon: <Phone />, desc: 'Google Pay, PhonePe, Paytm' },
                        { id: 'upi_qr', name: 'UPI QR Code', icon: <Phone />, desc: 'Scan and Pay Instantly' },
                        { id: 'cod', name: 'Cash on Delivery', icon: <Banknote />, desc: 'Pay when you receive' },
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={cn(
                            "flex items-center gap-4 p-6 rounded-3xl border-2 transition-all text-left group",
                            paymentMethod === method.id 
                              ? "border-brand-950 bg-brand-50/50 shadow-lg shadow-brand-900/5" 
                              : "border-brand-50 hover:border-brand-200"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                            paymentMethod === method.id ? "bg-brand-950 text-white" : "bg-brand-50 text-brand-400 group-hover:text-brand-950"
                          )}>
                            {method.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-black uppercase tracking-widest text-brand-950">{method.name}</p>
                            <p className="text-[10px] font-medium text-brand-400 mt-1 uppercase tracking-tighter">{method.desc}</p>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            paymentMethod === method.id ? "border-brand-950 bg-brand-950" : "border-brand-100"
                          )}>
                            {paymentMethod === method.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-12 p-8 bg-brand-50/50 rounded-3xl border border-brand-100">
                      <div className="flex items-start gap-4">
                         <Shield className="text-brand-950" size={24} />
                         <div>
                           <p className="text-xs font-black text-brand-950 uppercase tracking-widest mb-1">Secure Transaction</p>
                           <p className="text-[11px] text-brand-500 font-medium leading-relaxed uppercase tracking-tighter">Your payment is processed through Razorpay's secure PCI-DSS compliant server. We never store your card details.</p>
                         </div>
                      </div>
                    </div>

                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="btn-primary w-full mt-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isProcessing ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                      ) : null}
                      {isProcessing ? 'Connecting...' : paymentMethod === 'cod' ? 'Confirm Order' : 'Pay & Finalize'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[420px] flex-shrink-0">
            <div className="bg-white border-2 border-brand-50 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-brand-900/5 sticky top-32">
              <h2 className="text-3xl font-serif font-black mb-10 text-brand-950 tracking-tight">Your Order</h2>
              
              <div className="max-h-[40vh] overflow-y-auto mb-10 pr-4 custom-scrollbar space-y-6">
                {items.filter(item => item && item.product).map(item => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-20 aspect-[3/4] bg-brand-50 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-brand-50 transition-transform group-hover:scale-105">
                      <img src={item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col py-1">
                      <p className="premium-label mb-1">{item.product.brand || 'DA FASSION'}</p>
                      <p className="font-serif font-black text-brand-950 line-clamp-1 leading-tight mb-2 uppercase tracking-tighter">{item.product.name}</p>
                      <div className="flex justify-between items-end mt-auto">
                        <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest bg-brand-50 px-2 py-1 rounded">Qty: {item.quantity}</span>
                        <p className="font-black text-brand-950 tracking-tight">{formatPrice((item.product.price || 0) * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 mb-10 border-t-2 border-brand-50 pt-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-brand-400 uppercase tracking-widest">Subtotal</span>
                  <span className="font-black text-brand-950">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-400 uppercase tracking-widest">Shipping</span>
                    {isFreeDelivery && <span className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Complimentary</span>}
                  </div>
                  <span className={cn("font-black text-brand-950", isFreeDelivery && "text-green-600")}>
                    {isFreeDelivery ? '₹0' : formatPrice(deliveryFee)}
                  </span>
                </div>
              </div>
              
              <div className="pt-8 border-t-2 border-brand-950 mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-black text-brand-950 text-xl uppercase tracking-tighter">Total Amount</span>
                  <span className="font-black text-4xl text-brand-950 tracking-tighter">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-brand-400 text-right uppercase tracking-[0.2em]">Secure Checkout Guaranteed</p>
              </div>

              <div className="bg-brand-50/50 p-6 rounded-3xl border border-brand-100 flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-1">Estimated Arrival</span>
                    <span className="text-xs font-black text-brand-950 uppercase tracking-tight">3 - 5 Business Days</span>
                 </div>
                 <Truck size={24} className="text-brand-950" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
