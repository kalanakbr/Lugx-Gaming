"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const data_source_1 = require("../data-source");
const Order_1 = require("../entities/Order");
const orderRepo = data_source_1.AppDataSource.getRepository(Order_1.Order);
class OrderService {
    static async createOrder(data) {
        const order = orderRepo.create(data);
        return await orderRepo.save(order);
    }
    static async getAllOrders() {
        return await orderRepo.find();
    }
}
exports.OrderService = OrderService;
