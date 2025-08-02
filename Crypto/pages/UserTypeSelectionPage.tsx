
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const UserTypeSelectionPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 p-4">
            <div className="w-full max-w-md text-center">
                <Link to="/" className="block mb-8 text-3xl font-bold text-white">
                    AI<span className="text-brand-primary">ChainX</span>
                </Link>
                <div className="bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl p-8 space-y-8">
                    <h2 className="text-3xl font-bold text-white">Are you new here?</h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Button
                            variant="primary"
                            className="w-full text-lg"
                            onClick={() => navigate('/register')}
                        >
                            I'm a New User
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-full text-lg"
                            onClick={() => navigate('/login')}
                        >
                            I'm an Existing User
                        </Button>
                    </div>
                </div>
                 <p className="text-center text-gray-text mt-6">
                    Or{' '}
                    <Link to="/" className="font-semibold text-brand-primary hover:underline">
                        Go Back to Homepage
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default UserTypeSelectionPage;
