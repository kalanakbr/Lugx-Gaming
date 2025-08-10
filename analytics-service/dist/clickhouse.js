"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@clickhouse/client");
const dotenv_1 = __importDefault(require("dotenv"));
const request_ip_1 = __importDefault(require("request-ip"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
// 🔍 Log environment variables to verify they're loaded correctly
console.log('🔗 ClickHouse URL:', process.env.CLICKHOUSE_URL);
console.log('👤 ClickHouse User:', process.env.CLICKHOUSE_USER);
console.log('🗄️ ClickHouse DB:', process.env.CLICKHOUSE_DB);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(request_ip_1.default.mw());
// Setup ClickHouse client
const clickhouse = (0, client_1.createClient)({
    url: process.env.CLICKHOUSE_URL,
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
    database: process.env.CLICKHOUSE_DB,
});
// Health check route
app.get('/', (req, res) => {
    res.send('✅ Welcome to the Analytics Service!');
});
// Track analytics data
app.post('/track', async (req, res) => {
    const { eventType = 'page_view', page, timestamp, userAgent, session_id, scroll_percent, duration_ms, element_tag, element_id, element_classes, x, y, } = req.body;
    const ip = req.clientIp || req.ip || 'unknown';
    const session = session_id || (0, uuid_1.v4)();
    const event = {
        id: (0, uuid_1.v4)(),
        eventType,
        pageUrl: page,
        timestamp: timestamp || new Date().toISOString(),
        sessionId: session,
        scrollPercent: scroll_percent ?? 0,
        timeOnPage: duration_ms ?? 0,
        deviceType: userAgent?.includes('Mobile') ? 'mobile' : 'desktop',
        ip,
        elementTag: element_tag || null,
        elementId: element_id || null,
        elementClasses: element_classes || null,
        x: x ?? null,
        y: y ?? null,
    };
    console.log('📥 Incoming event:', event);
    try {
        await clickhouse.insert({
            table: 'events',
            values: [event],
            format: 'JSONEachRow',
        });
        console.log('✅ Inserted into ClickHouse');
        res.status(200).send('Event recorded');
    }
    catch (err) {
        console.error('❌ ClickHouse insert failed:', err);
        res.status(500).send('Failed to record analytics');
    }
});
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`🚀 Analytics service running on port ${PORT}`);
});
