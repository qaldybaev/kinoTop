import express from "express"
import userRouter from "./modules/user/user.route.js"
import categoryRouter from "./modules/category/category.route.js"
import filmRouter from "./modules/film/film.route.js"
import reviewRouter from "./modules/review/review.route.js"
import saveRouter from "./modules/save/save.route.js"
import errorHandlerMiddleware from "./middleware/errorHandler.middleware.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const corsOptions = {
  origin: "http://localhost:4000", 
  credentials: true, 
};


app.use(cors(corsOptions));

app.use("/api", userRouter)
app.use("/api", categoryRouter)
app.use("/api", filmRouter)
app.use("/api", reviewRouter)
app.use("/api", saveRouter)

app.use(errorHandlerMiddleware)

app.all('/*splat', (req, res) => {
  res.send({
    message: `Bunday ${req.url} url mavjud emas`
  })
})

export default app
