import { UserDatabase } from "../data/UserDatabase";
import { User } from "../model/User";
import { IdGenerator } from "../services/idGenerator";
import { HashGenerator } from "../services/hashGenerator";
import { TokenGenerator } from "../services/tokenGenerator";
import { NotFoundError } from "../errors/NotFoundError";
import { InvalidParameterError } from "../errors/InvalidParameterError";

export class UserBusiness {

constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private hashGenerator: HashGenerator ,
    private tokenGenerator: TokenGenerator
){}

    public async signup(
        name: string,
        email: string,
        nickname: string,
        password: string
    ) {

        if (!name || !email || !nickname || !password) {
            throw new InvalidParameterError("Missing input");
        }

        if (email.indexOf("@") === -1) {
            throw new InvalidParameterError("Invalid email");
        }

        if (!password.match('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$')) {
            throw new InvalidParameterError("A senha deve ter no mínimo 8 caracteres, e conter letras maiúsculas, minúsculas e números");
        }

        const id = this.idGenerator.generate();

        const cypherPassword = await this.hashGenerator.hash(password);

        await this.userDatabase.createUser(
            new User(id, name, email, nickname, cypherPassword)
        );

        const accessToken = this.tokenGenerator.generate({
            id
        });
        return {accessToken};
    }

    public async login(
        emailOrNickname: string,
        password: string
        ) {

        if (!emailOrNickname || !password) {
            throw new InvalidParameterError("Missing input");
        }

        const user = await this.userDatabase.getUser(emailOrNickname);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const isPasswordCorrect = await this.hashGenerator.compareHash(
            password,
            user.getPassword()
        );

        if (!isPasswordCorrect) {
            throw new InvalidParameterError("Invalid password");
        }

        const accessToken = this.tokenGenerator.generate({
            id: user.getId()
        });

        return {accessToken};
    }
}
