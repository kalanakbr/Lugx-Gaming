import { Request, Response } from "express";
import { AppDataSource } from "../database";
import { Game } from "../entities/Game";

export const createGame = async (req: Request, res: Response) => {
  try {
    const gameRepo = AppDataSource.getRepository(Game);
    const game = gameRepo.create(req.body);
    const result = await gameRepo.save(game);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create game" });
  }
};

export const getGames = async (_: Request, res: Response) => {
  try {
    const gameRepo = AppDataSource.getRepository(Game);
    const games = await gameRepo.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch games" });
  }
};
