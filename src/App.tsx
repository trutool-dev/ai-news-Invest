import React, { useState, useEffect, useRef } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Newspaper, 
  Search, 
  Sparkles, 
  Cpu, 
  Coins, 
  Activity, 
  ChevronRight, 
  X, 
  ArrowUpRight, 
  ArrowRight, 
  Clock, 
  MessageSquare, 
  Send, 
  RefreshCw, 
  FileText, 
  Check, 
  ArrowUp,
  Sliders,
  DollarSign,
  Building,
  ExternalLink,
  ShieldCheck,
  Zap
} from "lucide-react";
import { WEEKLY_ARTICLES, AI_STOCKS, GENERAL_AI_STATS } from "./data";
import { NewsArticle, StockData, ChatMessage } from "./types";

export default function App() {
  // Navigation & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  
  // Selection states
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockData>(AI_STOCKS[0]);
  
  // AI report states (Backend API)
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [generatingForStock, setGeneratingForStock] = useState<string>("");

  // Chat/Analyst states (Backend API)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      text: "Hola, soy InvestIA. Analizo el ecosistema de inteligencia artificial, tendencias tecnológicas y el desempeño de los principales activos tecnológicos de Wall Street. ¿Qué activo, noticia o catalizador de esta semana te gustaría discutir hoy?",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  // Auto-generate a report for the default stock (NVIDIA) on mount
  useEffect(() => {
    handleGenerateReport(AI_STOCKS[0]);
  }, []);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Categories list
  const categories = ["Todos", "Modelos", "Hardware", "Regulación", "Finanzas", "General"];

  // Normalize strings for accurate and accented diacritic queries (e.g. "regulación" and "regulacion" are equivalent)
  const normalizeStr = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Filter Articles
  const filteredArticles = WEEKLY_ARTICLES.filter(article => {
    const matchesCategory = selectedCategory === "Todos" || article.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchTerm.trim()) return true;

    // Split by space to support multi-word search (AND behavior for high accuracy)
    const searchWords = searchTerm.trim().split(/\s+/).map(w => normalizeStr(w));
    const articleText = normalizeStr(`${article.title} ${article.abstract} ${article.content} ${article.source} ${article.category}`);

    // Every search word typed by the user must be found inside the article
    return searchWords.every(word => articleText.includes(word));
  });

  const featuredArticle = WEEKLY_ARTICLES.find(a => a.isFeatured) || WEEKLY_ARTICLES[0];

  // Callback to request AI Report from Express Backend
  const handleGenerateReport = async (stock: StockData) => {
    setLoadingReport(true);
    setAiReport(null);
    setGeneratingForStock(stock.symbol);

    try {
      const response = await fetch("/api/generate-market-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          stock: `${stock.name} (${stock.symbol})`,
          newsContext: WEEKLY_ARTICLES.filter(a => a.sentiment === "Bullish" || a.sentiment === "Bearish")
        })
      });

      if (!response.ok) {
        throw new Error("Respuesta de servidor fallida");
      }

      const data = await response.json();
      setAiReport(data.report || "No se ha podido generar el reporte.");
    } catch (error) {
      console.error(error);
      setAiReport(
        `### PERSPECTIVA DE VALOR\n**${stock.name}** se mantiene como líder en el vector tecnológico de **${stock.aiWeight}**. La demanda masiva sigue impulsando su negocio.\n\n` +
        `### HITOS TECNOLÓGICOS Y CATALIZADORES\n- **Catalizador Primario:** ${stock.aiDrivers[0]}\n- **Seguimiento:** ${stock.aiDrivers[1] || 'Integración e infraestructura cloud.'}\n\n` +
        `### VALORACIÓN Y FILOSOFÍA DE MERCADO\nEl activo cotiza a una relación P/E de **${stock.peRatio}**, lo que refleja altas expectativas. Nuestra recomendación actual es **${stock.sentiment}** basado en la consistencia de sus retornos recurrentes en 2026.\n\n*(Nota: Este reporte sintetizado es el modelo de respaldo estándar de la aplicación)*`
      );
    } finally {
      setLoadingReport(false);
    }
  };

  // Helper to format currency
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  };

  // Callback to request Chat message analysis
  const handleSendMessage = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customPrompt || chatInput;
    if (!promptToSend.trim() || loadingChat) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: promptToSend,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setChatInput("");
    setLoadingChat(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptToSend,
          history: chatMessages.slice(-6).map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error("Error en servidor");
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `assist-${Date.now()}`,
        role: "assistant",
        text: data.text || "Lo siento, no pude procesar la consulta en este momento.",
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      
      const assistantMsg: ChatMessage = {
        id: `assist-${Date.now()}`,
        role: "assistant",
        text: `Disculpa el inconveniente financiero, pero en este momento no puedo establecer conexión directa con nuestro sistema de análisis predictivo Gemini. Sin embargo, analizando el comportamiento de los activos de IA, te sugiero poner especial atención a la cadena de suministro de hardware y litografía de **TSMC** junto con el despliegue de **Blackwell de NVIDIA**, que siguen actuando como los verdaderos cimientos del mercado bursátil en 2026.`,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, assistantMsg]);
    } finally {
      setLoadingChat(false);
    }
  };

  // Sparkline SVG generator
  const renderSparkline = (data: number[], isPositive: boolean) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const width = 80;
    const height = 30;
    
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      // Invert Y axis for charts
      const y = height - ((val - min) / (range || 1)) * (height - 8) - 4;
      return `${x},${y}`;
    }).join(" ");

    const color = isPositive ? "#34C759" : "#FF3B30"; // Apple colors

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans selection:bg-neutral-200">
      
      {/* Sleek Apple-inspired top Nav wrapper */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-150 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-black animate-pulse" />
            <span className="font-display font-semibold text-sm tracking-tight text-black">
              AI.Weekly
            </span>
          </div>
          
          <div className="hidden md:flex gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            <a href="#destacado" className="hover:text-black transition-colors">Noticias</a>
            <a href="#tendencias" className="hover:text-black transition-colors">Tendencias</a>
            <a href="#mercados" className="hover:text-black transition-colors">Inversión</a>
            <a href="#investia" className="hover:text-black transition-colors">InvestIA</a>
          </div>

          <div className="flex items-center space-x-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            <span>Edición: Junio 2026</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* Apple Style Typographic Hero Headliner */}
        <section className="text-left md:text-center pt-8 pb-4 space-y-3 max-w-4xl mx-auto border-b border-gray-100 pb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
            Resumen de Vanguardia Bursátil
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-black tracking-tight leading-[1.1]">
            La Inteligencia del Mañana. <br />
            <span className="text-[#1e1e1e] font-light">En tiempo real en el mercado.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 font-light max-w-2xl mx-auto">
            Explora de manera limpia y estructurada los catalizadores de software de IA, el hardware que sostiene el cómputo mundial y el pulso del mercado tecnológico de consumo.
          </p>
        </section>

        {/* BENTO GRID: Hero Featured Article + Quick Stats */}
        <section id="destacado" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main big featured card left (2 cols on large screen) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-apple flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="p-8 sm:p-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 font-sans">
                  {featuredArticle.badge}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-sans">{featuredArticle.date}</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.15] text-black font-sans">
                  {featuredArticle.title}
                </h2>
                <p className="text-gray-500 font-light text-base leading-relaxed">
                  {featuredArticle.abstract}
                </p>
              </div>

              <div className="inline-flex items-center space-x-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                <Clock className="w-3 pb-0.5 text-gray-500" />
                <span>{featuredArticle.readTime}</span>
                <span className="mx-1">•</span>
                <span>Origen:</span>
                <span className="text-black font-bold">{featuredArticle.source}</span>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-100 p-6 sm:px-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Perspectiva Sectorial:</span>
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  featuredArticle.sentiment === "Bullish" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                    : featuredArticle.sentiment === "Bearish" 
                    ? "bg-red-50 text-red-700 border-red-100"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}>
                  {featuredArticle.sentiment === "Bullish" ? "Alcista (Bullish)" : featuredArticle.sentiment === "Bearish" ? "Bajista (Bearish)" : "Neutral"}
                </span>
              </div>

              <button 
                id="btn-read-featured"
                onClick={() => setSelectedArticle(featuredArticle)}
                className="inline-flex items-center space-x-1 hover:text-blue-600 transition-colors text-[11px] font-bold uppercase tracking-[0.15em] cursor-pointer group"
              >
                <span>Leer Análisis Completo</span>
                <ChevronRight className="w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quick Metrics right card (1 col on large screen) */}
          <div className="bg-black text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-neutral-900 shadow-apple relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 bg-indigo-500/10 rounded-full blur-2xl"></div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-gray-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Resumen Semanal</span>
                </div>
                <Zap className="h-4 w-4 text-emerald-400 animate-bounce" />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Capitalización Sectorial Est.</p>
                  <p className="text-3xl font-semibold tracking-tight">{GENERAL_AI_STATS.totalAiMarketCap}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Volumen Semanal</p>
                    <p className="text-lg font-bold text-emerald-400">{GENERAL_AI_STATS.weeklyVolumeChange}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Tendencia General</p>
                    <p className="text-[10px] font-bold uppercase px-2.5 py-0.5 mt-1 bg-emerald-950/40 text-emerald-400 border border-emerald-900 rounded-full inline-block leading-none">
                      {GENERAL_AI_STATS.indexTrend}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10 border-t border-neutral-900 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Activos de Mayor Flujo:</p>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                {GENERAL_AI_STATS.analystSummary.substring(0, 150)}...
              </p>
              <a 
                href="#mercados" 
                className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-white pt-2 transition-colors"
              >
                <span>Explorar Tickers</span>
                <ArrowRight className="w-3" />
              </a>
            </div>
          </div>

        </section>

        {/* MAIN EXPLORER: Curated News Stream on Left, Live Stocks Bento Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* News Stream Column (7/12 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-4">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-black font-sans">
                  Archivo de Tendencias
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mt-1">
                  Filtrado por relevancia técnica y sentimiento de mercado
                </p>
              </div>

              {/* Pure Elegant Apple-style Category badging */}
              <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-xl border border-gray-100 self-start sm:self-center overflow-x-auto max-w-full">
                <Sliders className="w-3 text-gray-400 mx-2" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.12em] transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat 
                        ? "bg-white text-black shadow-xs font-bold" 
                        : "text-gray-400 hover:text-black"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

             {/* Simple Elegant Search Bar */}
            <div className="relative" id="trending-search-bar-container">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 font-sans" />
              <input
                id="trending-search-input"
                type="text"
                placeholder="Buscar por chips, agentes, regulación, Blackwell..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-150 rounded-xl py-3 pl-10 pr-28 text-[11px] font-medium placeholder:text-gray-400 focus:outline-hidden focus:ring-1 focus:ring-black transition-all shadow-3xs text-black"
              />
              <div className="absolute right-3.5 top-2.5 flex items-center space-x-2 h-7" id="search-bar-actions">
                {searchTerm && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md" id="search-results-badge">
                    {filteredArticles.length} {filteredArticles.length === 1 ? 'coincidencia' : 'coincidencias'}
                  </span>
                )}
                {searchTerm && (
                  <button 
                    id="clear-search-button"
                    onClick={() => setSearchTerm("")}
                    className="text-gray-400 hover:text-black hover:bg-gray-100 p-1 rounded-full text-xs cursor-pointer transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Articles List */}
            <div className="space-y-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                  <div 
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-apple hover:border-gray-250 transition-all cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em]">
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-600 font-sans">{article.source}</span>
                          <span className="text-gray-300 font-normal font-sans">•</span>
                          <span className="text-gray-400 font-sans">
                            {article.category}
                          </span>
                        </div>
                        <span className="text-gray-400 font-sans">{article.date}</span>
                      </div>

                      <h4 className="text-base font-semibold text-black leading-snug group-hover:text-blue-600 transition-colors font-sans">
                        {article.title}
                      </h4>
                      
                      <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-2">
                        {article.abstract}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3.5 border-t border-gray-50 text-[10px] font-bold uppercase tracking-[0.15em]">
                      <span className="text-gray-400">{article.readTime}</span>
                      
                      <div className="flex items-center space-x-3.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm border ${
                          article.sentiment === "Bullish" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : article.sentiment === "Bearish" 
                            ? "bg-red-50 text-red-750 border-red-100"
                            : "bg-gray-50 text-gray-500 border-gray-150"
                        }`}>
                          {article.sentiment === "Bullish" ? "Bullish" : article.sentiment === "Bearish" ? "Bearish" : "Neutral"}
                        </span>
                        
                        <span className="inline-flex items-center text-black group-hover:translate-x-1 transition-transform">
                          <span>Analizar</span>
                          <ChevronRight className="w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-2 shadow-apple">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-black">No se encontraron artículos</p>
                  <p className="text-xs text-gray-400 font-light">Intenta utilizar otros términos de búsqueda o una categoría diferente.</p>
                </div>
              )}
            </div>

          </div>

          {/* Markets Index list right (5/12 cols) */}
          <div id="mercados" className="lg:col-span-5 space-y-6 lg:sticky lg:top-16">
            
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 space-y-6 shadow-apple">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-black font-sans">
                    Mercado de Inversiones de IA
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mt-1">
                    Selecciona un activo para generar reportes con IA
                  </p>
                </div>
                <Coins className="text-black w-5 h-5" />
              </div>

              {/* Clean custom interactive table list */}
              <div className="space-y-3">
                {AI_STOCKS.map(stock => {
                  const isPositive = stock.change >= 0;
                  const isSelected = selectedStock.symbol === stock.symbol;

                  return (
                    <div
                      key={stock.symbol}
                      onClick={() => {
                        setSelectedStock(stock);
                        handleGenerateReport(stock);
                      }}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-250 cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? "bg-black text-white border-black shadow-lg scale-[1.01]" 
                          : "bg-white text-black border-gray-100 hover:border-gray-300 shadow-3xs"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold leading-none ${
                          isSelected ? "bg-white/10 text-white" : "bg-gray-50 text-black border border-gray-100"
                        }`}>
                          {stock.symbol}
                        </div>
                        <div>
                          <p className="text-xs font-bold tracking-tight">{stock.name}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-wider leading-none mt-0.5 ${isSelected ? "text-gray-400" : "text-gray-400"}`}>
                            {stock.aiWeight}
                          </p>
                        </div>
                      </div>

                      {/* Sparkline & Pricing info */}
                      <div className="flex items-center space-x-3">
                        {/* Elegant Mini Spark widget */}
                        <div className="hidden sm:block">
                          {renderSparkline(stock.sparkline, isPositive)}
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-semibold font-mono">{formatPrice(stock.price)}</p>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm inline-block mt-0.5 leading-none ${
                            isSelected 
                              ? isPositive ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-400/10"
                              : isPositive ? "text-emerald-700 bg-emerald-50" : "text-red-705 bg-red-50"
                          }`}>
                            {isPositive ? "+" : ""}{stock.changePercent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Executive report subcomponent loaded via API */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 sm:p-6 space-y-4 shadow-3xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
                      Análisis Ejecutivo: {selectedStock.symbol}
                    </span>
                  </div>

                  {loadingReport ? (
                    <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <RefreshCw className="w-3 animate-spin text-gray-400" />
                      <span>Gemini analizando...</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleGenerateReport(selectedStock)}
                      className="text-[9px] font-bold uppercase tracking-widest bg-white border border-gray-150 hover:border-black rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer text-gray-600 hover:text-black flex items-center space-x-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Actualizar</span>
                    </button>
                  )}
                </div>

                {loadingReport ? (
                  <div className="py-8 space-y-4">
                    <div className="h-3 bg-gray-255 rounded-full animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-255 rounded-full animate-pulse w-5/6"></div>
                    <div className="h-3 bg-gray-255 rounded-full animate-pulse w-2/3"></div>
                    <div className="h-3 bg-gray-255 rounded-full animate-pulse w-1/2"></div>
                  </div>
                ) : aiReport ? (
                  <div className="prose prose-neutral max-w-none text-xs text-black leading-relaxed font-light space-y-4 prose-headings:mt-4">
                    {/* Render plain simple formatting manually to avoid introducing heavier libraries or breaking tags */}
                    {aiReport.split("\n\n").map((block, i) => {
                      if (block.startsWith("##")) {
                        return <h5 key={i} className="font-sans font-bold text-black border-b border-gray-150 pb-1 text-[11px] uppercase tracking-[0.12em]">{block.replace("##", "").trim()}</h5>;
                      } else if (block.startsWith("###")) {
                        return <h6 key={i} className="font-sans font-semibold text-black text-[10px] uppercase tracking-[0.1em]">{block.replace("###", "").trim()}</h6>;
                      } else if (block.startsWith("-")) {
                        return (
                          <ul key={i} className="list-disc pl-4 space-y-1.5 my-1 text-gray-650">
                            {block.split("\n").map((li, j) => (
                              <li key={j}>{li.substring(1).trim()}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={i} className="text-gray-700 leading-relaxed">{block}</p>;
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-6">Haz clic en un activo arriba para obtener recomendaciones.</p>
                )}

                <div className="pt-3.5 border-t border-gray-150 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
                    <ShieldCheck className="w-3.5 text-emerald-600" />
                    <span>Inferencia real por Gemini API</span>
                  </div>
                  <button 
                    onClick={() => {
                      const textToAsk = `¿Cuáles son los principales riesgos de invertir en ${selectedStock.symbol} hoy en día?`;
                      handleSendMessage(undefined, textToAsk);
                      const target = document.getElementById("investia");
                      target?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Preguntar</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ELEGANT INTEGRATED ASSISTANT (InvestIA Console) */}
        <section id="investia" className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-apple">
          <div className="border-b border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black text-white">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="bg-white/10 p-1.5 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-white font-sans">
                  InvestIA: Asistente Analista Inteligente
                </h3>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mt-1.5">
                Investigación en tiempo real impulsada por Gemini API
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleSendMessage(undefined, "¿Estamos en una burbuja de valuaciones de IA en 2026?")}
                className="bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-[0.12em] cursor-pointer transition-colors"
              >
                ¿Burbuja de IA en 2026?
              </button>
              <button 
                onClick={() => handleSendMessage(undefined, "Análisis rápido: NVIDIA contra AMD en chips aceleradores")}
                className="bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-[0.12em] cursor-pointer transition-colors"
              >
                NVIDIA vs AMD
              </button>
              <button 
                onClick={() => handleSendMessage(undefined, "Explicación breve de la Ley Europea de IA y manufactura de semiconductores")}
                className="bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-[0.12em] cursor-pointer transition-colors"
              >
                Ley de IA impacto
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            
            {/* Quick guide prompts on Left */}
            <div className="p-6 sm:p-8 bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-100 space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                Directivas de Consulta
              </h4>
              
              <ul className="space-y-4 text-xs font-light text-gray-500">
                <li className="flex items-start space-x-2.5">
                  <div className="bg-gray-200 text-black text-[9px] font-bold h-4.5 w-4.5 rounded-md flex items-center justify-center mt-0.5 shrink-0">1</div>
                  <span className="leading-relaxed">Pregunta sobre balances de ganancias trimestrales o métricas de valuación de empresas de IA.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <div className="bg-gray-200 text-black text-[9px] font-bold h-4.5 w-4.5 rounded-md flex items-center justify-center mt-0.5 shrink-0">2</div>
                  <span className="leading-relaxed">Consulta el impacto de la cadena de suministro o desarrollos de microchips avanzados en Wall Street.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <div className="bg-gray-200 text-black text-[9px] font-bold h-4.5 w-4.5 rounded-md flex items-center justify-center mt-0.5 shrink-0">3</div>
                  <span className="leading-relaxed">Solicita análisis de sinergias operacionales globales entre Hyperscalers y fundidoras de semiconductores.</span>
                </li>
              </ul>

              <div className="pt-6 border-t border-gray-100 space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Seguridad del Sistema</p>
                <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                  Toda la inferencia se procesa de manera privada a través de llamadas seguras asíncronas de servidor.
                </p>
              </div>
            </div>

            {/* Live Chat component on Right (makes up 2 cols) */}
            <div className="lg:col-span-2 flex flex-col h-[400px] justify-between">
              
              {/* Chat feed */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-white">
                {chatMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? "bg-black text-white rounded-br-none shadow-3xs"
                        : "bg-gray-50 text-black rounded-bl-none border border-gray-100 shadow-3xs"
                    }`}>
                      <p className="font-light whitespace-pre-line">{msg.text}</p>
                      <span className="block text-[8px] opacity-40 text-right mt-1.5 font-mono">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                
                {loadingChat && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 border border-gray-100 text-gray-500 rounded-2xl rounded-bl-none px-4 py-3.5 text-xs flex items-center space-x-2">
                      <RefreshCw className="h-3 w-3 animate-spin text-gray-400" />
                      <span className="font-light">InvestIA está redactando análisis...</span>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef}></div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex items-center bg-gray-50/50 gap-2">
                <input
                  type="text"
                  placeholder="Formula tu consulta sobre inversión, chips, acciones de IA..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={loadingChat}
                  className="flex-1 bg-white border border-gray-150 rounded-xl px-4 py-3 text-xs focus:outline-hidden focus:ring-1 focus:ring-black placeholder:text-gray-450 text-black"
                />
                
                <button
                  type="submit"
                  disabled={loadingChat || !chatInput.trim()}
                  className="bg-black hover:bg-neutral-900 text-white px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] cursor-pointer transition-all disabled:opacity-30 flex items-center space-x-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </form>

            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-gray-150 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-black animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">AI & WallStreet</span>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Portal de análisis y monitoreo financiero que consolida eventos tecnológicos reales para inversores conscientes.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Índices Monitorizados</p>
              <div className="flex flex-wrap gap-1.5">
                {AI_STOCKS.map(s => (
                  <span 
                    key={s.symbol}
                    className="text-[9px] bg-gray-50 hover:bg-gray-100 border border-gray-150 font-bold uppercase tracking-wider text-black rounded-lg px-2.5 py-1 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedStock(s);
                      handleGenerateReport(s);
                      document.getElementById("mercados")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {s.symbol}: {s.sentiment}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Nota de Descargo</p>
              <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                El contenido de esta plataforma tiene propósitos informativos y didácticos de demostración bursátil. No constituye bajo ninguna circunstancia asesoría de inversión profesional.
              </p>
            </div>

          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-400 font-light gap-4">
            <p>© 2026 AI.Weekly. Todos los derechos reservados. Estilo Clean Minimalism.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">Términos de Uso</a>
              <span>•</span>
              <a href="#" className="hover:underline">Privacidad de Datos</a>
            </div>
          </div>

        </div>
      </footer>

      {/* MODAL / DRAWER DETAIL PANEL FOR ARTICLES */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-end justify-center bg-black/40 backdrop-blur-3xs transition-opacity">
          <div className="bg-white rounded-t-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl relative flex flex-col justify-between">
            
            {/* Modal top bar */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 sm:px-8 py-5 flex items-center justify-between z-10">
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 text-[9px] uppercase tracking-wider text-gray-500 font-bold">
                <span>{selectedArticle.category}</span>
                <span className="mx-1">•</span>
                <span className="text-black">{selectedArticle.sentiment}</span>
              </div>
              <button 
                id="btn-close-article-modal"
                onClick={() => setSelectedArticle(null)}
                className="bg-gray-50 hover:bg-gray-100 text-black p-1.5 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body content */}
            <div className="px-6 sm:px-8 py-8 space-y-6 flex-1">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">{selectedArticle.source}</span>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-black leading-tight font-sans">
                  {selectedArticle.title}
                </h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Publicado el {selectedArticle.date} — {selectedArticle.readTime}</p>
              </div>

              <blockquote className="border-l-2 border-black pl-4 py-1 text-sm text-gray-500 font-light italic leading-relaxed">
                {selectedArticle.abstract}
              </blockquote>

              <div className="prose prose-neutral max-w-none text-sm text-gray-700 font-light leading-relaxed space-y-4">
                {selectedArticle.content.split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
                
                <p>
                  A medida que transcurre el año 2026, la velocidad del ecosistema exige no solo el monitoreo de los modelos matemáticos puros, sino de los recursos tangibles: semiconductores de silicio avanzados, refrigeración por fluido cerrado, derechos de transmisión energética y la infraestructura en el borde (on-device). La diferencia entre las corporaciones líderes y sus retadores radicará inequívocamente en la solidez física de sus activos tangibles.
                </p>
              </div>

              {/* Related Stock info inside article details */}
              {selectedArticle.category === "Hardware" && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-3xs">
                  <div className="flex items-center space-x-2">
                    <Cpu className="text-black w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black">Activo relacionado: NVIDIA (NVDA)</span>
                  </div>
                  <button
                    onClick={() => {
                      const nvda = AI_STOCKS.find(s => s.symbol === "NVDA") || AI_STOCKS[0];
                      setSelectedStock(nvda);
                      handleGenerateReport(nvda);
                      setSelectedArticle(null);
                      document.getElementById("mercados")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[10px] font-bold uppercase tracking-wider text-black hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <span>Ver ticker</span>
                    <ChevronRight className="w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Modal Bottom control panel */}
            <div className="bg-gray-50 border-t border-gray-100 p-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">¿Quieres discutir este artículo?</p>
                <p className="text-xs text-gray-600">Analiza el impacto regulatorio o técnico con InvestIA ahora mismo.</p>
              </div>

              <button
                id="btn-ask-about-article"
                onClick={() => {
                  const askMsg = `Me gustaría que analices la noticia: "${selectedArticle.title}" de la fuente ${selectedArticle.source}. ¿Qué repercusiones financieras tiene para el mercado bursátil?`;
                  handleSendMessage(undefined, askMsg);
                  setSelectedArticle(null);
                  document.getElementById("investia")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-black hover:bg-neutral-900 text-white px-5 py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] cursor-pointer transition-all w-full sm:w-auto text-center"
              >
                Preguntar al Asistente IA
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
