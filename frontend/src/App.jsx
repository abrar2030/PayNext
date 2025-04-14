import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThemeConfig from './theme/ThemeConfig';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import PageLoader from './components/PageLoader';

// Pages
import Homepage from './pages/Homepage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import HelpCenter from './pages/HelpCenter';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import NotFound from './pages/NotFound';

const App = () => {
  const [loading, setLoading] = React.useState(false);

  return (
    <ThemeConfig>
      <Router>
        <PageLoader loading={loading}>
          <Navbar />
          <PageTransition>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/login" element={<Login onLogin={() => {}} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/send-money" element={<SendMoney />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
          <Footer />
        </PageLoader>
      </Router>
    </ThemeConfig>
  );
};

export default App;
