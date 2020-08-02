import { Client, Message } from "discord.js";
import { Disposable } from "../TwitchGoLiveEvent";
import { config } from "../config";
import { Command } from "../command";

export class DiscordService implements Disposable {
    private client: Client;
    private commands: typeof Command[] = [];

    constructor(private app: App) {
        this.client = new Client();

        this.client.once("ready", () =>
            console.log(`Logged in as ${this.client.user?.tag}`)
        );

        this.client.on("message", async (msg) => {
            if (msg.author.bot || msg.channel.type === "dm") return;
            const command = this.parseCommand(msg);
            if (command) await command.execute();
        });

        this.client.login(config.discordBotToken);
    }

    parseCommand(message: Message): Command | null {
        const [commandName, ...params] = message.content.split(/ +/);

        if (commandName.charAt(0) !== "!") return null;

        const command = this.commands.find(
            (c) => c.commandName === commandName.slice(1)
        );

        return command ? command.create({ message }, params) : null;
    }

    dispose(): void {
        this.client.destroy();
    }
}
