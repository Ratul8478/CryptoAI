
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { generateImage } from '../services/geminiService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DownloadIcon from '../components/icons/DownloadIcon';
import ImageIcon from '../components/icons/ImageIcon';

const ImageGenerationPage: React.FC = () => {
    const { logout, userEmail } = useAuth();
    const navigate = useNavigate();

    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [numberOfImages, setNumberOfImages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const images = await generateImage(prompt, aspectRatio, numberOfImages);
            setGeneratedImages(images);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const downloadImage = (base64Image: string, index: number) => {
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${base64Image}`;
        link.download = `aichainx-image-${index + 1}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

    return (
        <div className="min-h-screen bg-dark-900 text-white">
            <header className="bg-dark-800 border-b border-dark-700 px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold text-white">
                      AIChainX <span className="text-brand-primary">Dashboard</span>
                    </h1>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/dashboard" className="font-semibold text-gray-text hover:text-white transition-colors px-3 py-2 rounded-md">Overview</Link>
                        <span className="font-semibold text-white px-3 py-2 rounded-md bg-dark-700">Image Generation</span>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-text hidden md:block">{userEmail}</span>
                    <Button onClick={handleLogout} variant="outline" className="py-2 px-4">Logout</Button>
                </div>
            </header>

            <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Control Panel */}
                <Card className="lg:col-span-1 h-fit sticky top-24">
                    <h2 className="text-xl font-bold mb-4">Image Generation Controls</h2>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="prompt" className="block text-sm font-medium text-gray-text mb-2">Prompt</label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A futuristic city skyline on Mars, digital art"
                                rows={5}
                                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-text focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-text mb-2">Aspect Ratio</label>
                            <div className="grid grid-cols-3 gap-2">
                                {aspectRatios.map(ratio => (
                                    <button 
                                        key={ratio}
                                        onClick={() => setAspectRatio(ratio)}
                                        disabled={isLoading}
                                        className={`py-2 px-3 rounded-md text-sm font-semibold transition-colors ${aspectRatio === ratio ? 'bg-brand-primary text-white' : 'bg-dark-700 hover:bg-dark-600'}`}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="numberOfImages" className="block text-sm font-medium text-gray-text mb-2">Number of Images (1-4)</label>
                            <input
                                id="numberOfImages"
                                type="number"
                                value={numberOfImages}
                                onChange={(e) => setNumberOfImages(Math.max(1, Math.min(4, Number(e.target.value))))}
                                min="1"
                                max="4"
                                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-text focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
                                disabled={isLoading}
                            />
                        </div>
                        
                        <Button onClick={handleGenerate} disabled={isLoading} className="w-full text-lg">
                            {isLoading ? <span className="flex items-center justify-center"><LoadingSpinner/> &nbsp; Generating...</span> : 'Generate Image'}
                        </Button>
                        
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    </div>
                </Card>

                {/* Image Display Area */}
                <div className="lg:col-span-2">
                    <Card className="h-full min-h-[80vh] flex flex-col">
                         <h2 className="text-xl font-bold mb-4">Generated Images</h2>
                         <div className="flex-grow w-full bg-dark-900 rounded-lg flex items-center justify-center p-4">
                            {isLoading ? (
                                <div className="flex flex-col items-center text-gray-text">
                                    <LoadingSpinner />
                                    <p className="mt-4">Generating your masterpiece...</p>
                                </div>
                            ) : generatedImages.length > 0 ? (
                                <div className={`grid gap-4 w-full h-full ${generatedImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                    {generatedImages.map((img, index) => (
                                        <div key={index} className="group relative rounded-lg overflow-hidden border-2 border-dark-700">
                                            <img src={`data:image/jpeg;base64,${img}`} alt={`Generated image ${index + 1}`} className="w-full h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button onClick={() => downloadImage(img, index)} className="p-3 bg-brand-primary rounded-full text-white hover:bg-blue-600 transition-colors" aria-label="Download image">
                                                    <DownloadIcon className="w-6 h-6"/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-text">
                                    <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                                    <p>Your generated images will appear here.</p>
                                    <p className="text-sm mt-2">Use the controls on the left to start.</p>
                                </div>
                            )}
                         </div>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default ImageGenerationPage;
