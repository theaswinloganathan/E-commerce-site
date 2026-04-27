import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ChevronRight, User, Mail, Phone, MapPin, Settings, Heart, ShoppingBag, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const Profile = () => {
  const user = useStore(state => state.user);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (!user) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-4 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 bg-brand-50 rounded-full flex items-center justify-center mb-8 shadow-inner"
        >
          <User size={48} className="text-brand-200" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-serif font-black mb-6 text-brand-950 tracking-tight">Personal Atelier</h1>
        <p className="text-brand-500 mb-10 max-w-md text-lg leading-relaxed font-medium">Please sign in to access your curated profile, orders, and exclusive benefits.</p>
        <button 
          onClick={() => handleNavigate('/login')}
          className="btn-primary px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-900/20 active:scale-95 transition-all"
        >
          Login / Sign Up
        </button>
      </div>
    );
  }

  const fullName = user.user_metadata?.full_name || 'Valued Client';
  const email = user.email || '';
  const phone = user.user_metadata?.phone || 'Not provided';
  const address = user.user_metadata?.address || null;

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex items-center gap-2 text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mb-12">
            <Link to="/" className="hover:text-brand-950 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-brand-950">Profile</span>
        </div>

        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-20 group"
        >
          <div className="h-64 rounded-[3rem] overflow-hidden relative shadow-2xl shadow-brand-900/5 border border-brand-50">
            <div className="absolute inset-0 bg-brand-950" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900/50 to-transparent" />
          </div>
          
          <div className="px-8 md:px-16 -mt-24 flex flex-col md:flex-row items-center md:items-end gap-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-48 h-48 rounded-[2.5rem] bg-white p-2 shadow-2xl shadow-brand-900/10 relative z-10"
            >
              <div className="w-full h-full rounded-[2rem] bg-brand-50 flex items-center justify-center text-brand-950 text-6xl font-serif font-black uppercase">
                {fullName[0]}
              </div>
            </motion.div>
            
            <div className="flex-1 text-center md:text-left pb-4">
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-3">Member Profile</p>
              <h1 className="text-4xl md:text-6xl font-serif font-black text-brand-950 md:text-white tracking-tight mb-4 uppercase">{fullName}</h1>
              <p className="text-brand-400 flex items-center justify-center md:justify-start font-bold uppercase tracking-widest text-[10px]">
                <Mail size={14} className="mr-3" /> {email}
              </p>
            </div>
            
            <div className="pb-4">
              <motion.button 
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate('/profile/edit')}
                className="px-10 py-5 bg-white text-brand-950 border border-brand-100 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand-50 transition-all shadow-xl shadow-brand-900/5"
              >
                Edit Details
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            {/* Personal Info */}
            <section className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-brand-50 shadow-2xl shadow-brand-900/5">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-serif font-black text-brand-950 uppercase tracking-tight">Identity Details</h2>
                <div className="h-1 flex-1 mx-8 bg-brand-50 rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">Full Name</p>
                  <p className="text-lg font-black text-brand-950 tracking-tight uppercase">{fullName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">Contact Email</p>
                  <p className="text-lg font-black text-brand-950 tracking-tight">{email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">Phone Identity</p>
                  <p className="text-lg font-black text-brand-950 tracking-tight">{phone}</p>
                </div>
              </div>
            </section>

            {/* Address */}
            <section className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-brand-50 shadow-2xl shadow-brand-900/5">
               <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-serif font-black text-brand-950 uppercase tracking-tight">Primary Residence</h2>
                <button onClick={() => handleNavigate('/address')} className="text-[10px] font-black text-brand-950 uppercase tracking-widest hover:underline underline-offset-8 decoration-brand-200 transition-all">{address ? 'Modify' : 'Initialize'}</button>
              </div>
              <div className="flex items-start gap-8 p-8 bg-brand-50/50 rounded-[2rem] border border-brand-100">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-950 shadow-xl shadow-brand-900/5 flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  {address ? (
                    <p className="text-lg font-bold text-brand-600 leading-relaxed italic pr-12">"{address}"</p>
                  ) : (
                    <p className="text-brand-400 font-bold uppercase tracking-widest text-[10px] mt-4">No residency established yet.</p>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-12">
            {/* Account Management */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-brand-50 shadow-2xl shadow-brand-900/5">
              <h2 className="text-xl font-serif font-black text-brand-950 mb-10 uppercase tracking-tight">Atelier Settings</h2>
              <div className="space-y-4">
                {[
                  { id: 'pass', name: 'Security & Access', path: '/change-password', icon: <Shield size={18} />, color: 'bg-amber-50 text-amber-600' },
                  { id: 'notif', name: 'Preferences', path: '/notifications', icon: <Settings size={18} />, color: 'bg-blue-50 text-blue-600' },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => handleNavigate(item.path)}
                    className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-brand-50/50 transition-all border-2 border-transparent hover:border-brand-100 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", item.color)}>
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-black text-brand-950 uppercase tracking-widest">{item.name}</span>
                    </div>
                    <ChevronRight size={18} className="text-brand-200 group-hover:text-brand-950 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </section>

            {/* Quick Activity */}
            <section className="bg-brand-950 p-10 rounded-[2.5rem] shadow-2xl shadow-brand-900/20 text-white">
              <h2 className="text-xl font-serif font-black mb-10 uppercase tracking-tight text-white/90">Quick Access</h2>
              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => handleNavigate('/wishlist')}
                  className="p-6 bg-white/10 rounded-3xl text-center group hover:bg-white/20 transition-all border border-white/10"
                >
                  <Heart size={24} className="mx-auto mb-3 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Wishlist</span>
                </button>
                <button 
                  onClick={() => handleNavigate('/orders')}
                  className="p-6 bg-white/10 rounded-3xl text-center group hover:bg-white/20 transition-all border border-white/10"
                >
                  <ShoppingBag size={24} className="mx-auto mb-3 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Orders</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

