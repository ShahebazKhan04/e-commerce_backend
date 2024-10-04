import express from 'express';
import dotenv from 'dotenv';
import connectDb from './db/connectDB.js';
import morgan from 'morgan';
import testRoute from './routes/testRoute.js';
import userRoute from './routes/userRoute.js';
/// importing routes


dotenv.config()
const app = express();
connectDb()

// expresss middlewares
app.use(express.json());
app.use(morgan('dev'))

// routes
app.use('/api/v1', testRoute)
app.use('/api/v1/user', userRoute)

app.listen(process.env.PORT || 5500, () => {
    console.log(`server started at http://localhost:${process.env.PORT}`);
})