import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/Category.routes.js';
import transactionRoutes from './routes/transaction.routes.js'

const app = express();
dotenv.config();    

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));
app.use(express.json());
app.use(cookieParser())
app.use(morgan('dev'));


app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/transaction', transactionRoutes);
app.get('/', (req, res) => {
    res.status(200).json({ status : 200 , message: 'Server Healthy' });
});

export default app;