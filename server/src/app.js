import express from "express"
import userRouter from "./modules/user/user.route.js"
import categoryRouter from "./modules/category/category.route.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api",userRouter)
app.use("/api",categoryRouter)

app.use((error,req,res,next) => {
  res.send({
    message:error.message
  })
}
)

app.all('/*splat', (req, res) => {
    res.send({
        message:`Bunday ${req.url} url mavjud emas`
    })
  })

export default app