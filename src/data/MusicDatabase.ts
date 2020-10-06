import { BaseDataBase } from "./BaseDatabase";
import { Music } from "../model/Music";

export class MusicDatabase extends BaseDataBase {
protected tableName: string = "roadMusicSongs";

private toModel(dbModel?: any): Music | undefined {
    return (
    dbModel &&
    new Music(
        dbModel.id,
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
        INSERT INTO ${this.tableName} (id, title, author, date, file, genre, album)
        VALUES (
        '${song.getId()}', 
        '${song.getTitle()}', 
        '${song.getAuthor()}',
        '${song.getDate()}',
        '${song.getFile()}',
        '${song.getGenre()}',
        '${song.getAlbum()}'
        )`);
}
}
