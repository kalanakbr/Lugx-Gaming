"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const router = (0, express_1.Router)();
router.post('/orders', order_controller_1.OrderController.createOrder);
router.get('/orders', order_controller_1.OrderController.getAllOrders);
exports.default = router;
