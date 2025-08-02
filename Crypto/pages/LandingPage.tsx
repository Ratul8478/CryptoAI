import React, { useState } from 'react';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import CryptoPriceWidget from '../components/CryptoPriceWidget';
import MarketTrendChart from '../components/MarketTrendChart';
import Card from '../components/ui/Card';
import { MOCK_TESTIMONIALS } from '../constants';
import type { Testimonial } from '../types';
import ShieldCheckIcon from '../components/icons/ShieldCheckIcon';
import CheckIcon from '../components/icons/CheckIcon';
import { useNavigate } from 'react-router-dom';
import { getTraderTradingPlan } from '../services/geminiService';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [isPlanModalOpen, setPlanModalOpen] = useState(false);
    const [selectedTrader, setSelectedTrader] = useState<Testimonial | null>(null);
    const [tradingPlan, setTradingPlan] = useState('');
    const [isLoadingPlan, setIsLoadingPlan] = useState(false);

    const handleTestimonialClick = async (testimonial: Testimonial) => {
        setSelectedTrader(testimonial);
        setPlanModalOpen(true);
        setIsLoadingPlan(true);
        setTradingPlan('');
        const plan = await getTraderTradingPlan(testimonial.name, testimonial.tradingStyle);
        setTradingPlan(plan);
        setIsLoadingPlan(false);
    };

    return (
        <div className="min-h-screen bg-dark-900 overflow-x-hidden">
            <Header />

            <main className="container mx-auto px-6 py-16">
                {/* Hero Section */}
                <section className="text-center py-20 relative">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                     <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-brand-primary rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-hero-glow"></div>
                    <div className="relative z-10">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-fade-in-up">
                            Trade Crypto with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">AI-Powered</span> Insights
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-text mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Leverage our next-gen platform to analyze market trends, get predictive insights, and execute trades with unparalleled confidence and security.
                        </p>
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <Button className="text-lg px-8 py-4" onClick={() => navigate('/auth-gate')}>Get Started for Free</Button>
                        </div>
                    </div>
                </section>
                
                {/* Crypto Prices Widget Section */}
                <section className="py-16">
                    <CryptoPriceWidget />
                </section>

                {/* Features Section */}
                <section id="features" className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-12">Why Choose AIChainX?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard icon="🤖" title="AI Trading Assistant" description="Get real-time analysis and predictive insights from our Gemini-powered AI." />
                        <FeatureCard icon="🔒" title="Bank-Grade Security" description="Your assets are protected with 2FA, WAF, and end-to-end encryption." />
                        <FeatureCard icon="📈" title="Real-Time Data" description="Access live market data and advanced charting tools to stay ahead." />
                    </div>
                </section>

                {/* Market Trends Section */}
                <section className="py-16">
                    <MarketTrendChart />
                </section>


                {/* Security Section */}
                <section id="security" className="py-20 text-center">
                    <h2 className="text-4xl font-bold mb-4">Your Security is Our Priority</h2>
                    <p className="text-gray-text mb-12 max-w-2xl mx-auto">We employ a multi-layered security strategy to protect your digital assets against all threats.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <SecurityBadge icon={<ShieldCheckIcon className="w-8 h-8 text-brand-secondary"/>} title="SSL/TLS Encryption" />
                        <SecurityBadge icon={<ShieldCheckIcon className="w-8 h-8 text-brand-secondary"/>} title="2FA Enforcement" />
                        <SecurityBadge icon={<ShieldCheckIcon className="w-8 h-8 text-brand-secondary"/>} title="WAF Protection" />
                        <SecurityBadge icon={<ShieldCheckIcon className="w-8 h-8 text-brand-secondary"/>} title="Secure Cold Storage" />
                    </div>
                </section>


                {/* Testimonials Section */}
                <section id="testimonials" className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-12">Loved by Traders Worldwide</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {MOCK_TESTIMONIALS.map((testimonial, index) => (
                            <TestimonialCard key={index} testimonial={testimonial} onClick={() => handleTestimonialClick(testimonial)} />
                        ))}
                    </div>
                </section>

                {/* Choose Your Plan Section */}
                <section id="plans" className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h2>
                    <p className="text-gray-text text-center mb-12 max-w-2xl mx-auto">Select the plan that best fits your trading style and goals. Start for free and upgrade anytime.</p>
                    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
                        <PricingCard
                            plan="Demo"
                            price="$0"
                            priceDetails="Forever"
                            description="Get a feel for our platform with no commitment."
                            features={[
                                "Live Price & Chart Viewing",
                                "Simulated Trading Sandbox",
                                "Limited AI News Feed Access",
                                "Basic Market Data",
                            ]}
                            buttonText="Start Demo"
                            buttonVariant="outline"
                            onButtonClick={() => navigate('/auth-gate')}
                        />
                        <PricingCard
                            plan="Pro"
                            price="$14.99"
                            priceDetails="/ month"
                            description="For active traders who want an AI-powered edge."
                            features={[
                                "Everything in Demo, plus:",
                                "AI Portfolio Health Analysis",
                                "AI-Powered Price Predictions",
                                "Full AI News Feed & Summaries",
                                "Standard Email Support",
                            ]}
                            isPopular={true}
                            buttonText="Choose Pro"
                            buttonVariant="primary"
                            onButtonClick={() => navigate('/auth-gate')}
                        />
                        <PricingCard
                            plan="Max"
                            price="$49.99"
                            priceDetails="/ month"
                            description="The ultimate toolkit for serious traders and pros."
                            features={[
                                "Everything in Pro, plus:",
                                "Advanced AI Strategy Suggestions",
                                "Personalized Market Volatility Alerts",
                                "Priority 24/7 Chat & Voice Support",
                                "Early Access to New Features",
                            ]}
                            buttonText="Choose Max"
                            buttonVariant="secondary"
                            onButtonClick={() => navigate('/auth-gate')}
                        />
                    </div>
                </section>


                 {/* CTA Section */}
                <section className="py-20">
                    <Card className="bg-gradient-to-r from-dark-800 to-dark-900 text-center py-16">
                        <h2 className="text-4xl font-bold mb-4">Ready to Elevate Your Trading?</h2>
                        <p className="text-gray-text mb-8">Join thousands of users and start trading smarter today.</p>
                        <Button variant="secondary" className="text-lg px-8 py-4" onClick={() => navigate('/auth-gate')}>
                            Sign Up Now
                        </Button>
                    </Card>
                </section>

            </main>

            <Modal
                isOpen={isPlanModalOpen}
                onClose={() => setPlanModalOpen(false)}
                title={selectedTrader ? `Trading Plan: ${selectedTrader.name}` : 'Trading Plan'}
            >
                {isLoadingPlan ? (
                    <div className="flex justify-center items-center h-48">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="text-gray-text whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
                        {tradingPlan}
                    </div>
                )}
            </Modal>


            <footer className="border-t border-dark-700 py-8 text-center text-gray-text">
                <p>&copy; {new Date().getFullYear()} AIChainX. All rights reserved.</p>
            </footer>
        </div>
    );
};


