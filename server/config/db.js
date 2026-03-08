import mongoose from "mongoose";
import dotenv from 'dotenv'
import dns from 'dns'

dotenv.config()

const connectDB = async () => {
    dns.setServers([
        '8.8.8.8',
        '1.1.1.1',
    ])
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MOONGODB connected succesfully")
    } catch (error) {
        console.log("MONGODB not connected")
        console.error(error)
    }
}

export default connectDB;