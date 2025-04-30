import Link from 'next/link';
import React from 'react';

// Placeholder icons (replace with actual icons later)
const HomeIcon = () => <span>🏠</span>;
const SendIcon = () => <span>💸</span>;
const RequestIcon = () => <span>💰</span>;
const ProfileIcon = () => <span>👤</span>;

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <HomeIcon />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/send" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <SendIcon />
          <span className="text-xs mt-1">Send</span>
        </Link>
        <Link href="/request" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <RequestIcon />
          <span className="text-xs mt-1">Request</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <ProfileIcon />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;

