import express from "express"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.all('/*splat', (req, res) => {
    res.send({
        message:`Bunday ${req.url} url mavjud emas`
    })
  })

export default app