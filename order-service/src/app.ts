import express from 'express';
import dotenv from 'dotenv';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app = express();
app.use(express.json());

// Mount order routes
app.use("/api/order", orderRoutes);

// Health check endpoint for Kubernetes probes
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).send('Order Service is running');
});

console.log("Order routes registered at /api/order");

export default app;

