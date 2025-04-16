import cors from "cors"
import express from "express"
import { router } from "./routes"
import { errorHandlerMiddleware } from "./middlewares/error-handler"

const app = express()

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {  
  const { swaggerCdnDocs } = require('./swagger-cdn');
  swaggerCdnDocs(app, Number(process.env.PORT || 3000));
} else {
  const { swaggerDocs } = require('./swagger');
  swaggerDocs(app, Number(process.env.PORT || 3000));
}

app.get('/', (req, res) => {
  res.json({ message: 'API is running. Access /api-docs for documentation.' });
});

app.use("/api", router)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

export default app