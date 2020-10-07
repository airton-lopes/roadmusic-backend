import { BaseDataBase } from "./BaseDatabase";
import { User } from "../model/User";

export class UserDatabase extends BaseDataBase {
  protected roadMusicUsersTable: string = "roadMusicUsers";

  private toModel(dbModel?: any): User | undefined {
    return (
      dbModel &&
      new User(
        dbModel.id,
        dbModel.name,
        dbModel.email,
        dbModel.nickname,
        dbModel.password
      )
    );
  }

  public async createUser(user: User): Promise<void> {
    await super.getConnection().raw(`
        INSERT INTO ${this.roadMusicUsersTable} (id, name, email, nickname, password)
        VALUES (
          '${user.getId()}', 
          '${user.getName()}', 
          '${user.getEmail()}',
          '${user.getNickname()}',
          '${user.getPassword()}'
        )`);
  }

  public async getUser(emailOrNickname: string): Promise<User | undefined> {
    const result = await super.getConnection().raw(`
      SELECT * from ${this.roadMusicUsersTable} WHERE email = '${emailOrNickname}' OR nickname = '${emailOrNickname}'
      `);
    return this.toModel(result[0][0]);
  }
}
