import { Message } from "discord.js";

import { Command } from "../../core";

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
