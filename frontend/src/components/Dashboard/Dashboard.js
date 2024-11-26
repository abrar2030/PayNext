import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>PayNext</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard" className="active">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/payments/new">New Payment</Link>
            </li>
            <li>
              <Link to="/payments/history">Payment History</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Welcome Back!</h1>
          <p>Here&apos;s a quick overview of your account.</p>
        </header>
        <section className="dashboard-overview">
          <div className="card">
            <h3>Account Balance</h3>
            <p>$12,345.67</p>
          </div>
          <div className="card">
            <h3>Recent Transactions</h3>
            <p>View your recent payment activities.</p>
            <Link to="/payments/history" className="card-link">
              View History
            </Link>
          </div>
          <div className="card">
            <h3>Make a Payment</h3>
            <p>Send money to anyone, anywhere.</p>
            <Link to="/payments/new" className="card-link">
              New Payment
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
