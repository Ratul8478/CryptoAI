
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OtpPage from './pages/OtpPage';
import DashboardPage from './pages/DashboardPage';
import ImageGenerationPage from './pages/ImageGenerationPage';
import DatabaseViewerPage from './pages/DatabaseViewerPage';
import UserTypeSelectionPage from './pages/UserTypeSelectionPage';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { isAuthenticated, isCreator, requiresOtp } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" />} />
      
      <Route path="/auth-gate" element={!isAuthenticated ? <UserTypeSelectionPage /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      
      <Route path="/verify-otp" element={requiresOtp ? <OtpPage /> : <Navigate to="/auth-gate" />} />
      
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <DashboardPage /> : <Navigate to="/auth-gate" />} 
      />
      
      <Route 
        path="/image-generation" 
        element={isAuthenticated ? <ImageGenerationPage /> : <Navigate to="/auth-gate" />} 
      />

      <Route 
        path="/database-viewer"
        element={isAuthenticated && isCreator ? <DatabaseViewerPage /> : <Navigate to="/dashboard" />}
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;