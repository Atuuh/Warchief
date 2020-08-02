import { TwitchAlertModule } from "./twitchAlert";
import { Command, CommandContext } from "../../command";
import { injectable } from "inversify";

@injectable()
export class TwitchAlertCommand extends Command {
    static commandName = "twitch";

    static create(
        context: CommandContext,
        params: string[]
    ): TwitchAlertCommand {
        return new TwitchAlertCommand(context, params);
    }

    private constructor(context: CommandContext, params: string[]) {
        super(context, params);
    }

    async execute(): Promise<void> {
        const { message } = this.context;
        if (!message.member?.hasPermission("ADMINISTRATOR")) return;

        const [subcommand, streamerName] = this.params;

        switch (subcommand) {
            case "add":
                if (!streamerName) return;

                const response = await module.addAlert({
                    streamerName,
                    channelId: message.channel.id,
                });

                if (!response.isLeft()) {
                    await message.reply(
                        `Added twitch alert for ${streamerName}`
                    );
                } else {
                    const error = response.value;
                    await message.reply(error.getValue().message);
                }

                break;

            case "remove":
                if (!streamerName) return;

                const result = await module.removeAlert({
                    streamerName,
                    channelId: message.channel.id,
                });

                if (!result.isLeft()) {
                    await message.reply(
                        `Removed twitch alert for ${streamerName}`
                    );
                } else {
                    const error = result.value;
                    await message.reply(error.getValue().message);
                }
                break;

            case "list":
                const r = await module.list(message.channel.id);
                if (r.isRight()) {
                    const formattedAlerts = r.value
                        .getValue()
                        .map((alert) => alert.streamerName)
                        .join(", \n");
                    await message.reply(
                        `The following streams have alerts setup: \n${formattedAlerts}`
                    );
                }
                break;

            default:
                await message.reply("Invalid command format");
                break;
        }
    }
}
