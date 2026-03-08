import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js'
import serviceRouter from './routes/serviceRoutes.js'
import orderRouter from './routes/orderRoutes.js'

dotenv.config();

const app = express();


app.use(cors({
    origin:[
        'https://printhub-server-bkvq.onrender.com'
    ],
    credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/service', serviceRouter)
app.use('/api/order', orderRouter)

app.listen(process.env.PORT || 5000, async () => {
    await connectDB();
    console.log(`Server running on ${process.env.PORT}`)
})