import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
  static async createOrder(req: Request, res: Response) {
    const result = await OrderService.createOrder(req.body);
    res.json(result);
  }

  static async getAllOrders(_req: Request, res: Response) {
    const orders = await OrderService.getAllOrders();
    res.json(orders);
  }
}
