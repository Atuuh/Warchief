import { Client, Message } from "discord.js";
import { Disposable } from "../TwitchGoLiveEvent";
import { config } from "../config";
import { Command } from "../command";

type MessageHandler = (message: Message) => Promise<void>;

export class DiscordService implements Disposable {
    private client: Client;
    private handler: MessageHandler | undefined;

    constructor() {
        this.client = new Client();

        this.client.once("ready", () =>
            console.log(`Logged in as ${this.client.user?.tag}`)
        );

        this.client.on("message", async (msg) => {
            if (!this.handler || msg.author.bot || msg.channel.type === "dm")
                return;
            await this.handler(msg);
        });

        this.client.login(config.discordBotToken);
    }

    onMessage(handler: (message: Message) => Promise<void>) {
        this.handler = handler;
    }

    dispose(): void {
        this.client.destroy();
    }
}
