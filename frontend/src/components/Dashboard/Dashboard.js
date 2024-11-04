import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard!</p>
      <div>
        <Link to="/payments/new">
          <button>New Payment</button>
        </Link>
        <Link to="/payments/history">
          <button>Payment History</button>
        </Link>
        <Link to="/profile">
          <button>Profile</button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
