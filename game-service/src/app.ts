import "reflect-metadata";
import express from "express";
import gameRoutes from "./routes/gameRoutes";

const app = express();

app.use(express.json());
app.use("/api/game", gameRoutes);

app.get("/", (req, res) => {
    res.send("Game Service is running");
});


console.log("Game routes registered at /api/game");

export default app;

