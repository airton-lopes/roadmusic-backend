import { Request, Response } from "express";
import { MusicBusiness } from "../business/MusicBusiness";
import { BaseDataBase } from "../data/BaseDatabase";
import { MusicDatabase } from "../data/MusicDatabase";
import { IdGenerator } from "../services/idGenerator";
import { TokenGenerator } from "../services/tokenGenerator";

export class MusicController {
  
  private static musicBusiness = new MusicBusiness(
    new MusicDatabase(),
    new IdGenerator(),
    new TokenGenerator()
  );

  public async saveMusic(req: Request, res: Response) {
    try {
      const input = 
      await MusicController.musicBusiness.saveMusic(
        req.headers.authorization as string,
        req.body.title,
        req.body.author,
        req.body.file,
        req.body.genre as string[],
        req.body.album
      );
      res.status(200).send({
        message: 'Música cadastrada com sucesso!'
      });
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    } finally {
      await BaseDataBase.destroyConnection()
    }
  }

  public async getMusic(req: Request, res: Response) {
      try {
          const music = await MusicController.musicBusiness.getMusic(
            req.headers.authorization as string,
            req.params.music_id as string
          );
          res.status(200).send({
              music
          })
      } catch (error) {
          res.status(error.errorCode || 400).send({
              message: error.message });
      } finally {
        await BaseDataBase.destroyConnection()
      }
  }
}