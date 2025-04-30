"use client";

import React, { useState, useEffect } from 'react';

// Basic Card component
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

// Placeholder function for API calls
const fetchFromApi = async (endpoint: string) => {
  console.log(`Fetching from API: ${endpoint}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  if (endpoint === '/api/user/profile') {
    return {
      name: "Alex Johnson",
      username: "alexj",
      email: "alex.j@example.com",
      phone: "+1-555-123-4567",
      joined: "Jan 15, 2024",
    };
  }
  return null;
};

const postToApi = async (endpoint: string) => {
  console.log(`Posting to API: ${endpoint}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  return { success: true, message: 'Logged out successfully.' };
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logoutStatus, setLogoutStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const profileData = await fetchFromApi('/api/user/profile');
        setUser(profileData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Handle error state
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    setLogoutStatus('loading');
    try {
      const response = await postToApi('/api/auth/logout');
      if (response.success) {
        setLogoutStatus('success');
        // In a real app, redirect to login or clear session
        console.log('Logout successful');
      } else {
        setLogoutStatus('error');
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutStatus('error');
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return <p>Failed to load profile.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <Card className="text-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500">
          <span className="text-4xl">👤</span>
        </div>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-600">@{user.username}</p>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-3 border-b pb-2">Account Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{user.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Joined:</span>
            <span className="font-medium">{user.joined}</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-3 border-b pb-2">Settings</h3>
        <div className="space-y-2">
          <button className="w-full text-left py-2 px-1 hover:bg-gray-100 rounded">Notifications</button>
          <button className="w-full text-left py-2 px-1 hover:bg-gray-100 rounded">Security</button>
          <button className="w-full text-left py-2 px-1 hover:bg-gray-100 rounded">Linked Accounts</button>
        </div>
      </Card>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-medium disabled:opacity-50"
        disabled={logoutStatus === 'loading'}
      >
        {logoutStatus === 'loading' ? 'Logging out...' : 'Log Out'}
      </button>
      {logoutStatus === 'error' && <p className="text-red-600 text-sm text-center mt-2">Logout failed. Please try again.</p>}
      {logoutStatus === 'success' && <p className="text-green-600 text-sm text-center mt-2">Logged out successfully.</p>}
    </div>
  );
}

