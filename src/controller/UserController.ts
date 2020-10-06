import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDataBase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { HashGenerator } from "../services/hashGenerator";
import { IdGenerator } from "../services/idGenerator";
import { TokenGenerator } from "../services/tokenGenerator";

export class UserController {
  
  private static userBusiness = new UserBusiness(
    new UserDatabase(),
    new IdGenerator(),
    new HashGenerator(),
    new TokenGenerator()
  );

  public async signup(req: Request, res: Response) {
    try {
      const result = await UserController.userBusiness.signup(
        req.body.name,
        req.body.email,
        req.body.nickname,
        req.body.password
      );
      res.status(200).send(result);
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    } finally {
      await BaseDataBase.destroyConnection()
    }
  }

  public async login(req: Request, res: Response) {
    const emailOrNickname = req.body.emailOrNickname;
    const password = req.body.password;
    try {
      const result = await UserController.userBusiness.login(emailOrNickname, password);
      res.status(200).send(result);
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    } finally {
      await BaseDataBase.destroyConnection()
    }
  }
}