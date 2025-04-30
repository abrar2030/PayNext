import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './Login.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuthService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image">
          {/* Image removed as per your request */}
        </div>
        <div className="login-form-container">
          <h2 className="login-title">Welcome Back to PayNext</h2>
          <p className="login-subtitle">Please login to your account</p>
          {error && <p className="error-message">{error}</p>}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
          <p className="redirect-message">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="redirect-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
