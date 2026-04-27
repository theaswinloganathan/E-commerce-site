import React from 'react';
import { useStore } from '../store/useStore';

const Notifications = () => {
  const user = useStore(state => state.user);
  return (
    <div className="max-w-2xl mx-auto p-6 mt-24">
      <h1 className="text-2xl font-bold mb-4">Notification Preferences</h1>
      {user ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
            <span>Email Notifications</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-brand-950 focus:ring-brand-950" />
          </div>
          <div className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
            <span>SMS Notifications</span>
            <input type="checkbox" className="w-5 h-5 text-brand-950 focus:ring-brand-950" />
          </div>
        </div>
      ) : (
        <p>Please log in to manage notifications.</p>
      )}
    </div>
  );
};

export default Notifications;