const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <Card className="text-center transition-all duration-300 hover:border-brand-secondary hover:-translate-y-2">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-text">{description}</p>
    </Card>
);

const SecurityBadge: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <div className="flex flex-col items-center p-4 bg-dark-800 border border-dark-700 rounded-lg">
        {icon}
        <h4 className="mt-2 font-semibold text-center">{title}</h4>
    </div>
);


const TestimonialCard: React.FC<{ testimonial: Testimonial; onClick: () => void }> = ({ testimonial, onClick }) => (
    <div 
        onClick={onClick} 
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        role="button"
        tabIndex={0}
        className="h-full focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-xl"
    >
        <Card className="flex flex-col h-full text-left transition-all duration-300 hover:border-brand-primary hover:-translate-y-2 cursor-pointer">
            <p className="text-gray-text italic mb-6 flex-grow">"{testimonial.quote}"</p>
            <div className="flex items-center mt-auto">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-brand-secondary">{testimonial.role}</p>
                </div>
            </div>
        </Card>
    </div>
);

const PricingCard: React.FC<{
    plan: string;
    price: string;
    priceDetails: string;
    description: string;
    features: string[];
    isPopular?: boolean;
    buttonText: string;
    buttonVariant: 'primary' | 'secondary' | 'outline';
    onButtonClick: () => void;
}> = ({ plan, price, priceDetails, description, features, isPopular = false, buttonText, buttonVariant, onButtonClick }) => {
    
    const planColor = plan === 'Demo' ? 'text-brand-secondary' : plan === 'Pro' ? 'text-brand-primary' : 'text-white';

    return (
        <Card className={`flex flex-col p-8 transform hover:-translate-y-2 transition-transform duration-300 ${isPopular ? 'border-2 border-brand-primary ring-4 ring-brand-primary/20' : ''} relative`}>
            {isPopular && (
                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                    <span className="bg-brand-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                </div>
            )}
            <h3 className={`text-2xl font-bold text-center ${planColor} ${isPopular ? 'mt-4' : ''}`}>{plan}</h3>
            
            <div className="text-center my-4">
                <span className="text-5xl font-extrabold text-white">{price}</span>
                <span className="text-gray-text ml-1">{priceDetails}</span>
            </div>

            <p className="text-center text-gray-text mb-8">{description}</p>
            <ul className="space-y-4 mb-10 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <CheckIcon className="w-5 h-5 text-brand-secondary mr-3 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <Button variant={buttonVariant} className="w-full" onClick={onButtonClick}>
                {buttonText}
            </Button>
        </Card>
    );
};

export default LandingPage;