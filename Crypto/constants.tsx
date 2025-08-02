
import React from 'react';
import type { CryptoData, Testimonial, PortfolioHolding } from './types';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Mock data for crypto prices
export const MOCK_CRYPTO_DATA: CryptoData[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 68123.45, change24h: 2.5, marketCap: 1340000000000, logo: 'https://img.icons8.com/fluency/48/bitcoin.png', sparkline: [10, 15, 12, 18, 20, 25, 22] },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3545.67, change24h: -1.2, marketCap: 425000000000, logo: 'https://img.icons8.com/fluency/48/ethereum.png', sparkline: [20, 18, 22, 19, 25, 23, 28] },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 165.89, change24h: 5.8, marketCap: 76000000000, logo: 'https://img.icons8.com/fluency/48/solana.png', sparkline: [5, 8, 6, 9, 12, 10, 15] },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 0.52, change24h: 0.3, marketCap: 28000000000, logo: 'https://img.icons8.com/fluency/48/ripple.png', sparkline: [12, 13, 11, 14, 13, 15, 14] },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.45, change24h: -0.5, marketCap: 16000000000, logo: 'https://img.icons8.com/fluency/48/cardano.png', sparkline: [8, 7, 9, 8, 10, 9, 11] },
];

export const MOCK_PORTFOLIO_DATA: PortfolioHolding[] = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', amount: 0.5, value: 34061.73, logo: 'https://img.icons8.com/fluency/48/bitcoin.png' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', amount: 10, value: 35456.70, logo: 'https://img.icons8.com/fluency/48/ethereum.png' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', amount: 100, value: 16589.00, logo: 'https://img.icons8.com/fluency/48/solana.png' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', amount: 10000, value: 4500.00, logo: 'https://img.icons8.com/fluency/48/cardano.png' },
];


export const MOCK_MARKET_TREND_DATA = [
    { name: 'Jan', BTC: 41000, ETH: 2200 },
    { name: 'Feb', BTC: 45000, ETH: 2500 },
    { name: 'Mar', BTC: 52000, ETH: 3100 },
    { name: 'Apr', BTC: 61000, ETH: 3500 },
    { name: 'May', BTC: 58000, ETH: 3200 },
    { name: 'Jun', BTC: 68000, ETH: 3600 },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
    { name: 'Alex Johnson', role: 'Day Trader', quote: "CryptoAI Trader has revolutionized my strategy. The AI insights are incredibly accurate and give me a real edge.", avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', tradingStyle: 'Aggressive day trader focusing on high-volume, short-term volatility in BTC and ETH.' },
    { name: 'Samantha Lee', role: 'Long-Term Investor', quote: "As a beginner, this platform was a lifesaver. It's so easy to use, and the AI assistant guided me through my first trades.", avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', tradingStyle: 'Conservative long-term holder, primarily investing in blue-chip assets like Bitcoin and Ethereum using a dollar-cost averaging strategy.' },
    { name: 'Michael Chen', role: 'DeFi Specialist', quote: "The security features are top-notch. I feel completely safe managing my assets here. Plus, the tech is just brilliant.", avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', tradingStyle: 'A DeFi power user who actively seeks high-yield opportunities in staking, liquidity pools, and new L2 protocols.' },
    { name: 'Isabella Garcia', role: 'Quant Analyst', quote: "The API access and real-time data feeds are unparalleled. My quantitative models have never performed better.", avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', tradingStyle: 'Quantitative analyst who develops and backtests automated trading algorithms based on technical indicators and market data.' },
    { name: 'David Kim', role: 'Crypto Researcher', quote: "I rely on the AI news summaries to stay ahead of the curve. It's the fastest way to digest market-moving information.", avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d', tradingStyle: 'A fundamental analyst who researches emerging projects, tokenomics, and long-term blockchain trends to find undervalued altcoins.' },
    { name: 'Maria Rodriguez', role: 'Swing Trader', quote: "The charting tools combined with AI predictions help me identify perfect entry and exit points for my swing trades.", avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709d', tradingStyle: 'A swing trader who holds positions for several days to weeks, capitalizing on market trends using a combination of technical and sentiment analysis.' },
];
