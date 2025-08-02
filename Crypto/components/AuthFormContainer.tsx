import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthFormContainerProps {
  children: ReactNode;
  title: string;
  footerText: string;
  footerLinkText: string;
  footerTo: string;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ children, title, footerText, footerLinkText, footerTo }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8 text-3xl font-bold text-white">
          AI<span className="text-brand-primary">ChainX</span>
        </Link>
        <div className="bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-6">{title}</h2>
          {children}
        </div>
        <p className="text-center text-gray-text mt-6">
          {footerText}{' '}
          <Link to={footerTo} className="font-semibold text-brand-primary hover:underline">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthFormContainer;