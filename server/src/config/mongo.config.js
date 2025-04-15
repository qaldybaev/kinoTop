import { config } from "dotenv"
import mongoose from "mongoose"

config()

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo'db ga ulandi✅")
    } catch (error) {
        console.log("Mongo'db ga ulanishda xatolik❌")
    }
}

export default connectDB