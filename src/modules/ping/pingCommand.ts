import { Command } from "../../core/command";
import { Message } from "discord.js";

export class PingCommand extends Command {
    constructor() {
        super({
            name: "ping",
            description: "Test",
            guildOnly: true,
        });
    }

    async run(msg: Message): Promise<void> {
        await msg.reply("pong!");
    }
}
