import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

dotenv.config({ path: ".env.local" });
dotenv.config();

const REQUIRED_ENV_VARS = ["GEMINI_API_KEY"];

function validateEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
    console.error("Please set them in .env.local or your environment.");
    process.exit(1);
  }
}

validateEnv();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = "gemini-3-flash-preview";
const IMAGE_MODEL = "gemini-2.5-flash-image";

const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

function rateLimit(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    next();
    return;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    res.status(429).json({
      success: false,
      error: "Demasiadas solicitudes. Inténtalo de nuevo en un minuto.",
    });
    return;
  }

  entry.count++;
  next();
}

function securityHeaders(
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  next();
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(securityHeaders);
  app.use(express.json({ limit: "1mb" }));

  // ─── API Routes ────────────────────────────────────────────

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      version: "2.0.0",
      timestamp: new Date().toISOString(),
    });
  });

  app.post("/api/analyze-business", rateLimit, async (req, res) => {
    try {
      const { url, description, searchResults } = req.body;

      if (!url && !description) {
        res.status(400).json({
          success: false,
          error: "Se requiere una URL o descripción del negocio.",
        });
        return;
      }

      const prompt = `
        Eres un ingeniero senior de Growth e Inteligencia de Negocio. 
        Analiza el siguiente negocio basándote en su URL, descripción y datos de contexto.
        
        INPUT:
        - URL: ${url || "No proporcionada"}
        - Descripción: ${description || "No proporcionada"}
        - Datos adicionales: ${searchResults || "Contexto genérico"}

        OBJETIVO:
        Generar un informe de Marketing Intelligence de alta fidelidad. Todo en ESPAÑOL.

        IMPORTANTE: Simula un análisis profundo de tecnologías (CMS, Píxeles), presencia en Ads (Facebook/Google) y gaps de SEO.
      `;

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          systemInstruction:
            "Eres un analista de SaaS experto. Responde siempre en JSON válido y en ESPAÑOL.",
          responseMimeType: "application/json",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              empresa: {
                type: Type.OBJECT,
                properties: {
                  nombre: { type: Type.STRING },
                  sector: { type: Type.STRING },
                  localizacion: { type: Type.STRING },
                  resumen: { type: Type.STRING },
                  identidad_visual: { type: Type.STRING },
                  cliente_ideal: { type: Type.STRING },
                },
                required: ["nombre", "sector", "localizacion", "resumen"],
              },
              contacto: {
                type: Type.OBJECT,
                properties: {
                  email: { type: Type.STRING },
                  telefono: { type: Type.STRING },
                  rrss: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
              tecnologia: {
                type: Type.OBJECT,
                properties: {
                  cms: { type: Type.STRING },
                  tracking: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  marketing_automation: { type: Type.STRING },
                  velocidad: { type: Type.STRING },
                  seguridad_ssl: { type: Type.BOOLEAN },
                  cumplimiento_gdpr: { type: Type.STRING },
                },
              },
              senales_crecimiento: {
                type: Type.OBJECT,
                properties: {
                  contratacion_activa: { type: Type.BOOLEAN },
                  expansion_geografica: { type: Type.STRING },
                  actualizacion_reciente: { type: Type.STRING },
                },
              },
              marketing_intensity: {
                type: Type.OBJECT,
                properties: {
                  seo_score: { type: Type.NUMBER },
                  ads_presence: { type: Type.STRING },
                  content_velocity: { type: Type.STRING },
                },
              },
              hipotesis_crecimiento: {
                type: Type.OBJECT,
                properties: {
                  problema_raiz: { type: Type.STRING },
                  solucion_propuesta: { type: Type.STRING },
                  roi_estimado: { type: Type.STRING },
                },
              },
              analisis_oportunidades: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    area: { type: Type.STRING },
                    hallazgo: { type: Type.STRING },
                    oportunidad: { type: Type.STRING },
                    prioridad: { type: Type.STRING },
                    impacto_negocio: { type: Type.STRING },
                  },
                },
              },
              scores: {
                type: Type.OBJECT,
                properties: {
                  salud_digital: { type: Type.NUMBER },
                  probabilidad_conversion: { type: Type.NUMBER },
                  nivel_inversion_estimado: { type: Type.STRING },
                },
              },
              outreach_automatizado: {
                type: Type.OBJECT,
                properties: {
                  email_asunto: { type: Type.STRING },
                  email_cuerpo: { type: Type.STRING },
                  linkedin_invite: { type: Type.STRING },
                },
              },
              hot_lead_score: { type: Type.NUMBER },
            },
          },
        },
      });

      if (!response.text) {
        res.status(500).json({
          success: false,
          error: "La IA no generó respuesta.",
        });
        return;
      }

      const data = JSON.parse(response.text);
      res.json({ success: true, data });
    } catch (error) {
      console.error("[API] analyze-business error:", error);
      res.status(500).json({
        success: false,
        error: "Error al analizar el negocio. Inténtalo de nuevo.",
      });
    }
  });

  app.post("/api/generate-content", rateLimit, async (req, res) => {
    try {
      const { businessInfo, type } = req.body;

      if (!businessInfo?.name || !type) {
        res.status(400).json({
          success: false,
          error: "Se requiere nombre del negocio y tipo de contenido.",
        });
        return;
      }

      let prompt = `Eres un Director Creativo Senior y Copywriter de una agencia de élite.
      Tu misión es crear contenido de marketing que no solo sea creativo, sino altamente persuasivo y alineado con la estrategia de negocio.

      DATOS DEL NEGOCIO:
      - Nombre: ${businessInfo.name}
      - Propuesta: ${businessInfo.valueProposition || ""}
      - Sector: ${businessInfo.sector || "General"}

      REQUERIMIENTO: ${type}
      
      PAUTAS DE CALIDAD:
      1. Usa un tono que conecte con la audiencia objetiva.
      2. Enfócate en beneficios, no solo en características.
      3. Estructura el contenido con Markdown elegante (usa negritas, listas y separadores).
      4. Todo el contenido debe estar en ESPAÑOL.
      `;

      if (type === "slogan") {
        prompt += `Genera 5 eslóganes magistrales. 
        Para cada uno, incluye:
        - El eslogan (en h3).
        - El "Ángulo Psicológico" (por qué funciona).
        - El "Momento de Uso" (dónde brilla más).`;
      } else if (type === "social_post") {
        prompt += `Crea una Estrategia de Contenidos para RRSS:
        - 2 Posts de LinkedIn (enfocados en autoridad y profesionalidad).
        - 2 Posts de Instagram (enfocados en engagement visual y storytelling).
        - Incluye estructuras de copia (Gancho, Cuerpo, CTA) y sugerencias de hashtags optimizados.`;
      } else if (type === "newsletter") {
        prompt += `Redacta una Newsletter de "Alto Impacto":
        - 3 Opciones de Asunto (Subject lines) que inciten al clic (Click-through rate).
        - Un cuerpo de correo estructurado (Saludo, Problema/Agitación, Solución, Beneficios, CTA claro).
        - PD (vía rápida de contacto).`;
      } else if (type === "concept_logo") {
        prompt += `Define un "Manual de Identidad Visual" (Concepto):
        - Concepto Central (La idea detrás del logo).
        - Paleta de Colores Sugerida (códigos HEX y por qué elegirlos).
        - Tipografía Recomendada (estilo y peso).
        - Mockups Sugeridos (cómo se vería en tarjetas, web o merch).`;
      }

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          systemInstruction:
            "Eres el jefe de estrategia creativa de una agencia boutique. Tu trabajo es entregar piezas de marketing listas para producción que impresionen a directivos. Responde siempre en español.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      res.json({ success: true, data: response.text || "" });
    } catch (error) {
      console.error("[API] generate-content error:", error);
      res.status(500).json({
        success: false,
        error: "Error al generar contenido. Inténtalo de nuevo.",
      });
    }
  });

  app.post("/api/generate-image", rateLimit, async (req, res) => {
    try {
      const { businessInfo, type } = req.body;

      if (!businessInfo?.name) {
        res.status(400).json({
          success: false,
          error: "Se requiere nombre del negocio.",
        });
        return;
      }

      let prompt = `Commercial professional photography for a brand. 
      Brand Name: ${businessInfo.name}
      Proposition: ${businessInfo.valueProposition || ""}
      Style: Minimalist, clean, premium, high-end production. 
      `;

      if (type === "slogan" || type === "concept_logo") {
        prompt +=
          "A sleek, minimalist brand logo badge or sign, premium materials, high contrast, elegant typography, professional studio lighting, 8k resolution.";
      } else if (type === "social_post") {
        prompt +=
          "A stunning lifestyle product shot, professional commercial photography, depth of field, natural lighting, high-end branding elements, aesthetic composition.";
      } else if (type === "newsletter") {
        prompt +=
          "A modern, abstract digital background for a corporate email, elegant gradients, tech-forward, clean space for text, professional and trust-building.";
      }

      const response = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            res.json({
              success: true,
              data: `data:image/png;base64,${part.inlineData.data}`,
            });
            return;
          }
        }
      }

      res.json({ success: true, data: null });
    } catch (error) {
      console.error("[API] generate-image error:", error);
      res.status(500).json({
        success: false,
        error: "Error al generar imagen. Inténtalo de nuevo.",
      });
    }
  });

  app.post("/api/predict-roi", rateLimit, async (req, res) => {
    try {
      const { investment, channel, sector, location, avgTicket, digitalLevel } =
        req.body;

      if (!investment || !channel || !sector) {
        res.status(400).json({
          success: false,
          error:
            "Se requiere inversión, canal y sector para la predicción de ROI.",
        });
        return;
      }

      const prompt = `
        Eres un Director de Analítica y Estrategia Growth. 
        Tu objetivo es proyectar el ROI y explicar el impacto económico de una campaña de marketing.

        INPUTS:
        - Inversión: ${investment}€
        - Canal: ${channel}
        - Sector: ${sector}
        - Localización: ${location || "España"}
        - Ticket Medio: ${avgTicket || 100}€
        - Nivel Madurez Digital: ${digitalLevel || "medio"}

        TAREAS:
        1. Basándote en benchmarks actuales del sector (${sector}) y el canal (${channel}), estima CTR, CPC y Conversión inicial.
        2. Ajusta estas métricas según el Nivel Digital (${digitalLevel}): un nivel bajo penaliza la conversión un 30-50%, un nivel alto la potencia.
        3. Genera 3 escenarios: Conservador, Base y Optimista.
        4. Proporciona una explicación técnica de por qué se esperan estos resultados.
        5. Genera 3 recomendaciones accionables para maximizar el ROI.

        REQUISITOS: Todo en ESPAÑOL. Responde en JSON.
      `;

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          systemInstruction:
            "Eres el jefe de analítica de una agencia de marketing boutique. Tus predicciones son realistas y basadas en datos de mercado reales.",
          responseMimeType: "application/json",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              escenarios: {
                type: Type.OBJECT,
                properties: {
                  conservador: {
                    type: Type.OBJECT,
                    properties: {
                      roi: { type: Type.NUMBER },
                      revenue: { type: Type.NUMBER },
                      conversiones: { type: Type.NUMBER },
                      cpa: { type: Type.NUMBER },
                    },
                  },
                  base: {
                    type: Type.OBJECT,
                    properties: {
                      roi: { type: Type.NUMBER },
                      revenue: { type: Type.NUMBER },
                      conversiones: { type: Type.NUMBER },
                      cpa: { type: Type.NUMBER },
                    },
                  },
                  optimista: {
                    type: Type.OBJECT,
                    properties: {
                      roi: { type: Type.NUMBER },
                      revenue: { type: Type.NUMBER },
                      conversiones: { type: Type.NUMBER },
                      cpa: { type: Type.NUMBER },
                    },
                  },
                },
              },
              analisis_detallado: { type: Type.STRING },
              recomendaciones: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              score_confianza: { type: Type.NUMBER },
              break_even_days: { type: Type.NUMBER },
            },
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json({ success: true, data });
    } catch (error) {
      console.error("[API] predict-roi error:", error);
      res.status(500).json({
        success: false,
        error: "Error al predecir ROI. Inténtalo de nuevo.",
      });
    }
  });

  // ─── Vite / Static Files ─────────────────────────────────

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MarketFlow AI] Server running on http://localhost:${PORT}`);
    console.log(`[MarketFlow AI] Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

startServer().catch((err) => {
  console.error("[MarketFlow AI] Failed to start server:", err);
  process.exit(1);
});
