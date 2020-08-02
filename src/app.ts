import { setup as setupDiscord, DiscordClient } from "./discord";

import { connect } from "./database";
import { Server } from "http";
import { wakeUpDyno } from "./wakeUpDyno";
import { config } from "./config";
import { TwitchService } from "./services/twitch.service";
import { Module, RegisterableModule } from "./module";
import { Connection } from "typeorm";
import express, { Application } from "express";

export class App {
    public static create = async (): Promise<App> => {
        const webApp = express();
        const server = webApp.listen(config.port);
        const database = await connect(config.databaseUrl);

        const twitchService = new TwitchService(
            {
                clientID: config.twitchClientID,
                clientSecret: config.twitchClientSecret,
                hostName: config.hostname,
                port: config.port,
                path: "twitch",
            },
            webApp
        );

        const discordClient = await setupDiscord().client;

        return new App(webApp, server, database, twitchService, discordClient);
    };

    private modules: Module[] = [];

    private constructor(
        public webApp: Application,
        public server: Server,
        public database: Connection,
        public twitchService: TwitchService,
        public discordClient: DiscordClient
    ) {
        if (isDyno) {
            wakeUpDyno(`https://${config.hostname}`, 25);
        }
    }

    public async registerModule(moduleType: RegisterableModule): Promise<void> {
        const module = await moduleType.register(this);
        this.modules.push(module);
    }

    public shutdown = async (): Promise<void> => {
        await this.server.close();
        await this.database.close();
    };

    private isDyno = config.hostname.includes("herokuapp.com");
}
