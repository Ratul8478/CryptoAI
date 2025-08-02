
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AuthFormContainer from '../components/AuthFormContainer';
import { useAuth } from '../hooks/useAuth';

const OtpPage: React.FC = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { userEmail, userMobile, verifyOtp, otpTarget } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await verifyOtp(otp);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    return (
        <AuthFormContainer
            title="Two-Factor Authentication"
            footerText="Didn't receive a code?"
            footerLinkText="Resend"
            footerTo="#"
        >
            <p className="text-center text-gray-text mb-6">
                {otpTarget === 'mobile' ?
                <>
                    A verification code has been sent to your mobile number <br /> <span className="font-bold text-white">{userMobile}</span>.
                </>
                :
                <>
                    A verification code has been sent to your registered email <br /> <span className="font-bold text-white">{userEmail}</span>.
                </>
                }
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Enter OTP"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="text-center text-2xl tracking-[0.5em]"
                    required
                />
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                
                <Button type="submit" className="w-full text-lg">
                    Verify
                </Button>
            </form>
        </AuthFormContainer>
    );
};

export default OtpPage;