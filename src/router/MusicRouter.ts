import express from "express";
import { MusicController } from "../controller/MusicController";

export const musicRouter = express.Router();

musicRouter.post("/savemusic", new MusicController().saveMusic);
musicRouter.get("/music", new MusicController().getMusic);
