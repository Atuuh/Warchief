import { Message } from "discord.js";

interface Command {
    name: string;
    execute: CommandExecuteFn;
}

type CommandExecuteFn = (
    params: string[],
    context: CommandContext
) => void | Promise<void>;

interface CommandContext {
    message: Message;
}

export const createCommand = (
    name: string,
    handler: CommandExecuteFn
): Command => ({ name, execute: handler });
