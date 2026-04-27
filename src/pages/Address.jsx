import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, MapPin, Navigation } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Address = () => {
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);
  const navigate = useNavigate();
  const addressRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Use Nominatim (OpenStreetMap) for free reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en'
              }
            }
          );
          const data = await response.json();
          if (data && data.display_name) {
            if (addressRef.current) {
              addressRef.current.value = data.display_name;
            }
          } else {
            setError('Could not determine address from your location.');
          }
        } catch (err) {
          setError('Failed to fetch address. Please try manual entry.');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setError(err.message || 'Permission denied. Please enable location services.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const address = addressRef.current?.value;

    if (!address) {
      setError('Please enter or fetch an address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: { address: address }
      });

      if (updateError) throw updateError;

      if (data?.user) {
        setUser(data.user);
        setSuccess(true);
        setTimeout(() => navigate('/profile'), 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-24">
      <button 
        onClick={() => navigate('/profile')}
        className="inline-flex items-center text-sm text-gray-500 hover:text-brand-950 mb-6 transition-colors group"
      >
        <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Profile
      </button>
      
      <h1 className="text-3xl font-serif font-bold mb-8 text-gray-900">Delivery Address</h1>
      
      {user ? (
        <form onSubmit={handleSave} className="bg-white p-8 border border-gray-100 shadow-sm rounded-xl space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-100 text-green-600 text-sm rounded-lg">
              Address saved successfully! Redirecting...
            </div>
          )}
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Street Address</label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="flex items-center gap-1.5 text-xs font-bold text-brand-950 hover:text-brand-700 transition-colors uppercase tracking-widest disabled:opacity-50"
              >
                {locating ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
                {locating ? 'Locating...' : 'Use Current Location'}
              </button>
            </div>
            <textarea
              ref={addressRef}
              name="address"
              defaultValue={user.user_metadata?.address || ''}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-950 focus:ring-1 focus:ring-brand-950 outline-none transition-all min-h-[120px]"
              placeholder="Enter your full delivery address"
              required
            ></textarea>
          </div>
          
          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              disabled={loading || success || locating}
              className="flex-1 py-4 bg-brand-950 text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-brand-800 transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <MapPin size={16} className="mr-2" />}
              {loading ? 'Saving...' : 'Save Address'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 py-4 border border-gray-200 text-gray-600 rounded-lg font-bold uppercase tracking-widest text-xs text-center hover:bg-gray-50 transition-all flex items-center justify-center active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 mb-4">Please log in to manage your address.</p>
          <button onClick={() => navigate('/login')} className="bg-brand-950 text-white px-8 py-3 rounded-md font-bold text-xs uppercase tracking-widest">Login</button>
        </div>
      )}
    </div>
  );
};

export default Address;

