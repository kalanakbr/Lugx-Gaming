"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/game", gameRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Game Service is running");
});
console.log("Routes registered at /api/game");
exports.default = app;
