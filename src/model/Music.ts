export class Music {
  constructor(
    private id: string,
    private user_id: string,
    private title: string,
    private author: string,
    private date: string,
    private file: string,
    private genre: string[],
    private album: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.user_id;
  }

  public getTitle(): string {
    return this.title;
  }

  public getAuthor(): string {
    return this.author;
  }

  public getDate(): string {
    return this.date;
  }

  public getFile(): string {
    return this.file;
  }

  public getGenre(): string[] {
    return this.genre;
  }

  public getAlbum(): string {
    return this.album;
  }
}