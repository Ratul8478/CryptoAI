
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import AIAssistant from '../components/AIAssistant';
import { MOCK_CRYPTO_DATA, MOCK_PORTFOLIO_DATA } from '../constants';
import type { CryptoData, PortfolioHolding, NewsArticle } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getMarketSentiment, getShortTermPrediction, getNewsFeed, getNewsSummary, getPortfolioAnalysis } from '../services/geminiService';
import BotIcon from '../components/icons/BotIcon';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DatabaseIcon from '../components/icons/DatabaseIcon';

const PriceTicker: React.FC<{ items: CryptoData[] }> = ({ items }) => {
    const duplicatedItems = [...items, ...items]; // Duplicate for seamless scroll
  return (
    <div className="relative w-full h-14 overflow-hidden bg-dark-800 border-y border-dark-700">
      <div className="absolute top-0 left-0 flex animate-ticker-scroll hover:[animation-play-state:paused]">
        {duplicatedItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 px-6 py-2 flex-shrink-0">
            <img src={item.logo} alt={item.name} className="w-6 h-6"/>
            <span className="font-semibold">{item.symbol}</span>
            <span className="text-gray-text">${item.price.toLocaleString()}</span>
            <span className={item.change24h >= 0 ? 'text-brand-secondary' : 'text-red-500'}>
              {item.change24h >= 0 ? '▲' : '▼'} {Math.abs(item.change24h)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PredictionChip: React.FC<{ prediction: string; isLoading: boolean }> = ({ prediction, isLoading }) => {
    const [status, reason] = prediction.split(': ');
    const colorClass = 
        status === 'Bullish' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
        status === 'Bearish' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
        'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';

    return (
        <div className="flex items-center gap-2">
            <BotIcon className="w-5 h-5 text-brand-primary" />
            <span className="font-semibold">AI Prediction:</span>
            {isLoading ? <LoadingSpinner /> : (
                <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${colorClass}`}>
                    <strong>{status}:</strong> {reason}
                </span>
            )}
        </div>
    );
};

const PortfolioOverview: React.FC = () => {
    const totalValue = useMemo(() => MOCK_PORTFOLIO_DATA.reduce((sum, asset) => sum + asset.value, 0), []);
    const COLORS = ['#0A72E0', '#00C29A', '#F7931A', '#627EEA', '#249E9F'];
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalysis = async () => {
        setIsLoading(true);
        const result = await getPortfolioAnalysis(MOCK_PORTFOLIO_DATA);
        setAnalysis(result);
        setIsLoading(false);
    };

    return (
        <Card className="flex flex-col h-full">
            <h3 className="text-xl font-bold mb-2">Portfolio Overview</h3>
            <p className="text-3xl font-bold text-white mb-1">${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p className="text-brand-secondary font-semibold mb-4">+1,245.50 (7.8%) Today</p>
            <div className="w-full h-48 mb-4">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={MOCK_PORTFOLIO_DATA} dataKey="value" nameKey="symbol" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                             {MOCK_PORTFOLIO_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                         <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <Button onClick={handleAnalysis} disabled={isLoading} variant="secondary" className="w-full mt-auto">
                {isLoading ? <LoadingSpinner/> : 'Get AI Analysis'}
            </Button>
            {analysis && (
                <div className="mt-4 p-3 bg-dark-700 rounded-lg">
                    <p className="text-sm text-gray-text whitespace-pre-wrap">{analysis}</p>
                </div>
            )}
        </Card>
    );
};

const NewsFeed: React.FC<{ onHeadlineClick: (article: NewsArticle) => void }> = ({ onHeadlineClick }) => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            const articles = await getNewsFeed();
            setNews(articles);
            setIsLoading(false);
        };
        fetchNews();
    }, []);

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">Live News Feed</h3>
            {isLoading ? <LoadingSpinner/> : (
                <ul className="space-y-3">
                    {news.map((item, index) => (
                        <li key={index} onClick={() => onHeadlineClick(item)} className="p-3 bg-dark-700 rounded-lg hover:bg-dark-600 cursor-pointer transition-colors duration-200">
                           <div className="flex justify-between items-center">
                             <p className="font-semibold text-sm">{item.headline}</p>
                             <span className="text-xs bg-brand-primary/50 text-blue-300 px-2 py-1 rounded-full">{item.category}</span>
                           </div>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
};

const TradePanel: React.FC<{ selectedCrypto: CryptoData }> = ({ selectedCrypto }) => {
     const [tradeType, setTradeType] = useState<'buy'|'sell'>('buy');
    return (
        <Card>
            <div className="flex mb-4 border-b border-dark-700">
                <button onClick={() => setTradeType('buy')} className={`px-4 py-2 text-lg font-bold ${tradeType === 'buy' ? 'text-white border-b-2 border-brand-primary' : 'text-gray-text'}`}>Buy</button>
                <button onClick={() => setTradeType('sell')} className={`px-4 py-2 text-lg font-bold ${tradeType === 'sell' ? 'text-white border-b-2 border-brand-primary' : 'text-gray-text'}`}>Sell</button>
            </div>
            <div className="space-y-4">
                <Input label={`Amount (${selectedCrypto.symbol})`} type="number" placeholder="0.00" />
                <Input label="Price (USD)" type="number" value={selectedCrypto.price} readOnly />
                <div className="text-center font-bold text-lg">
                    Total: $0.00
                </div>
                <Button className="w-full text-lg" variant={tradeType === 'buy' ? 'primary' : 'secondary'}>
                    {tradeType === 'buy' ? `Buy ${selectedCrypto.symbol}` : `Sell ${selectedCrypto.symbol}`}
                </Button>
            </div>
        </Card>
    );
}

const DashboardPage: React.FC = () => {
    const { logout, userEmail, isCreator } = useAuth();
    const navigate = useNavigate();
    const [selectedCrypto, setSelectedCrypto] = useState<CryptoData>(MOCK_CRYPTO_DATA[0]);
    const [sentiment, setSentiment] = useState<string>('');
    const [isLoadingSentiment, setIsLoadingSentiment] = useState<boolean>(false);
    const [prediction, setPrediction] = useState<string>('');
    const [isLoadingPrediction, setIsLoadingPrediction] = useState<boolean>(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
    const [newsSummary, setNewsSummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    const [timeRange, setTimeRange] = useState('1M');
    const [chartData, setChartData] = useState<{name: string; price: number}[]>([]);

    const generateHistoricalData = (basePrice: number, points: number, interval: 'day' | 'week' | 'month'): { name: string; price: number }[] => {
        const data = [];
        let price = basePrice;
        
        const getVolatility = () => {
            switch(interval) {
                case 'day': return 0.03;
                case 'week': return 0.07;
                case 'month': return 0.15;
            }
        }
        const volatility = getVolatility();

        for (let i = 0; i < points; i++) {
            const date = new Date();
            if (interval === 'day') date.setDate(date.getDate() - i);
            if (interval === 'week') date.setDate(date.getDate() - (i * 7));
            if (interval === 'month') date.setMonth(date.getMonth() - i);
            
            data.push({ name: date.toISOString().split('T')[0], price: parseFloat(price.toFixed(2)) });
            
            const randomChange = (Math.random() - 0.49) * volatility;
            price = price / (1 + randomChange);
        }
        
        return data.reverse();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    useEffect(() => {
        const fetchAIData = async () => {
            setIsLoadingSentiment(true);
            setIsLoadingPrediction(true);
            const sentimentText = await getMarketSentiment(selectedCrypto.name);
            const predictionText = await getShortTermPrediction(selectedCrypto.name);
            setSentiment(sentimentText);
            setPrediction(predictionText);
            setIsLoadingSentiment(false);
            setIsLoadingPrediction(false);
        };
        fetchAIData();
    }, [selectedCrypto]);

    useEffect(() => {
        const getChartData = () => {
            switch (timeRange) {
                case '7D':
                    return generateHistoricalData(selectedCrypto.price, 7, 'day');
                case '1M':
                    return generateHistoricalData(selectedCrypto.price, 30, 'day');
                case '1Y':
                    return generateHistoricalData(selectedCrypto.price, 52, 'week');
                case '5Y':
                    return generateHistoricalData(selectedCrypto.price, 60, 'month');
                default:
                    return generateHistoricalData(selectedCrypto.price, 30, 'day');
            }
        };
        setChartData(getChartData());
    }, [selectedCrypto, timeRange]);
    
    const handleHeadlineClick = async (article: NewsArticle) => {
        setSelectedNews(article);
        setIsModalOpen(true);
        setIsLoadingSummary(true);
        const summary = await getNewsSummary(article.headline);
        setNewsSummary(summary);
        setIsLoadingSummary(false);
    };

    const formatXAxis = (tickItem: string) => {
      const date = new Date(tickItem);
      switch (timeRange) {
        case '7D':
        case '1M':
          return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        case '1Y':
          return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        case '5Y':
          return date.toLocaleDateString('en-US', { year: 'numeric' });
        default:
          return tickItem;
      }
    };

    const timeRanges = ['7D', '1M', '1Y', '5Y'];

    return (
        <div className="min-h-screen bg-dark-900 text-white">
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedNews?.headline || ''}>
                {isLoadingSummary ? <LoadingSpinner/> : <p className="text-gray-text whitespace-pre-wrap">{newsSummary}</p>}
            </Modal>
            <header className="bg-dark-800 border-b border-dark-700 px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold text-white">
                      AIChainX <span className="text-brand-primary">Dashboard</span>
                    </h1>
                    <nav className="hidden md:flex items-center space-x-6">
                        <span className="font-semibold text-white px-3 py-2 rounded-md bg-dark-700">Overview</span>
                        <Link to="/image-generation" className="font-semibold text-gray-text hover:text-white transition-colors px-3 py-2 rounded-md">Image Generation</Link>
                        {isCreator && (
                            <Link to="/database-viewer" className="flex items-center font-semibold text-gray-text hover:text-white transition-colors px-3 py-2 rounded-md">
                                <DatabaseIcon className="w-4 h-4 mr-2" />
                                Database
                            </Link>
                        )}
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-text hidden md:block">{userEmail}</span>
                    <Button onClick={handleLogout} variant="outline" className="py-2 px-4">Logout</Button>
                </div>
            </header>
            <PriceTicker items={MOCK_CRYPTO_DATA} />

            <main className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Main Content Area */}
                <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Main Chart */}
                    <Card className="lg:col-span-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedCrypto.name} ({selectedCrypto.symbol})</h2>
                                <p className="text-3xl font-bold">${selectedCrypto.price.toLocaleString()}</p>
                                <p className={`text-lg ${selectedCrypto.change24h >= 0 ? 'text-brand-secondary' : 'text-red-500'}`}>
                                    {selectedCrypto.change24h >= 0 ? '+' : ''}{selectedCrypto.change24h.toFixed(2)}% (24h)
                                </p>
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2 bg-dark-700 p-1 rounded-full">
                                {MOCK_CRYPTO_DATA.slice(0, 4).map(crypto => (
                                    <button key={crypto.id} onClick={() => setSelectedCrypto(crypto)} className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedCrypto.id === crypto.id ? 'bg-brand-primary text-white' : 'hover:bg-dark-600'}`}>
                                        {crypto.symbol}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end mb-4">
                           <div className="flex items-center space-x-1 bg-dark-700 p-1 rounded-full">
                                {timeRanges.map(range => (
                                    <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${timeRange === range ? 'bg-brand-primary text-white' : 'text-gray-text hover:bg-dark-600'}`}>
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-96 w-full mb-4">
                           <ResponsiveContainer>
                                <LineChart data={chartData}>
                                    <Tooltip
                                        cursor={{ stroke: '#4A5568', strokeWidth: 1, strokeDasharray: '3 3' }}
                                        contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: '0.5rem' }} 
                                        labelFormatter={formatXAxis}
                                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                                    />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#8B949E" 
                                        tick={{fontSize: 12}} 
                                        tickFormatter={formatXAxis} 
                                        minTickGap={timeRange === '5Y' ? 50 : 20}
                                        padding={{ left: 10, right: 10 }}
                                    />
                                    <YAxis 
                                        domain={['dataMin * 0.98', 'dataMax * 1.02']} 
                                        stroke="#8B949E" 
                                        tick={{fontSize: 12}} 
                                        tickFormatter={(val) => `$${Number(val).toLocaleString(undefined, {notation: 'compact', compactDisplay: 'short'})}`} 
                                        allowDataOverflow={false}
                                        width={60}
                                    />
                                    <Line type="monotone" dataKey="price" stroke="#0A72E0" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <PredictionChip prediction={prediction} isLoading={isLoadingPrediction}/>
                    </Card>

                    <TradePanel selectedCrypto={selectedCrypto} />
                    <NewsFeed onHeadlineClick={handleHeadlineClick} />

                    {/* AI Market Sentiment */}
                    <Card className="lg:col-span-2">
                        <h3 className="text-xl font-bold mb-2">AI Market Sentiment for {selectedCrypto.name}</h3>
                         {isLoadingSentiment ? <LoadingSpinner/> : <p className="text-gray-text">{sentiment}</p> }
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="xl:col-span-1 space-y-6 flex flex-col">
                    <PortfolioOverview/>
                    <div className="flex-grow">
                        <AIAssistant />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;