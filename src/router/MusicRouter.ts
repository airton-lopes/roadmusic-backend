import express from "express";
import { MusicController } from "../controller/MusicController";

export const musicRouter = express.Router();

musicRouter.post("/", new MusicController().saveMusic);
musicRouter.get("/:id", new MusicController().getMusic);
musicRouter.get("/", new MusicController().getMusicByQueryName);