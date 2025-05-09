import cors from "cors"
import express from "express"
import { router } from "./routes"
import { errorHandlerMiddleware } from "./middlewares/error-handler"
import { swaggerDocs } from "./swagger"

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

app.get('/', (req, res) => {
  res.redirect('/api-docs')
})

try {
  swaggerDocs(app, Number(process.env.PORT || 3000))
} catch (error) {
  console.error('Error initializing Swagger:', error)
}

app.get('/db-check', async (req, res) => {
  try {
    const { prisma } = require('./database/prisma')
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'Database connection successful' })
  } catch (error) {
    console.error('Database connection error:', error)
    res.status(500).json({
      status: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

app.use("/api", router)

app.use(errorHandlerMiddleware)

export default app