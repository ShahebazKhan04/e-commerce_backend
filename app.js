import express from 'express';
import dotenv from 'dotenv';
import connectDb from './db/connectDB.js';
import morgan from 'morgan';
import testRoute from './routes/testRoute.js';
/// importing routes


dotenv.config()
const app = express();
connectDb()

// expresss middlewares
app.use(express.json());
app.use(morgan('dev'))

// routes
app.use('/api/v1', testRoute)

app.listen(process.env.PORT, () => {
    console.log(`server started at http://localhost:${process.env.PORT}`);
})