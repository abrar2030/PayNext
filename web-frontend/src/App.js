import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/Pages/HomePage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import PaymentForm from './components/Payments/PaymentForm';
import PaymentHistory from './components/Payments/PaymentHistory';
import Profile from './components/Profile/Profile';

function App() {
  // Use basename only in production, not in development
  const basename = process.env.NODE_ENV === 'production' ? '/pnx-frontend' : '';
  
  return (
    <Router basename={basename}>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payments/new" element={<PaymentForm />} />
          <Route path="/payments/history" element={<PaymentHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
