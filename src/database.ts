import { Connection, createConnection } from "typeorm";

let connection: Connection;

export const connect = async (database: string) => {
    connection = await createConnection({
        type: "postgres",
        url: database,
        entities: [__dirname + "/modules/**/*.ts"],
        synchronize: true,
    });

    return connection;
};

export const disconnect = async () => {
    await connection.close();
};

export const connected = (): boolean => typeof connection !== "undefined";
