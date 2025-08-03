"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@clickhouse/client");
const dotenv_1 = __importDefault(require("dotenv"));
const request_ip_1 = __importDefault(require("request-ip"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(request_ip_1.default.mw());
const clickhouse = (0, client_1.createClient)({
    url: process.env.CLICKHOUSE_URL,
    username: process.env.CLICKHOUSE_USER, // or default if you want
    password: process.env.CLICKHOUSE_PASSWORD,
    database: process.env.CLICKHOUSE_DB,
});
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
        res.status(200).send('Analytics recorded');
    }
    catch (err) {
        console.error('ClickHouse insert failed:', err);
        res.status(500).send('Failed to record analytics');
    }
});
// New analyticsService export with logEvent method
exports.analyticsService = {
    async logEvent(data) {
        const timestamp = new Date().toISOString();
        const event = {
            id: (0, uuid_1.v4)(),
            eventType: data.eventType,
            pageUrl: data.pageUrl,
            timestamp,
            sessionId: data.sessionId,
            scrollPercent: data.scrollPercent ?? 0,
            timeOnPage: data.timeOnPage ?? 0,
            deviceType: data.deviceType ?? 'unknown',
        };
        try {
            await clickhouse.insert({
                table: 'events',
                values: [event],
                format: 'JSONEachRow',
            });
        }
        catch (error) {
            console.error('ClickHouse insert for event failed:', error);
            throw error;
        }
    },
};
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Analytics service running on port ${PORT}`);
});
