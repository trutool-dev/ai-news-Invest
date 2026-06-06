import { NewsArticle, StockData } from "./types";

export const WEEKLY_ARTICLES: NewsArticle[] = [
  {
    id: "art-1",
    title: "La era de la computación distribuida: El despliegue global de la arquitectura Blackwell Ultra de NVIDIA",
    source: "Bloomberg Technology",
    date: "4 de Junio, 2026",
    category: "Hardware",
    badge: "Destacado Especial",
    abstract: "El primer lote de servidores que incorporan chips Blackwell Ultra ha comenzado su distribución masiva a los hyperscalers, aliviando el cuello de botella físico de entrenamiento de modelos agenticos multinodo.",
    content: "La entrega oficial de los aceleradores Blackwell Ultra marca un hito sustancial en la carrera del hardware. Fuentes de TSMC indican un rendimiento de producción que finalmente iguala la demanda hiperbólica de Microsoft, Meta y Amazon Web Services. Este avance promete reducir los costos energéticos de computación por token en aproximadamente un 42% en comparación con la iteración Hopper precedente, permitiendo el entrenamiento de redes neuronales autorregresivas complejas con miles de miles de millones de parámetros concurrentes y abriendo las puertas a la autonomía real en la robótica de consumo.",
    readTime: "5 min de lectura",
    isFeatured: true,
    sentiment: "Bullish"
  },
  {
    id: "art-2",
    title: "La Comisión de Valores de EE.UU. flexibiliza las normativas de 'Soberanía de Datos' para centros de datos verdes",
    source: "Financial Times",
    date: "5 de Junio, 2026",
    category: "Regulación",
    badge: "Tendencia Regulatoria",
    abstract: "Un nuevo marco regulatorio incentiva financieramente el suministro eléctrico de origen 100% nuclear y termodinámico cerrado para las granjas de cómputo en la costa este estadounidense.",
    content: "El organismo federal ha decretado que las compañías que demuestren autosuficiencia energética limpia recibirán exenciones impositivas de hasta el 18%. Esta reestructuración ha catapultado de inmediato la inversión bursátil en generadoras de energía modular pequeña y servicios de mantenimiento nuclear, forzando a gigantes de software a repensar su matriz operativa en el mediano plazo.",
    readTime: "4 min de lectura",
    sentiment: "Bullish"
  },
  {
    id: "art-3",
    title: "La redefinición de Interfaces: El avance de los agentes multimodales nativos autónomos en dispositivos locales",
    source: "The Verge",
    date: "3 de Junio, 2026",
    category: "Modelos",
    badge: "Artículo Inteligente",
    abstract: "La integración directa de microchips de redes neuronales híbridas en los últimos procesadores para computadoras portátiles desata la migración masiva de IA desde la nube al hardware del cliente.",
    content: "Se consolida la mudanza. El procesamiento en el dispositivo (on-device) para tareas de síntesis, redacción técnica y automatización de flujos ya no requiere conectividad constante. Esto no solo mitiga drásticamente las preocupaciones sobre la privacidad de la información corporativa, sino que reduce la latencia de respuesta de los asistentes digitales a niveles de milisegundos. Analistas proyectan que en 2026 se observará un declive en las suscripciones de servicios en la nube puros en favor de hardware premium especializado.",
    readTime: "6 min de lectura",
    sentiment: "Neutral"
  },
  {
    id: "art-4",
    title: "Consolidación de capitales: Fondos de Venture Capital dirigen su foco exclusivamente a startups de infraestructura y robótica humana",
    source: "TechCrunch",
    date: "2 de Junio, 2026",
    category: "Finanzas",
    badge: "Mercados & Capital",
    abstract: "El fin del hype por envoltorios básicos (wrappers) de API acelera el flujo de financiación de riesgo hacia la cadena de suministro física y la integración robótica de fábricas automotrices.",
    content: "Las rondas de serie A y B para utilidades de software superficiales han disminuido un 65% interanual. Por el contrario, los proyectos de fundición, diseño de actuadores y microchips especializados han visto un incremento sin precedentes de 9,200 millones de dólares de flujo libre durante esta semana de junio. Los inversores exigen retornos sostenibles respaldados por propiedad intelectual patentada y viabilidad física tangible.",
    readTime: "4 min de lectura",
    sentiment: "Bearish"
  },
  {
    id: "art-5",
    title: "El auge de la robótica asistencial doméstica e industrial con inteligencia encarnada",
    source: "Wired",
    date: "1 de Junio, 2026",
    category: "General",
    badge: "Innovación",
    abstract: "Tres nuevos fabricantes han completado satisfactoriamente pruebas piloto en plantas automotrices de Baviera, demostrando adaptabilidad sin programación algorítmica y reducción del 90% en tiempos de adaptación de operarios.",
    content: "La robótica de propósito general ya no pertenece a la ciencia ficción. Mediante la carga de modelos de lenguaje-acción masivos acoplados a extremidades con sensores de retroalimentación de fuerza háptica avanzada, las máquinas humanas realizan soldaduras, empaques y tareas de inspección fina de manera natural. El sector experimenta una de las expansiones comerciales más dinámicas desde el nacimiento de los smartphones.",
    readTime: "7 min de lectura",
    sentiment: "Bullish"
  }
];

