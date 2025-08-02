import React, { useState } from 'react';
import EyeIcon from '../icons/EyeIcon';
import EyeOffIcon from '../icons/EyeOffIcon';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, className = '', error, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-text mb-2">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={`w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-text focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300 ${className} ${isPassword ? 'pr-12' : ''} ${error ? 'border-red-500 ring-red-500' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-text hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        )}
      </div>
       {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
