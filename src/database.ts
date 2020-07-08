import { Connection, createConnection, ConnectionOptionsReader } from "typeorm";
import { TwitchAlertRepository } from "./data/twitchAlert";

let connection: Connection;

export const connect = async (database: string) => {
    connection = await createConnection({
        type: "postgres",
        url: database,
        entities: [__dirname + "/data/*.{ts,js}"],
        synchronize: true,
    });
};

export const disconnect = async () => {
    await connection.close();
};

export const connected = (): boolean => typeof connection !== "undefined";

export const getTwitchAlertRepository = () =>
    connection.getCustomRepository(TwitchAlertRepository);
