import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createClient, ClickHouseClient } from '@clickhouse/client';
import requestIp from 'request-ip';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
app.use(express.json());
app.use(requestIp.mw()); // Middleware to extract client IP

// Extend Express Request type to include clientIp
declare global {
  namespace Express {
    interface Request {
      clientIp?: string;
    }
  }
}

// Setup ClickHouse client
const clickhouse: ClickHouseClient = createClient({
  url: process.env.CLICKHOUSE_URL!, // || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER!, // || 'default',
  password: process.env.CLICKHOUSE_PASSWORD! //|| '',
});

// Interface for expected analytics data
interface AnalyticsData {
  page: string;
  timestamp: string;
  userAgent: string;
  session_id?: string;
}

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.send('✅ Welcome to the Analytics Service!');
});

// Track analytics data
app.post('/track', async (req: Request<{}, {}, AnalyticsData>, res: Response) => {
  const { page, timestamp, userAgent, session_id } = req.body;
  const ip = req.clientIp || req.ip || 'unknown';
  const session = session_id || uuidv4();

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
  } catch (error) {
    console.error('ClickHouse insert failed:', error instanceof Error ? error.message : JSON.stringify(error));
    res.status(500).send('❌ Failed to record analytics');
  }
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Analytics service running on http://localhost:${PORT}`);
});
