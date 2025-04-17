import cors from "cors"
import express from "express"
import { router } from "./routes"
import { errorHandlerMiddleware } from "./middlewares/error-handler"
import { swaggerDocs } from "./swagger"

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


const app = express()

app.use(cors())
app.use(express.json())

swaggerDocs(app, Number(process.env.PORT || 3000))

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





app.use("/api", router)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

export default app