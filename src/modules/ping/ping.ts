import { Command } from "../../command";
import { Message } from "discord.js";
import { Module } from "../../module";

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

export class PingModule extends Module {
    static register = async () => {
        return new PingModule();
    };

    private constructor() {
        super();
        this.commands = [new PingCommand()];
    }

    unregister(): void {}
}
