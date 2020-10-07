import { Request, Response } from "express";
import { MusicBusiness } from "../business/MusicBusiness";
import { BaseDataBase } from "../data/BaseDatabase";
import { MusicDatabase } from "../data/MusicDatabase";
import { musicInputDTO } from "../model/Music";
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
        const input: musicInputDTO = {
          title : req.body.title,
          author: req.body.author,
          file: req.body.file,
          genre: req.body.genre as string[],
          album: req.body.album
        }
        const token = req.headers.authorization as string
        await MusicController.musicBusiness.saveMusic(
        input, token
        );
    res.status(200).send({
      message: 'Música cadastrada com sucesso!'
    });
    } catch (error) {
      res.status(error.errorCode || 400).send({ message: error.message });
    } finally {
      await BaseDataBase.destroyConnection()
    }
  }

  public async getMusic(req: Request, res: Response) {
      try {
          const music = await MusicController.musicBusiness.getMusic(
            req.headers.authorization as string,
            req.params.id as string
          );
          res.status(200).send({
              music
          })
      } catch (error) {
          res.status(error.errorCode || 400).send({
            message: error.message
          });
      } finally {
        await BaseDataBase.destroyConnection()
      }
  }
  
  public async getMusicByQueryName(req: Request, res: Response) {
    try {
      const music = await MusicController.musicBusiness.getMusicByQueryName(
        req.headers.authorization as string,
        req.query.search as string
      );
      res.status(200).send({
        music
      })
    } catch (error) {
      res.status(error.errorCode || 400).send({
        message: error.message
      });
    } finally {
      await BaseDataBase.destroyConnection()
    }
  }
}