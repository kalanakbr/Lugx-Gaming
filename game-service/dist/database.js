"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Game_1 = require("./entities/Game");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}
// Debug log to verify DATABASE_URL is set correctly
console.log("📦 DATABASE_URL:", process.env.DATABASE_URL);
console.log("Database URL:", process.env.DATABASE_URL);
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [Game_1.Game]
});
