
import React, { useState, useMemo, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AuthFormContainer from '../components/AuthFormContainer';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, isOtpLoading } = useAuth();

    const [num1, num2] = useMemo(() => [Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1], []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password || !captcha) {
            setError('All fields are required.');
            return;
        }

        if (parseInt(captcha, 10) !== num1 + num2) {
            setError('Incorrect CAPTCHA answer.');
            return;
        }

        try {
            // In a real app, you'd also validate the password against the stored hash here.
            // For this simulation, we only check if the user exists and send OTP.
            await login(email);
            navigate('/verify-otp');
        } catch (err: any) {
             setError(err.message || 'An unknown error occurred.');
        }
    };

    return (
        <AuthFormContainer
            title="Welcome Back"
            footerText="Don't have an account?"
            footerLinkText="Register"
            footerTo="/register"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required disabled={isOtpLoading} />
                <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required disabled={isOtpLoading} />
                
                <div>
                    <label className="block text-sm font-medium text-gray-text mb-2">CAPTCHA Verification</label>
                    <div className="flex items-center space-x-4 p-3 bg-dark-700 rounded-lg">
                        <span className="text-lg font-mono">{num1} + {num2} = ?</span>
                        <Input type="text" value={captcha} onChange={(e) => setCaptcha(e.target.value)} placeholder="Your answer" required className="flex-grow bg-dark-800" disabled={isOtpLoading} />
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                
                <Button type="submit" className="w-full text-lg" disabled={isOtpLoading}>
                   {isOtpLoading ? <span className="flex items-center justify-center"><LoadingSpinner/> &nbsp; Sending OTP...</span> : 'Login'}
                </Button>
            </form>
        </AuthFormContainer>
    );
};

export default LoginPage;
