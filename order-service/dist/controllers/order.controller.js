"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
class OrderController {
    static async createOrder(req, res) {
        try {
            const result = await order_service_1.OrderService.createOrder(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Failed to create order' });
        }
    }
    static async getAllOrders(_req, res) {
        try {
            const orders = await order_service_1.OrderService.getAllOrders();
            res.status(200).json(orders);
        }
        catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    }
}
exports.OrderController = OrderController;
