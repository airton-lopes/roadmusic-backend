import { UserBusiness } from "../business/UserBusiness"
import { User } from "../model/User"

const userDatabase = {
   createUser: jest.fn(
      async (user: User) => { }
   ),
   getUserByEmail: jest.fn(
      (email: string) => undefined
   )
} as any
const idGenerator = {
   generate: jest.fn(() => "id mock")
} as any
const hashGenerator = {
   hash: jest.fn((password: string) => "cypher password"),
   compareHash: jest.fn(
      async (s: string, hash: string) => false
   )
} as any
const tokenGenerator = {
   generate: jest.fn(
      (payload: { id: string }) => "token de mentirinha"
   )
} as any

const userBusiness: UserBusiness = new UserBusiness(
   userDatabase,
   idGenerator,
   hashGenerator,
   tokenGenerator
)

describe("Testa o método de cadastro", () => {

   test("Deve retornar erro quando um nome não for passado", async () => {
      expect.assertions(2)

      try {
         await userBusiness.signup(
            "",
            "astrodev@labenu.com.br",
            "astrolindo",
            "bananinha"
         )
      } catch (error) {
         expect(error.message).toBe("Missing input")
         expect(error.statusCode).toBe(422)
      }
   })

   test("Deve retornar erro quando um email não for passado", async () => {
      expect.assertions(2)

      try {
         await userBusiness.signup(
            "Astrodev",
            "",
            "astrolindo",
            "bananinha"
         )
      } catch (error) {
         expect(error.message).toBe("Missing input")
         expect(error.statusCode).toBe(422)
      }
   })
   test("Deve retornar erro quando uma senha não for passada", async () => {
      expect.assertions(2)

      try {
         await userBusiness.signup(
            "Astrodev",
            "astrodev@labenu.com.br",
            "",
            "ADMIN"
         )
      } catch (error) {
         expect(error.message).toBe("Missing input")
         expect(error.statusCode).toBe(422)
      }
   })

   test("Deve retornar erro quando um nickname não for passado", async () => {
      expect.assertions(2)

      try {
         await userBusiness.signup(
            "Astrodev",
            "astrodev@labenu.com.br",
            null as any,
            "bananinha"
         )
      } catch (error) {
         expect(error.message).toBe("Missing input")
         expect(error.statusCode).toBe(422)
      }
   })

   test("Deve retornar erro quando o email for inválido", async () => {
      expect.assertions(2)

      try {
         await userBusiness.signup(
            "Astrodev",
            "astrodevlabenu.com.br",
            "bananinha",
            "ADMIN"
         )
      } catch (error) {
         expect(error.message).toBe("Invalid email")
         expect(error.statusCode).toBe(422)
      }
   })

   test("Deve retornar erro quando a senha for inválida", async () => {
      expect.assertions(2)

      try {
         await userBusiness.signup(
            "Astrodev",
            "astrodev@labenu.com.br",
            "astrolindo",
            "uva"
         )
      } catch (error) {
         expect(error.message).toBe("A senha deve ter no mínimo 8 caracteres, e conter letras maiúsculas, minúsculas e números")
         expect(error.statusCode).toBe(422)
      }
   })

   test("Deve retornar um token de acesso", async () => {


      const result = await userBusiness.signup(
         "Astrodev",
         "astrodev@labenu.com.br",
         "astrolindo",
         "Bananinha1"
      )

      expect(result.accessToken).toBe("token de mentirinha")

   })
})

describe("Testa o método de login", () => {

   test("Deve retornar erro quando um email não for passado", async () => {
      expect.assertions(2)

      try {
         await userBusiness.login(
            "",
            "Bananinha1"
         )
      } catch (error) {
         expect(error.message).toBe("Missing input")
         expect(error.statusCode).toBe(422)
      }
   })

   test("Deve retornar erro quando uma senha não for passada", async () => {
      expect.assertions(2)

      try {
         await userBusiness.login(
            "astrodev@labenu.com.br",
            ""
         )
      } catch (error) {
         expect(error.message).toBe("Missing input")
         expect(error.statusCode).toBe(422)
      }
   })

   test("Deve retornar erro quando o usuário não for encontrado", async () => {
      expect.assertions(2)

      try {
         await userBusiness.login(
            "astrodev@labenu.com.br",
            "Bananinha1"
         )
      } catch (error) {
         expect(error.message).toBe("User not found")
         expect(error.statusCode).toBe(404)
      }
   })

   test("Deve retornar erro quando a senha estiver incorreta", async () => {
      expect.assertions(2)

      userDatabase.getUserByEmail = (email: string) => {
         return new User(
            "id",
            "Astrodev",
            "astrodev@labenu.com.br",
            "astrolindo",
            "Bananinha1"
         )
      }

      try {
         await userBusiness.login(
            "astrodev@labenu.com.br",
            "Bananinha"
         )
      } catch (error) {
         expect(error.message).toBe("Invalid password")
         expect(error.statusCode).toBe(422)
      }
   })

   test("Deve retornar um token de acesso", async () => {

      hashGenerator.compareHash = jest.fn(
         async (s: string, hash: string) => true
      )

      const result = await userBusiness.login(
         "astrodev@labenu.com.br",
         "Bananinha1"
      )

      expect(result.accessToken).toBe("token de mentirinha")

   })
})