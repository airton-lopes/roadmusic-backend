import express from "express";
import { AddressInfo } from "net";
import dotenv from 'dotenv';
import { userRouter } from "./router/UserRouter";
import { musicRouter } from "./router/MusicRouter";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({ origin: true }));

app.use("/user", userRouter);
app.use("/music", musicRouter);

const server = app.listen(process.env.PORT || 3000, () => {
        if (server) {
            const address = server.address() as AddressInfo;
            console.log(`Server is running in http://localhost:${address.port}`);
        } else {
            console.error(`Failure upon starting server.`);
        }
    });