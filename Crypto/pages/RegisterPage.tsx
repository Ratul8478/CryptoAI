
import React, { useState, useMemo, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AuthFormContainer from '../components/AuthFormContainer';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Simple hashing simulation (in a real app, use a library like bcrypt)
const hashPassword = (password: string): string => {
    // This is NOT a secure hash. For demonstration purposes only.
    return `hashed_${password}_${'somesalt'}`;
};

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, isOtpLoading } = useAuth();

  const [num1, num2] = useMemo(() => [
    Math.floor(Math.random() * 10) + 1, 
    Math.floor(Math.random() * 10) + 1
  ], []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !mobile || !password || !captcha) {
      setError('All fields are required.');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (parseInt(captcha, 10) !== num1 + num2) {
      setError('Incorrect CAPTCHA answer.');
      return;
    }

    try {
      const passwordHash = hashPassword(password);
      await register({ fullName, email, mobile, passwordHash, isCreator });
      navigate('/verify-otp');
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    }
  };

  return (
    <AuthFormContainer
      title="Create an Account"
      footerText="Already have an account?"
      footerLinkText="Login"
      footerTo="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required disabled={isOtpLoading} />
        <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required disabled={isOtpLoading} />
        <Input label="Mobile Number" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+1234567890" required disabled={isOtpLoading} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" required disabled={isOtpLoading} />
        
        <div>
          <label className="block text-sm font-medium text-gray-text mb-2">CAPTCHA Verification</label>
          <div className="flex items-center space-x-4 p-3 bg-dark-700 rounded-lg">
            <span className="text-lg font-mono">{num1} + {num2} = ?</span>
            <Input type="text" value={captcha} onChange={(e) => setCaptcha(e.target.value)} placeholder="Your answer" required className="flex-grow bg-dark-800" disabled={isOtpLoading} />
          </div>
        </div>
        
        <div className="flex items-center">
            <input
                id="isCreator"
                type="checkbox"
                checked={isCreator}
                onChange={(e) => setIsCreator(e.target.checked)}
                disabled={isOtpLoading}
                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
            />
            <label htmlFor="isCreator" className="ml-2 block text-sm text-gray-text">
                I am the application creator
            </label>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <Button type="submit" className="w-full text-lg mt-2" disabled={isOtpLoading}>
           {isOtpLoading ? <span className="flex items-center justify-center"><LoadingSpinner/> &nbsp; Sending OTP...</span> : 'Register'}
        </Button>
      </form>
    </AuthFormContainer>
  );
};

export default RegisterPage;