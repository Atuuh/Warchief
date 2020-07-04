import { Connection, createConnection } from "typeorm";
import { User } from "./data/user";

let connection: Connection;

export const connect = async (database: string): Promise<void> => {
    connection = await createConnection({
        type: "postgres",
        url: database,
        entities: [__dirname + "/data/*.ts"],
        synchronize: true,
    });
};

export const connected = (): boolean => typeof connection !== "undefined";

export const getUserRepository = () => connection.getRepository(User);
