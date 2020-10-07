import { IdGenerator } from "../services/idGenerator";
import { TokenGenerator } from "../services/tokenGenerator";
import { InvalidParameterError } from "../errors/InvalidParameterError";
import { Music, musicInputDTO } from "../model/Music";
import { MusicDatabase } from "../data/MusicDatabase";
import dayjs from "dayjs";

export class MusicBusiness {

constructor(
    private musicDatabase: MusicDatabase,
    private idGenerator: IdGenerator,
    private tokenGenerator: TokenGenerator
){}

public async saveMusic(
    input: musicInputDTO,
    token: string
) {
    const userData = this.tokenGenerator.verify(token);
    const id = this.idGenerator.generate();
    const date = dayjs().format("YYYY-MM-DD")

    if (!input.title || !input.author || !input.file || !input.genre || !input.album) {
        throw new InvalidParameterError("Missing input");
    }

    await this.musicDatabase.createMusic(
        new Music(id, userData.id, input.title, input.author, date, input.file, input.genre, input.album)
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

    public async getMusicByQueryName(
        token: string,
        search: string
    ) {
        const userData = this.tokenGenerator.verify(token);
        const result = await this.musicDatabase.getMusicByQueryName(userData.id, search)
        return result
    }
}
