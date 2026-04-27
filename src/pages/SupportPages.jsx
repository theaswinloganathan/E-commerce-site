import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone } from 'lucide-react'
import { cn } from '../lib/utils'

const PageContainer = ({ title, children, subtitle }) => (
  <div className="min-h-screen pt-40 pb-24 bg-white">
    <div className="container mx-auto px-4 md:px-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16"
      >
        <div className="text-center space-y-4 mb-20">
          <p className="text-[10px] font-black text-brand-400 uppercase tracking-[0.4em]">Atelier Support</p>
          <h1 className="text-4xl md:text-7xl font-serif font-black text-brand-950 uppercase tracking-tight">{title}</h1>
          {subtitle && <p className="text-brand-500 font-medium text-lg max-w-2xl mx-auto">{subtitle}</p>}
          <div className="w-24 h-1 bg-brand-950 mx-auto mt-10 rounded-full" />
        </div>
        <div className="prose prose-brand max-w-none text-brand-600 leading-relaxed">
          {children}
        </div>
      </motion.div>
    </div>
  </div>
)

export const ContactPage = () => (
  <PageContainer 
    title="Get In Touch" 
    subtitle="We are here to ensure your experience with Lakshmi Fashion is as seamless as our fabrics."
  >
    <div className="grid md:grid-cols-2 gap-20 items-start">
      <div className="space-y-12">
        <div className="space-y-8">
          {[
            { label: 'Corporate Office', value: '123 Fashion Street, Bandra West, Mumbai 400050', icon: <MapPin size={20} /> },
            { label: 'Electronic Mail', value: 'concierge@lakshmifashion.com', icon: <Mail size={20} /> },
            { label: 'Client Support', value: '+91 98765 43210', icon: <Phone size={20} /> }
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start group">
               <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-950 shadow-xl shadow-brand-900/5 transition-all group-hover:scale-110">
                  {item.icon}
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-brand-300 uppercase tracking-widest mb-1">{item.label}</h4>
                  <p className="text-brand-950 font-bold uppercase tracking-tighter">{item.value}</p>
               </div>
            </div>
          ))}
        </div>
        
        <div className="p-10 bg-brand-950 rounded-[2.5rem] text-white shadow-2xl shadow-brand-900/20">
           <h4 className="text-xl font-serif font-black mb-4 uppercase tracking-tight">Atelier Hours</h4>
           <div className="space-y-2 text-[10px] font-black uppercase tracking-widest text-white/60">
              <p>Monday — Friday: 09:00 - 20:00</p>
              <p>Saturday: 10:00 - 18:00</p>
              <p>Sunday: Reserved for Inspiration</p>
           </div>
        </div>
      </div>

      <form className="space-y-6 bg-brand-50/50 p-10 md:p-12 rounded-[3rem] border border-brand-50" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
        <div className="space-y-2">
           <label className="text-[9px] font-black text-brand-400 uppercase tracking-widest ml-4">Full Identity</label>
           <input type="text" placeholder="John Doe" className="input-field" required />
        </div>
        <div className="space-y-2">
           <label className="text-[9px] font-black text-brand-400 uppercase tracking-widest ml-4">Contact Email</label>
           <input type="email" placeholder="john@example.com" className="input-field" required />
        </div>
        <div className="space-y-2">
           <label className="text-[9px] font-black text-brand-400 uppercase tracking-widest ml-4">Your Inquiry</label>
           <textarea placeholder="How can we assist you today?" rows="5" className="input-field py-5 resize-none" required></textarea>
        </div>
        <button type="submit" className="btn-primary w-full shadow-2xl shadow-brand-900/10 active:scale-95">Send Inquiry</button>
      </form>
    </div>
  </PageContainer>
)

export const FAQPage = () => (
  <PageContainer 
    title="Common Inquiries"
    subtitle="Find immediate answers to frequently asked questions regarding our artisan collections."
  >
    <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
      {[
        { q: "What is your return protocol?", a: "We offer a 14-day return policy for all unworn items in their original, pristine packaging with all tags attached." },
        { q: "Do you ship internationally?", a: "Currently, our logistics focus on delivering excellence within India. Global expansion is on our horizon." },
        { q: "How can I monitor my shipment?", a: "Once dispatched, a unique tracking identifier will be shared via your registered contact channels." },
        { q: "What transaction methods are supported?", a: "We secure all payments through Razorpay, accepting major Cards, UPI, and elite Net Banking services." }
      ].map((item, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-brand-50/30 p-10 rounded-[2.5rem] border border-brand-50 hover:bg-brand-50 transition-all duration-500 group"
        >
          <h4 className="text-xl font-serif font-black text-brand-950 mb-4 uppercase tracking-tight group-hover:translate-x-2 transition-transform">{item.q}</h4>
          <p className="text-brand-500 font-medium leading-relaxed">{item.a}</p>
        </motion.div>
      ))}
    </div>
  </PageContainer>
)

