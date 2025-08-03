import express, { Request, Response } from 'express';
import { createClient } from '@clickhouse/client';
import dotenv from 'dotenv';
import requestIp from 'request-ip';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Extend Express Request type to add clientIp
declare global {
  namespace Express {
    interface Request {
      clientIp?: string;
    }
  }
}

const app = express();
app.use(express.json());
app.use(requestIp.mw());

const clickhouse = createClient({
  url: process.env.CLICKHOUSE_URL,
  username: process.env.CLICKHOUSE_USER, // or default if you want
  password: process.env.CLICKHOUSE_PASSWORD,
  database: process.env.CLICKHOUSE_DB,
});

interface AnalyticsData {
  page: string;
  timestamp: string;
  userAgent: string;
  session_id?: string;
}

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

    res.status(200).send('Analytics recorded');
  } catch (err) {
    console.error('ClickHouse insert failed:', err);
    res.status(500).send('Failed to record analytics');
  }
});

// New analyticsService export with logEvent method
export const analyticsService = {
  async logEvent(data: {
    eventType: string;
    pageUrl: string;
    sessionId: string;
    scrollPercent?: number;
    timeOnPage?: number;
    deviceType?: string;
  }) {
    const timestamp = new Date().toISOString();

    const event = {
      id: uuidv4(),
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
    } catch (error) {
      console.error('ClickHouse insert for event failed:', error);
      throw error;
    }
  },
};

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Analytics service running on port ${PORT}`);
});
