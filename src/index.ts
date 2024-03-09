import express, { Express } from "express"
import cors, { CorsOptions } from "cors"
import router from "./router"
import { PORT } from "./config"
import errorHandler from "./middlewares/errorHandler"

const app: Express = express()
const corsOptions: CorsOptions = {
  origin: "http://localhost:5173",
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1", router)

// global error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
