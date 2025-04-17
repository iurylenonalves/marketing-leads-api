import cors from "cors"
import express from "express"
import { router } from "./routes"
import { errorHandlerMiddleware } from "./middlewares/error-handler"
import { swaggerDocs } from "./swagger"



process.on('uncaughtException', (error) => {
  console.error('FATAL ERROR: Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('FATAL ERROR: Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('warning', (warning) => {
  console.warn('Warning detected:', warning.name, warning.message);
});

const app = express()

app.use(cors())
app.use(express.json())


app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`Response for ${req.method} ${req.url}: Status ${res.statusCode}`);
    return originalSend.call(this, body);
  };
  next();
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

try {
  swaggerDocs(app, Number(process.env.PORT || 3000));
} catch (error) {
  console.error('Error initializing Swagger, continuing without it:', error);
}

app.get('/', (req, res) => {
  res.json({ message: 'API is running. Access /api-docs for documentation.' });
});

app.get('/db-check', async (req, res) => {
  try {
    const { prisma } = require('./database/prisma');
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    res.status(500).json({ 
      status: 'Database connection failed', 
      error: errorMessage,
      stack: process.env.NODE_ENV === 'production' ? undefined : errorStack
    });
  }
});

try {
  app.use("/api", router);
} catch (error) {
  console.error('Error setting up API routes:', error);
}

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

let server;
try {
  server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  server.on('error', (error) => {
    console.error('Server error:', error);
  });
} catch (error) {
  console.error('Fatal error starting server:', error);
}

export default app;