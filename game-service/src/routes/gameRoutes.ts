import { Router } from "express";
import { createGame, getGames } from "../controllers/gameController";

const router = Router();

// Use root path here, so combined with app.ts's "/api/game" it becomes "/api/game"
router.post("/", createGame);
router.get("/", getGames);

export default router;
