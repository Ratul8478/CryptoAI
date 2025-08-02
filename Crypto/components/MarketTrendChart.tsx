
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MOCK_MARKET_TREND_DATA } from '../constants';
import Card from './ui/Card';

const MarketTrendChart: React.FC = () => {
  return (
    <Card className="w-full">
        <h3 className="text-xl font-bold mb-4 text-white">Market Trends</h3>
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart
                    data={MOCK_MARKET_TREND_DATA}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                    <XAxis dataKey="name" stroke="#8B949E" />
                    <YAxis yAxisId="left" stroke="#8B949E" />
                    <YAxis yAxisId="right" orientation="right" stroke="#8B949E" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#161B22',
                            borderColor: '#30363D',
                            color: '#FFFFFF'
                        }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="BTC" stroke="#F7931A" strokeWidth={2} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="ETH" stroke="#627EEA" strokeWidth={2} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </Card>
  );
};

export default MarketTrendChart;
