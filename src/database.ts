import { Connection, createConnection } from "typeorm";

let connection: Connection;

export const connect = async (database: string) => {
    connection = await createConnection({
        type: "postgres",
        url: database,
        entities: ["src/modules/**/*.{ts, js}"],
        synchronize: true,
    });

    return connection;
};

export const disconnect = async () => {
    await connection.close();
};

export const connected = (): boolean => typeof connection !== "undefined";
