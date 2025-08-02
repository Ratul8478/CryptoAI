
import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { MOCK_CRYPTO_DATA } from '../constants';
import type { CryptoData } from '../types';

const CryptoPriceWidget: React.FC = () => {
  const data = MOCK_CRYPTO_DATA.slice(0, 4); // Show top 4

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      {data.map((crypto) => (
        <div key={crypto.id} className="bg-dark-800 border border-dark-700 rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:border-brand-primary hover:scale-105">
          <div className="flex items-center space-x-4">
            <img src={crypto.logo} alt={`${crypto.name} logo`} className="w-10 h-10" />
            <div>
              <p className="font-bold text-lg">{crypto.symbol}</p>
              <p className="text-sm text-gray-text">{crypto.name}</p>
            </div>
          </div>
          <div className="text-right">
             <p className="font-semibold">${crypto.price.toLocaleString()}</p>
             <p className={`text-sm ${crypto.change24h >= 0 ? 'text-brand-secondary' : 'text-red-500'}`}>
                {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
             </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CryptoPriceWidget;
