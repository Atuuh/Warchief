import { Message } from "discord.js";

export abstract class Command {
    protected constructor(
        protected context: CommandContext,
        protected params: string[]
    ) {}
    static commandName: string;
    abstract execute(): Promise<void>;
    static create(context: CommandContext, params: string[]): Command {
        throw new Error("Method not implemented.");
    }
}
export interface CommandContext {
    message: Message;
}
