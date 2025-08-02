// otpService.ts
const API_BASE_URL = 'http://localhost:3001/api';

export const sendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, message: 'Network error' };
  }
};

export const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, message: 'Network error' };
  }
};