export const ShippingPage = () => (
  <PageContainer 
    title="Logistics & Returns"
    subtitle="Detailed information regarding our commitment to timely and secure delivery of your orders."
  >
    <div className="grid md:grid-cols-2 gap-16">
      <section className="space-y-8 bg-brand-50/30 p-12 rounded-[3rem] border border-brand-50">
        <h3 className="text-2xl font-serif font-black text-brand-950 uppercase tracking-tight">Shipping Protocol</h3>
        <p className="text-brand-500 font-medium">Orders are meticulously prepared within 24-48 hours. Our logistics partners ensure delivery within 3-5 business days across major cities.</p>
        <ul className="space-y-4">
          <li className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-brand-950" />
             <span className="text-[10px] font-black text-brand-950 uppercase tracking-widest">Complimentary shipping over ₹2,500</span>
          </li>
          <li className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-brand-950" />
             <span className="text-[10px] font-black text-brand-950 uppercase tracking-widest">Standard fee of ₹99 for smaller orders</span>
          </li>
        </ul>
      </section>
      <section className="space-y-8 bg-brand-950 p-12 rounded-[3rem] text-white shadow-2xl shadow-brand-900/20">
        <h3 className="text-2xl font-serif font-black uppercase tracking-tight">Returns & Exchanges</h3>
        <p className="text-white/60 font-medium">We aim for perfection. However, if a piece does not meet your expectations, we offer a seamless return process.</p>
        <div className="p-6 bg-white/10 rounded-2xl border border-white/10">
           <p className="text-[10px] font-black uppercase tracking-widest text-white">Items must be returned within 14 days, unworn, and with all original artisan tags intact.</p>
        </div>
      </section>
    </div>
  </PageContainer>
)

export const SizeGuidePage = () => (
  <PageContainer 
    title="Size Guide"
    subtitle="Ensure the perfect silhouette with our comprehensive sizing chart for Lakshmi Fashion collections."
  >
    <div className="bg-white rounded-[3rem] overflow-hidden border-2 border-brand-50 shadow-2xl shadow-brand-900/5">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-brand-950 text-white">
            <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em]">Signature Size</th>
            <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em]">Chest (in)</th>
            <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em]">Waist (in)</th>
            <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em]">Hips (in)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-50">
          {[
            ["Extra Small", "32", "26", "35"],
            ["Small", "34", "28", "37"],
            ["Medium", "36", "30", "39"],
            ["Large", "38", "32", "41"],
            ["Extra Large", "40", "34", "43"]
          ].map((row, i) => (
            <tr key={i} className="hover:bg-brand-50/50 transition-colors">
              <td className="p-8 font-serif font-black text-brand-950 uppercase">{row[0]}</td>
              {row.slice(1).map((cell, j) => (
                <td key={j} className="p-8 font-black text-brand-500 text-sm">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </PageContainer>
)

export const PrivacyPage = () => (
  <PageContainer title="Privacy Policy">
    <p>At Lakshmi Fashion, we value your privacy. This policy explains how we collect, use, and protect your personal information.</p>
    <div className="mt-8 space-y-6">
      <h4 className="font-bold text-brand-950">Information Collection</h4>
      <p>We collect information when you register on our site, place an order, or subscribe to our newsletter.</p>
      <h4 className="font-bold text-brand-950">Data Security</h4>
      <p>We implement a variety of security measures to maintain the safety of your personal information.</p>
    </div>
  </PageContainer>
)

export const TermsPage = () => (
  <PageContainer title="Terms of Service">
    <p>By using our website, you agree to comply with the following terms and conditions.</p>
    <div className="mt-8 space-y-6">
      <h4 className="font-bold text-brand-950">Intellectual Property</h4>
      <p>All content on this site is the property of Lakshmi Fashion.</p>
      <h4 className="font-bold text-brand-950">Limitation of Liability</h4>
      <p>Lakshmi Fashion shall not be liable for any damages that result from the use of our products.</p>
    </div>
  </PageContainer>
)
