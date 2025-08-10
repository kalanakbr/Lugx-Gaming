import express from 'express';
import { createClient } from '@clickhouse/client';
import dotenv from 'dotenv';
import requestIp from 'request-ip';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// 🔍 Log environment variables to verify they're loaded correctly
console.log('🔗 ClickHouse URL:', process.env.CLICKHOUSE_URL);
console.log('👤 ClickHouse User:', process.env.CLICKHOUSE_USER);
console.log('🗄️ ClickHouse DB:', process.env.CLICKHOUSE_DB);

const app = express();
app.use(express.json());
app.use(requestIp.mw());

// Extend Express Request type to add clientIp
declare global {
  namespace Express {
    interface Request {
      clientIp?: string;
    }
  }
}

// Setup ClickHouse client
const clickhouse = createClient({
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
  const {
    eventType = 'page_view',
    page,
    timestamp,
    userAgent,
    session_id,
    scroll_percent,
    duration_ms,
    element_tag,
    element_id,
    element_classes,
    x,
    y,
  } = req.body;

  const ip = req.clientIp || req.ip || 'unknown';
  const session = session_id || uuidv4();

  const event = {
    id: uuidv4(),
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
  } catch (err) {
    console.error('❌ ClickHouse insert failed:', err);
    res.status(500).send('Failed to record analytics');
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Analytics service running on port ${PORT}`);
});
