import { DataSource } from "typeorm";
import { Game } from "./entities/Game";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Debug log to verify DATABASE_URL is set correctly
console.log("📦 DATABASE_URL:", process.env.DATABASE_URL);
console.log("Database URL:", process.env.DATABASE_URL);


export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [Game]
});
