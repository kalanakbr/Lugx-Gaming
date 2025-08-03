"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
class OrderController {
    static async createOrder(req, res) {
        const result = await order_service_1.OrderService.createOrder(req.body);
        res.json(result);
    }
    static async getAllOrders(_req, res) {
        const orders = await order_service_1.OrderService.getAllOrders();
        res.json(orders);
    }
}
exports.OrderController = OrderController;
