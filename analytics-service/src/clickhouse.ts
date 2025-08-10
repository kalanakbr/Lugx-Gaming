import express from 'express';
import { createClient } from '@clickhouse/client';
import dotenv from 'dotenv';
import requestIp from 'request-ip';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

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
  url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DB || 'Lugx',
});

// Health check
app.get('/', (_, res) => {
  res.send('>>>>>>> Analytics service is up <<<<<<<<');
});

// Track analytics event
app.post('/track', async (req, res) => {
  const {
    eventType = 'page_view',
    page = '',
    timestamp,
    userAgent = '',
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
  const sessionId = session_id || uuidv4();

  const event = {
    id: uuidv4(),
    eventType,
    pageUrl: page,
    timestamp: timestamp || new Date().toISOString(),
    sessionId,
    scrollPercent: Number(scroll_percent) || 0,
    timeOnPage: Number(duration_ms) || 0,
    deviceType: userAgent.includes('Mobile') ? 'mobile' : 'desktop',
    ip,
    elementTag: element_tag || '',
    elementId: element_id || '',
    elementClasses: element_classes || '',
    x: x !== undefined ? Number(x) : null,
    y: y !== undefined ? Number(y) : null,
  };

  console.log('^^^^^^ Event received:', event);

  try {
    console.log('-> Inserting event into ClickHouse...');
    await clickhouse.insert({
      table: 'events',
      values: [event],
      format: 'JSONEachRow',
    });

    console.log('>>>>>>> Event inserted into ClickHouse <<<<<<<<<<');
    res.status(200).send('Event recorded');
  } catch (error: any) {
    console.error(' XXXXXXXXXXX Insert failed:', error.message || error);
    res.status(500).send('Failed to record event');
  }
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(` /////// Analytics service running on port /////// ${PORT}`);
});
