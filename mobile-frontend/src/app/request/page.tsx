"use client";

import React, { useState } from 'react';

// Basic Card component
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

// Placeholder function for API calls
const postToApi = async (endpoint: string, data: any) => {
  console.log(`Posting to API: ${endpoint}`, data);
  // Simulate API delay and response
  await new Promise(resolve => setTimeout(resolve, 700));
  // Simulate success/failure
  if (Math.random() > 0.1) { // 90% success rate
    return { success: true, message: 'Request sent successfully!' };
  } else {
    return { success: false, message: 'Failed to send request. Please try again.' };
  }
};

export default function RequestPage() {
  const [payer, setPayer] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending request...' });

    const requestData = {
      payer,
      amount: parseFloat(amount),
      note,
    };

    // Assume an endpoint like /api/payments/request
    const response = await postToApi('/api/payments/request', requestData);

    if (response.success) {
      setStatus({ type: 'success', message: response.message });
      // Clear form on success
      setPayer('');
      setAmount('');
      setNote('');
    } else {
      setStatus({ type: 'error', message: response.message });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Request Money</h1>

      <Card>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="payer" className="block text-sm font-medium text-gray-700 mb-1">From (Username or Phone)</label>
            <input
              type="text"
              id="payer"
              name="payer"
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter username or phone number"
              required
              disabled={status.type === 'loading'}
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              required
              disabled={status.type === 'loading'}
            />
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
            <textarea
              id="note"
              name="note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Reason for request"
              disabled={status.type === 'loading'}
            ></textarea>
          </div>

          {status.type !== 'idle' && (
            <div className={`p-3 rounded-md text-sm ${status.type === 'loading' ? 'bg-yellow-100 text-yellow-800' : status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {status.message}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium disabled:opacity-50"
            disabled={status.type === 'loading'}
          >
            {status.type === 'loading' ? 'Sending...' : 'Send Request'}
          </button>
        </form>
      </Card>
    </div>
  );
}

