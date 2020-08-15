import { Message } from "discord.js";

interface CommandOptions {
    name: string;
    description: string;
    guildOnly: boolean;
}

export abstract class Command {
    protected constructor(public readonly options: CommandOptions) {}

    async hasPermission(msg: Message): Promise<boolean> {
        return true;
    }

    abstract async run(msg: Message, args?: object): Promise<unknown>;
}
