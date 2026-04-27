import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
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
      
      <h1 className="text-3xl font-serif font-bold mb-8 text-gray-900">Change Password</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-100 shadow-sm rounded-xl space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-100 text-green-600 text-sm rounded-lg">
            Password changed successfully! Redirecting...
          </div>
        )}
        
        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">New Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-950 focus:ring-1 focus:ring-brand-950 outline-none transition-all"
            placeholder="Min. 6 characters"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-950 focus:ring-1 focus:ring-brand-950 outline-none transition-all"
            placeholder="Confirm your new password"
            required
          />
        </div>
        
        <div className="pt-4 flex gap-4">
          <button
            type="submit"
            disabled={loading || success}
            className="flex-1 py-4 bg-brand-950 text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-brand-800 transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Lock size={16} className="mr-2" />}
            {loading ? 'Updating...' : 'Update Password'}
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
    </div>
  );
};

export default ChangePassword;
