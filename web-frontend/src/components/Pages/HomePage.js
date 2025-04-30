import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="content-wrapper">
        <header className="header">
          <div className="logo">PayNext</div>
          <nav className="nav">
            <ul>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/payments/new">Make a Payment</Link>
              </li>
              <li>
                <Link to="/payments/history">Payment History</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/login" className="login-button">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="register-button">
                  Register
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <section className="hero">
          <div className="hero-content">
            <h1>Next-Gen Digital Payments</h1>
            <p>
              Seamless transactions. Secure payments.
              All in one place.
            </p>
            <Link to="/register" className="cta-button">
              Get Started
            </Link>
          </div>
        </section>

        <section className="features">
          <div className="feature">
            <h2>Fast Transactions</h2>
            <p>
              Experience lightning-fast payment processing
              with PayNext.
            </p>
          </div>
          <div className="feature">
            <h2>Secure Platform</h2>
            <p>
              Your security is our priority. Transactions
              are encrypted end-to-end.
            </p>
          </div>
          <div className="feature">
            <h2>User-Friendly Interface</h2>
            <p>
              Manage your finances with our intuitive and
              easy-to-use platform.
            </p>
          </div>
        </section>
      </div>

      <footer className="footer">
        <p>&copy; 2024 PayNext. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
