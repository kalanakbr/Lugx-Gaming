import { AppDataSource } from '../data-source';
import { Order } from '../entities/Order';

const orderRepo = AppDataSource.getRepository(Order);

export class OrderService {
  static async createOrder(data: Partial<Order>) {
    const order = orderRepo.create(data);
    return await orderRepo.save(order);
  }

  static async getAllOrders() {
    return await orderRepo.find();
  }
}
