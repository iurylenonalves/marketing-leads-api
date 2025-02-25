import cors from "cors"
import express from "express"
import { router } from "./router"

const app = express()

app.use(cors())
app.use("/api", router)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server ir running on http://localhost:${PORT}`))
