import { connect } from "./database";
import { Server } from "http";
import { wakeUpDyno } from "./wakeUpDyno";
import { config } from "./config";
import { TwitchService } from "./services/twitchService";
import { Module, RegisterableModule } from "./core/module";
import { Connection } from "typeorm";
import express, { Application } from "express";
import { TwitchAlertModule } from "./modules/twitchAlert/twitchAlertModule";
import { Command } from "./core/command";
import { DiscordService } from "./services/discordService";
import { Message } from "discord.js";
import { PingModule } from "./modules/ping/pingModule";

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

        const discordService = new DiscordService();

        return new App(webApp, server, database, twitchService, discordService);
    };

    private modules: Module[] = [];
    private commands: Command[] = [];
    private commandPrefix = "!";

    private constructor(
        public webApp: Application,
        public server: Server,
        public database: Connection,
        public twitchService: TwitchService,
        public discordService: DiscordService
    ) {
        if (this.isDyno) {
            wakeUpDyno(`https://${config.hostname}`, 25);
        }

        this.registerModule(PingModule);
        this.registerModule(TwitchAlertModule);

        this.discordService.onMessage((message) => this.handleMessage(message));
    }

    private async handleMessage(message: Message): Promise<void> {
        const [commandString, ...params] = message.content.split(/ +/);
        const isCommand = commandString.startsWith(this.commandPrefix);
        if (!isCommand) return;
        const commandName = commandString.slice(this.commandPrefix.length);

        const command = this.parseCommand(commandName);

        if (command && command.hasPermission(message)) {
            command.run(message, params);
        }
    }

    private parseCommand(commandName: string): Command | null {
        return (
            this.commands.find((c) => c.options.name === commandName) || null
        );
    }

    public async registerModule(moduleType: RegisterableModule): Promise<void> {
        const module = await moduleType.register(this);
        this.modules.push(module);
        this.commands.push(...module.commands);
    }

    public shutdown = async (): Promise<void> => {
        await this.server.close();
        await this.database.close();
        await this.twitchService.dispose();
        await this.discordService.dispose();
    };

    private isDyno = config.hostname.includes("herokuapp.com");
}
