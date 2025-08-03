"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@clickhouse/client");
const request_ip_1 = __importDefault(require("request-ip"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(request_ip_1.default.mw()); // Middleware to extract client IP
// Setup ClickHouse client
const clickhouse = (0, client_1.createClient)({
    url: process.env.CLICKHOUSE_URL, // || 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USER, // || 'default',
    password: process.env.CLICKHOUSE_PASSWORD //|| '',
});
// Health check route
app.get('/', (req, res) => {
    res.send('✅ Welcome to the Analytics Service!');
});
// Track analytics data
app.post('/track', async (req, res) => {
    const { page, timestamp, userAgent, session_id } = req.body;
    const ip = req.clientIp || req.ip || 'unknown';
    const session = session_id || (0, uuid_1.v4)();
    try {
        await clickhouse.insert({
            table: 'web_analytics',
            values: [
                {
                    page,
                    timestamp,
                    userAgent,
                    ip,
                    session_id: session,
                },
            ],
            format: 'JSONEachRow',
        });
        res.status(200).send('✅ Analytics recorded');
    }
    catch (error) {
        console.error('ClickHouse insert failed:', error instanceof Error ? error.message : JSON.stringify(error));
        res.status(500).send('❌ Failed to record analytics');
    }
});
// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`🚀 Analytics service running on http://localhost:${PORT}`);
});
