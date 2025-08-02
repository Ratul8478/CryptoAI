
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { getAllUsers, User } from '../lib/database';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DatabaseViewerPage: React.FC = () => {
    const { logout, userEmail } = useAuth();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleVerify = async () => {
        if (password === 'CREATOR') {
            setIsLoading(true);
            setError('');
            try {
                const allUsers = await getAllUsers();
                setUsers(allUsers);
                setIsAuthenticated(true);
            } catch (err) {
                setError('Failed to fetch user data.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setError('Incorrect password.');
        }
    };
    
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-900">
                <Card className="w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center mb-4">Creator Access</h2>
                    <p className="text-gray-text text-center mb-6">Enter the password to view the user database.</p>
                    <div className="space-y-4">
                        <Input 
                            label="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleVerify()}
                            placeholder="Enter creator password"
                        />
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <Button onClick={handleVerify} disabled={isLoading} className="w-full">
                            {isLoading ? <LoadingSpinner/> : 'Verify'}
                        </Button>
                         <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full">
                            Back to Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-900 text-white">
            <header className="bg-dark-800 border-b border-dark-700 px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold text-white">
                      AIChainX <span className="text-red-500">Database Viewer</span>
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-text hidden md:block">{userEmail}</span>
                    <Button onClick={handleLogout} variant="outline" className="py-2 px-4">Logout</Button>
                </div>
            </header>
            <main className="p-6">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Registered Users ({users.length})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left table-auto">
                            <thead className="border-b border-dark-600">
                                <tr>
                                    <th className="p-4">Full Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Mobile</th>
                                    <th className="p-4">Registered On</th>
                                    <th className="p-4">Is Creator?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.email} className="border-b border-dark-700 hover:bg-dark-700/50">
                                        <td className="p-4">{user.fullName}</td>
                                        <td className="p-4 font-mono">{user.email}</td>
                                        <td className="p-4 font-mono">{user.mobile}</td>
                                        <td className="p-4">{new Date(user.createdAt).toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.isCreator ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
                                                {user.isCreator ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default DatabaseViewerPage;
