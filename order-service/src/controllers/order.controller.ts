import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
  static async createOrder(req: Request, res: Response) {
    try {
      const result = await OrderService.createOrder(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  static async getAllOrders(_req: Request, res: Response) {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }
}
