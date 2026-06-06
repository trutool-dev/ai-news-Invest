export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  category: "Modelos" | "Hardware" | "Regulación" | "Finanzas" | "General";
  abstract: string;
  content: string;
  readTime: string;
  isFeatured?: boolean;
  sentiment: "Bullish" | "Neutral" | "Bearish";
  image?: string;
  badge?: string;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: string;
  aiWeight: string; // Brief metric showing AI sector position
  sentiment: "Optimista" | "Neutral" | "Cauto";
  sparkline: number[]; // Sparkline data points
  aiDrivers: string[]; // Core technologies/products driving values
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}
