import express from "express";
import cors from "cors";
import { DatabasePool } from "./lib/mysql";
import routes from "./routes/routes";
import { errorHandler } from "./utils/error-handler";
import cookieParser from 'cookie-parser';

if (process.env.NODE_ENV !== "production") {
  process.loadEnvFile?.();
  (async () => {
    try {
      const db = DatabasePool.getInstance();
      await db.testConnection();
      console.log('DB lista');
    } catch (error) {
      console.error('DB falló:', error);
      process.exit(1); 
    }
  })();
}

const app = express();
const PORT = process.env.PORT || 4000;
const AUTHOR = process.env.AUTHOR || "Desconocido";

app.use(cookieParser());

const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error("Política de CORS: Acceso denegado desde este origen.")
        );
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Backend LimaHR Pro corriendo correctamente");
});

app.use("/api/v1", routes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
  });
}

export default app