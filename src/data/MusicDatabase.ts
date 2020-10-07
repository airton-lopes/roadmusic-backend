import { BaseDataBase } from "./BaseDatabase";
import { Music, musicInputDTO, musicOutputDTO } from "../model/Music";

export class MusicDatabase extends BaseDataBase {
protected tableName: string = "roadMusicSongs";

private toModel(dbModel?: any): Music | undefined {
    return (
    dbModel &&
    new Music(
        dbModel.id,
        dbModel.user_id,
        dbModel.title,
        dbModel.author,
        dbModel.date,
        dbModel.file,
        dbModel.genre,
        dbModel.album
    )
    );
}

    public async createMusic(song: Music): Promise<void> {
        await super.getConnection().raw(`
            INSERT INTO ${this.tableName} (id, user_id, title, author, date, file, genre, album)
            VALUES (
            '${song.getId()}', 
            '${song.getUserId()}', 
            '${song.getTitle()}', 
            '${song.getAuthor()}',
            '${song.getDate()}',
            '${song.getFile()}',
            '${song.getGenre()}',
            '${song.getAlbum()}'
            )`);
    }

    public async getMusic(user_id: string, music_id?: string): Promise<musicOutputDTO[]> {
        let aditionalCondition =  `AND id LIKE '${music_id}'`
        if(!music_id) {
        aditionalCondition = ''
    };
        const result = await super.getConnection().raw(`SELECT title, author, date, file, genre, album FROM ${this.tableName}
        WHERE user_id LIKE '${user_id}'${aditionalCondition}
        `);
        return (result[0]);
    }

    public async getMusicByQueryName(user_id: string, search: string): Promise<musicOutputDTO[]> {
        const result = await super.getConnection().raw(`
        SELECT title, author, date, file, genre, album FROM ${this.tableName}
        WHERE user_id LIKE '${user_id}' AND author LIKE '%${search}%' OR title LIKE '%${search}%'
        `);
        return (result[0])
    }
}