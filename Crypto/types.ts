
export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  logo: string;
  sparkline: number[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
  tradingStyle: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface PortfolioHolding {
  id:string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  logo: string;
}

export interface NewsArticle {
  headline: string;
  category: string;
  summary?: string;
}

export interface OtpResponse {
    otp: string;
    body: string;
}