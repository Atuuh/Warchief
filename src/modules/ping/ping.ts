import { Command, CommandContext } from "../../command";

export class PingCommand extends Command {
    static commandName = "ping";

    static create(context: CommandContext, params: string[]): PingCommand {
        return new PingCommand(context, params);
    }

    private constructor(context: CommandContext, params: string[]) {
        super(context, params);
    }

    async execute(): Promise<void> {
        await this.context.message.reply(`pong!`);
    }
}
