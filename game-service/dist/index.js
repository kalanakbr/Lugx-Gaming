"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const database_1 = require("./database");
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
// Use ENV_FILE=.env.k8s to load a different .env
dotenv_1.default.config({ path: process.env.ENV_FILE || '.env' });
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080; // Default to 8080 if PORT is not set 3001
database_1.AppDataSource.initialize().then(() => {
    app_1.default.listen(PORT, "0.0.0.0", () => {
        console.log(`Game service running on port ${PORT}`);
        console.log("Database URL:", process.env.DATABASE_URL);
        console.log("Database initialized successfully");
    });
}).catch((err) => {
    console.error("Data Source initialization failed", err);
});
