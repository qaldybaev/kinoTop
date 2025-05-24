import app from "./app.js";
import { PORT } from "./config/app.config.js";
import connectDB from "./config/mongo.config.js";

await connectDB()


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})