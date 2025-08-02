import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './ui/Button';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-900/70 backdrop-blur-lg border-b border-dark-700">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          AI<span className="text-brand-primary">ChainX</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="text-gray-text hover:text-white transition-colors">Features</a>
          <a href="#security" onClick={(e) => handleNavClick(e, 'security')} className="text-gray-text hover:text-white transition-colors">Security</a>
          <a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')} className="text-gray-text hover:text-white transition-colors">Testimonials</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/auth-gate')}>Login</Button>
          <Button variant="primary" onClick={() => navigate('/auth-gate')}>Register</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;