import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", school: "Denmin British Montessori Academy" });
  });

  app.get("/api/info", (req, res) => {
    res.json({
      name: "Denmin British Montessori Academy",
      address: "72, 19th Street, Opposite UNIBEN Main Gate, Ugbowo, Benin City, Nigeria.",
      phone: "+234 803 456 7890",
      email: "info@denminacademy.edu.ng",
    });
  });

  // Vite middleware for dev or production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
