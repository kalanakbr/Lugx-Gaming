import "reflect-metadata";
import { AppDataSource } from "./database";
import app from "./app";
import dotenv from "dotenv";

// Use ENV_FILE=.env.k8s to load a different .env
dotenv.config({ path: process.env.ENV_FILE || '.env' });

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080; // Default to 8080 if PORT is not set 3001

AppDataSource.initialize().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Game service running on port ${PORT}`);
    console.log("Database URL:", process.env.DATABASE_URL);
    console.log("Database initialized successfully");
  });
}).catch((err) => {
  console.error("Data Source initialization failed", err);
});
