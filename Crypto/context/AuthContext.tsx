
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { generateOtpEmail, generateOtpSms } from '../services/geminiService';
import Modal from '../components/ui/Modal';
import { addUser, getUserData } from '../lib/database';

interface AuthContextType {
  isAuthenticated: boolean;
  isCreator: boolean;
  requiresOtp: boolean;
  userEmail: string | null;
  userMobile: string | null;
  otpTarget: 'email' | 'mobile' | null;
  login: (email: string) => Promise<void>;
  register: (details: { fullName: string; email: string; mobile: string; passwordHash: string; isCreator: boolean; }) => Promise<void>;
  verifyOtp: (enteredOtp: string) => Promise<boolean>;
  logout: () => void;
  isOtpLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [requiresOtp, setRequiresOtp] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userMobile, setUserMobile] = useState<string | null>(null);
  const [otp, setOtp] = useState<string | null>(null);
  const [isOtpLoading, setIsOtpLoading] = useState<boolean>(false);
  const [otpMessage, setOtpMessage] = useState<{ title: string; body: string } | null>(null);
  const [otpTarget, setOtpTarget] = useState<'email' | 'mobile' | null>(null);

  const login = useCallback(async (email: string) => {
    setIsOtpLoading(true);
    try {
        const existingUser = await getUserData(email);
        if (!existingUser) {
            throw new Error("No account found with this email address.");
        }

        const { otp: newOtp, body } = await generateOtpEmail(email);
        console.log(`Generated OTP for ${email}: ${newOtp}`); // For debugging
        setOtp(newOtp);
        setUserEmail(email);
        setUserMobile(null);
        setRequiresOtp(true);
        setIsAuthenticated(false);
        setIsCreator(false);
        setOtpTarget('email');
        setOtpMessage({ title: `Your AIChainX Verification Code`, body: body });
    } catch (error: any) {
        console.error("Failed to generate OTP:", error);
        throw new Error(error.message || "Failed to contact the AI verification service. Please try again.");
    } finally {
        setIsOtpLoading(false);
    }
  }, []);

  const register = useCallback(async (details: { fullName: string; email: string; mobile: string; passwordHash: string; isCreator: boolean; }) => {
    setIsOtpLoading(true);
    try {
        // Save user to the database first
        await addUser({
            fullName: details.fullName,
            email: details.email,
            mobile: details.mobile,
            passwordHash: details.passwordHash,
            isCreator: details.isCreator,
            createdAt: new Date(),
        });

        const { otp: newOtp, body } = await generateOtpSms(details.mobile);
        console.log(`Generated OTP for ${details.mobile}: ${newOtp}`); // For debugging
        setOtp(newOtp);
        setUserEmail(details.email);
        setUserMobile(details.mobile);
        setRequiresOtp(true);
        setIsAuthenticated(false);
        setIsCreator(false);
        setOtpTarget('mobile');
        setOtpMessage({ title: `Your AIChainX Verification Code`, body: body });
    } catch (error) {
        console.error("Failed to generate OTP for SMS:", error);
        throw new Error("Failed to contact the AI verification service. Please try again.");
    } finally {
        setIsOtpLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (enteredOtp: string): Promise<boolean> => {
    if (otp && enteredOtp === otp) {
      const userData = await getUserData(userEmail!);
      if (userData) {
          setIsCreator(userData.isCreator || false);
      }
      setRequiresOtp(false);
      setIsAuthenticated(true);
      setOtp(null);
      return true;
    }
    return false;
  }, [otp, userEmail]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setIsCreator(false);
    setRequiresOtp(false);
    setUserEmail(null);
    setUserMobile(null);
    setOtpTarget(null);
    setOtp(null);
  }, []);

  const value = { isAuthenticated, isCreator, requiresOtp, userEmail, userMobile, otpTarget, login, register, verifyOtp, logout, isOtpLoading };

  return (
    <AuthContext.Provider value={value}>
        {children}
        <Modal
            isOpen={!!otpMessage}
            onClose={() => setOtpMessage(null)}
            title={otpMessage?.title || 'Verification Code Received'}
        >
            <div className="text-gray-text whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-[60vh] overflow-y-auto p-4 bg-dark-900 rounded-lg">
                {otpMessage?.body}
            </div>
        </Modal>
    </AuthContext.Provider>
  );
};