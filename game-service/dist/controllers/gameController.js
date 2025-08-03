"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGames = exports.createGame = void 0;
const database_1 = require("../database");
const Game_1 = require("../entities/Game");
const createGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameRepo = database_1.AppDataSource.getRepository(Game_1.Game);
        const game = gameRepo.create(req.body);
        const result = yield gameRepo.save(game);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create game" });
    }
});
exports.createGame = createGame;
const getGames = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameRepo = database_1.AppDataSource.getRepository(Game_1.Game);
        const games = yield gameRepo.find();
        res.json(games);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch games" });
    }
});
exports.getGames = getGames;
