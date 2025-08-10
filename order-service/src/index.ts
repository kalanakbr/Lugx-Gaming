import app from './app';
import * as dotenv from "dotenv";
import { AppDataSource } from './data-source';
import { Client } from 'pg';

const envFile = process.env.NODE_ENV === "docker" ? ".env.docker" : ".env.local";
dotenv.config({ path: envFile });

const PORT = parseInt(process.env.PORT || '3003', 10);



console.log(`Loaded environment: ${envFile}`);
console.log(`DB Host: ${process.env.DB_HOST}`);

async function createDatabaseIfNotExists() {
  const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: 'postgres',  // connect to default DB to run CREATE DATABASE
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    await client.connect();

    const dbName = process.env.DB_NAME || 'ordersdb';

    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname=$1`, [dbName]);

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created.`);
    } else {
      console.log(`ℹ️ Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('❌ Error checking or creating database:', err);
    throw err;
  } finally {
    await client.end();
  }
}

async function startServer() {
  try {
    await createDatabaseIfNotExists();

    await AppDataSource.initialize();
    console.log('✅ Connected to PostgreSQL');

    app.listen(PORT,'0.0.0.0',() => {
      console.log(`🚀 Order service running at http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ DB connection failed or server startup failed', err.stack || err.message);
    } else {
      console.error('❌ DB connection failed or server startup failed', err);
    }
    process.exit(1);
  }
}

startServer();

