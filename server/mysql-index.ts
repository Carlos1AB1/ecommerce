import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from './mysql-config';  // Make sure to import from mysql-config
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    });

    next();
  });

  try {
    // Initialize the database
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      log('Failed to initialize database. Please check your database configuration.', 'error');
      process.exit(1);
    }

    log('Database initialized successfully!', 'database');

    // Import routes after database is initialized
    const { registerRoutes } = await import('./mysql-routes');  // Import from mysql-routes
    const server = await registerRoutes(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error: ${message}`, 'error');
      res.status(status).json({ message });
    });

    // Setup Vite only in development
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start server
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      log(`Server started on http://localhost:${port}`, 'server');
    });

    return server;
  } catch (error) {
    log(`Failed to start server: ${error}`, 'error');
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
  console.error(reason);
  process.exit(1);
});

// Start the server
startServer();