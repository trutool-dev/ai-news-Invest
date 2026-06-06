import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini with requirements
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Endpoint 1: Active Interactive Chat with the AI Stock Analyst
app.post("/api/analyze", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "El mensaje es requerido" });
    }

    const systemInstruction = 
      "Eres 'InvestIA', un analista financiero sénior experto en el ecosistema mundial de Inteligencia Artificial y tecnología bursátil. " +
      "Tu estilo de comunicación está alineado con la filosofía de Apple: sofisticado, limpio, minimalista, directo, " +
      "pero sumamente inspirador y riguroso.\n" +
      "Analizas las acciones del sector de IA (NVIDIA: NVDA, Microsoft: MSFT, Alphabet: GOOGL, Apple: AAPL, AMD, TSMC, ASML, Amazon). " +
      "Proporcionas respuestas estructuradas con títulos sobrios, datos claros (puedes simular un análisis de valor fundamentado razonable basado en el estado actual de 2026), " +
      "y recomendaciones estratégicas cortas.\n" +
      "Usa formato Markdown elegante. Destaca palabras clave en negrita de forma sutil. Responde siempre en español.";

    // Convert history format to text-prompt style or chat context
    const chatContext = history && history.length > 0 
      ? history.map((h: any) => `${h.role === 'user' ? 'Usuario' : 'Analista'}: ${h.text}`).join("\n")
      : "";

    const fullPrompt = `${systemInstruction}\n\nHistorial de conversación:\n${chatContext}\n\nNueva consulta del usuario: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Error al procesar el análisis con IA" });
  }
});

// Endpoint 2: Generate dynamic weekly investment/market executive report based on stock context
app.post("/api/generate-market-report", async (req, res) => {
  try {
    const { stock, newsContext } = req.body;
    
    const prompt = 
      `Eres un analista financiero sénior en tecnología. Genera un INFORME EJECUTIVO PREMIUM sobre el impacto de la IA en la compañía o sector: "${stock || 'Sector IA General'}".\n\n` +
      `Usa este contexto de noticias recientes si es aplicable: ${JSON.stringify(newsContext || '')}\n\n` +
      `Tu informe debe ser extremadamente elegante, sofisticado e inspirador. Estilo corporativo de Apple, limpio y sin rodeos. Estructúralo de la siguiente manera usando Markdown:\n\n` +
      `## 1. PERSPECTIVA DE VALOR\n` +
      `Sintetiza la tesis de inversión de este activo en el ecosistema de IA actual (mediados de 2026). ¿Por qué es vital hoy?\n\n` +
      `## 2. HITOS TECNOLÓGICOS Y CATALIZADORES\n` +
      `Describe 2 desarrollos o productos clave de esta semana/mes que impulsan su valuación.\n\n` +
      `## 3. VALORACIÓN Y FILOSOFÍA DE MERCADO\n` +
      `Presenta una perspectiva o métricas financieras simuladas realistas para 2026 sobre su posición frente a competidores directos y si se considera sobrevalorado o una oportunidad sólida a largo plazo.\n\n` +
      `Responde en español, mantén un tono de voz maduro, profesional y sobrio.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ report: response.text });
  } catch (error: any) {
    console.error("Gemini Market Report Error:", error);
    res.status(500).json({ error: error.message || "Error al generar el reporte ejecutivo de mercado" });
  }
});

// Initialize Express + Vite Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
