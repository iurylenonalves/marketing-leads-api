import cors from "cors"
import express from "express"
import { router } from "./routes"
import { errorHandlerMiddleware } from "./middlewares/error-handler"
import { swaggerDocs } from "./swagger"

const app = express()

app.use(cors())
app.use(express.json())

swaggerDocs(app, Number(process.env.PORT || 3000))

app.use("/api", router)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000


if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

export default app
