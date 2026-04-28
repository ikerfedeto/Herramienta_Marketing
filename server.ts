import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route: Simplified Scraping (for demo, would use a real service)
  app.post("/api/analyze-website", async (req, res) => {
    const { url } = req.body;
    // In a real app, we'd use puppeteer or a scraping API here.
    // For this MVP, we'll return a message suggesting the frontend to use Gemini's URL context if available,
    // or we'll just mock the "scraping" success for now and let Gemini do the heavy lifting from the URL string.
    res.json({ 
      success: true, 
      message: "Website discovery initiated. Analysis will be performed via AI.",
      url 
    });
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
