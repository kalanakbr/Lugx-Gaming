"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv = __importStar(require("dotenv"));
const data_source_1 = require("./data-source");
const pg_1 = require("pg");
const envFile = process.env.NODE_ENV === "docker" ? ".env.docker" : ".env.local";
dotenv.config({ path: envFile });
const PORT = parseInt(process.env.PORT || '3003', 10);
console.log(`Loaded environment: ${envFile}`);
console.log(`DB Host: ${process.env.DB_HOST}`);
async function createDatabaseIfNotExists() {
    const client = new pg_1.Client({
        user: process.env.DB_USERNAME,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        database: 'postgres', // connect to default DB to run CREATE DATABASE
        port: parseInt(process.env.DB_PORT || '5432'),
    });
    try {
        await client.connect();
        const dbName = process.env.DB_NAME || 'ordersdb';
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname=$1`, [dbName]);
        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE ${dbName}`);
            console.log(`✅ Database "${dbName}" created.`);
        }
        else {
            console.log(`ℹ️ Database "${dbName}" already exists.`);
        }
    }
    catch (err) {
        console.error('❌ Error checking or creating database:', err);
        throw err;
    }
    finally {
        await client.end();
    }
}
async function startServer() {
    try {
        await createDatabaseIfNotExists();
        await data_source_1.AppDataSource.initialize();
        console.log('✅ Connected to PostgreSQL');
        app_1.default.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Order service running at http://0.0.0.0:${PORT}`);
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('❌ DB connection failed or server startup failed', err.stack || err.message);
        }
        else {
            console.error('❌ DB connection failed or server startup failed', err);
        }
        process.exit(1);
    }
}
startServer();
