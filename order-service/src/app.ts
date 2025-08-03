import express from 'express';
import dotenv from 'dotenv';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use(orderRoutes);

app.get('/', (_req, res) => res.send('Order Service is running'));

export default app;