export const AI_STOCKS: StockData[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 1184.25,
    change: 38.20,
    changePercent: 3.33,
    marketCap: "2.91T USD",
    peRatio: "62.4x",
    aiWeight: "Dominio de Hardware de Cómputo",
    sentiment: "Optimista",
    sparkline: [1120, 1145, 1125, 1162, 1150, 1170, 1184.25],
    aiDrivers: ["Chips Blackwell Ultra", "Interconexiones NVLink de quinta generación", "Plataformas NIMS de IA generativa lista para desplegar"]
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 438.10,
    change: 5.40,
    changePercent: 1.25,
    marketCap: "3.26T USD",
    peRatio: "34.1x",
    aiWeight: "Infraestructura Cloud y Software de Productividad",
    sentiment: "Optimista",
    sparkline: [430, 432, 428, 435, 431, 436, 438.10],
    aiDrivers: ["Azure AI Cloud", "Integración masiva de Copilot en Office", "Asociación preferencial y de capital con OpenAI"]
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 179.35,
    change: 3.65,
    changePercent: 2.08,
    marketCap: "2.22T USD",
    peRatio: "25.8x",
    aiWeight: "Algoritmos multimodales e IA de Consumo",
    sentiment: "Neutral",
    sparkline: [173, 175, 174, 177, 175, 178, 179.35],
    aiDrivers: ["Familia de Modelos Gemini 3.5", "Chips de Inteligencia Cloud TPU v6", "Evolución del Buscador con Gemini Search SGE"]
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 212.80,
    change: 9.30,
    changePercent: 4.57,
    marketCap: "3.21T USD",
    peRatio: "29.2x",
    aiWeight: "IA en el Borde y Hardware de Consumo Inteligente",
    sentiment: "Optimista",
    sparkline: [198, 202, 201, 205, 204, 210, 212.80],
    aiDrivers: ["Apple Intelligence 2.0 integrado en macOS/iOS", "Procesadores serie M5 con NPU optimizadas", "Nube privada de procesamiento seguro con chips de silicio propio"]
  },
  {
    symbol: "TSMC",
    name: "Taiwan Semiconductor Mfg.",
    price: 168.90,
    change: 4.80,
    changePercent: 2.93,
    marketCap: "875.4B USD",
    peRatio: "28.5x",
    aiWeight: "Capacidad Única de Fundición de Silicio Avanzado",
    sentiment: "Optimista",
    sparkline: [160, 163, 161, 164, 165, 167, 168.90],
    aiDrivers: ["Monopolio en el grabado de fotolitografía a 2nm y 3nm", "Infraestructura de empaquetado CoWoS avanzado", "Contratos exclusivos con NVIDIA, Apple y AMD"]
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices",
    price: 154.60,
    change: -1.85,
    changePercent: -1.18,
    marketCap: "249.5B USD",
    peRatio: "42.1x",
    aiWeight: "Alternativas Eficientes en Cómputo de Centros de Datos",
    sentiment: "Cauto",
    sparkline: [160, 158, 159, 157, 155, 156, 154.60],
    aiDrivers: ["Procesadores Instinct MI325X y línea MI350", "Arquitectura abierta ROCm de optimización de software", "Procesadores de Laptop Ryzen AI con NPU de 50 TOPS"]
  }
];

export const GENERAL_AI_STATS = {
  weeklyVolumeChange: "+14.8%",
  totalAiMarketCap: "14.2T USD",
  indexTrend: "Fuertemente Alcista",
  dominantStock: "NVDA / AAPL",
  analystSummary: "El mercado bursátil está transicionando desde un modelo especulativo basado puramente en anuncios hacia una rigurosa tasación de flujos de caja reales de hardware de infraestructura y robótica. Las valuaciones de empresas que controlan silicio y centros de datos físicos siguen expandiéndose, mientras que las de agregados puramente de software muestran volatilidad."
};
