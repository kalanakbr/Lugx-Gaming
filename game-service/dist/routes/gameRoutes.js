"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gameController_1 = require("../controllers/gameController");
const router = (0, express_1.Router)();
// Use root path here, so combined with app.ts's "/api/game" it becomes "/api/game"
router.post("/", gameController_1.createGame);
router.get("/", gameController_1.getGames);
exports.default = router;
