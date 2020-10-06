import { IdGenerator } from "../services/idGenerator";
import { TokenGenerator } from "../services/tokenGenerator";
import { InvalidParameterError } from "../errors/InvalidParameterError";
import { Music } from "../model/Music";
import { MusicDatabase } from "../data/MusicDatabase";
import dayjs from "dayjs";

export class MusicBusiness {

constructor(
    private musicDatabase: MusicDatabase,
    private idGenerator: IdGenerator,
    private tokenGenerator: TokenGenerator
){}

public async saveMusic(
    token: string,
    title: string,
    author: string,
    file: string,
    genre: string[],
    album: string
) {
    const userData = this.tokenGenerator.verify(token);
    const id = this.idGenerator.generate();
    const date = dayjs().format("YYYY-MM-DD")

    if (!title || !author || !date || !file || !genre || !album) {
        throw new InvalidParameterError("Missing input");
    }

    await this.musicDatabase.createMusic(
        new Music(id, userData.id, title, author, date, file, genre, album)
    );
}

    public async getMusic(
        token: string,
        music_id: string
    ) {
        const userData = this.tokenGenerator.verify(token);
        const result = await this.musicDatabase.getMusic(userData.id, music_id)
        return result
    }
}
