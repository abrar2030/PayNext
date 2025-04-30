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
  // In a real app, this would fetch data from the backend API gateway
  console.log(`Fetching from API: ${endpoint}`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  if (endpoint === '/api/balance') {
    return { balance: 1234.56, currency: 'USD' };
  }
  if (endpoint === '/api/transactions?limit=3') {
    return [
      { id: 1, type: 'debit', description: 'Coffee Shop', date: 'Apr 28, 2025', amount: -5.50, currency: 'USD' },
      { id: 2, type: 'credit', description: 'Salary Deposit', date: 'Apr 27, 2025', amount: 2500.00, currency: 'USD' },
      { id: 3, type: 'debit', description: 'Online Store', date: 'Apr 26, 2025', amount: -78.90, currency: 'USD' },
    ];
  }
  return null;
};

export default function HomePage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const balanceData = await fetchFromApi('/api/balance');
        const transactionData = await fetchFromApi('/api/transactions?limit=3');
        if (balanceData) setBalance(balanceData.balance);
        if (transactionData) setTransactions(transactionData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle error state in UI
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">PayNext Mobile</h1>

      {/* Balance Section */}
      <Card className="bg-blue-500 text-white">
        <h2 className="text-lg font-semibold mb-2">Current Balance</h2>
        {loading ? (
          <p className="text-3xl font-bold">Loading...</p>
        ) : (
          <p className="text-3xl font-bold">${balance !== null ? balance.toFixed(2) : 'N/A'}</p>
        )}
        <p className="text-sm opacity-80">Available Funds</p>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Add Link components later for navigation */}
          <button className="flex flex-col items-center p-2 rounded hover:bg-gray-100">
            <div className="w-8 h-8 bg-blue-200 rounded-full mb-1 flex items-center justify-center">💸</div>
            <span className="text-sm">Send</span>
          </button>
          <button className="flex flex-col items-center p-2 rounded hover:bg-gray-100">
            <div className="w-8 h-8 bg-green-200 rounded-full mb-1 flex items-center justify-center">💰</div>
            <span className="text-sm">Request</span>
          </button>
          <button className="flex flex-col items-center p-2 rounded hover:bg-gray-100">
            {/* Placeholder for Icon */}
            <div className="w-8 h-8 bg-purple-200 rounded-full mb-1"></div>
            <span className="text-sm">Scan QR</span>
          </button>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <h2 className="text-lg font-semibold mb-3">Recent Transactions</h2>
        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length > 0 ? (
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
                <p className={`${tx.amount < 0 ? 'text-red-600' : 'text-green-600'} font-medium`}>
                  {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent transactions.</p>
        )}
        <button className="mt-4 text-blue-600 hover:underline text-sm w-full text-center">View All</button>
      </Card>
    </div>
  );
}

