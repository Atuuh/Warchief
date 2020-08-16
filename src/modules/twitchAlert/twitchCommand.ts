import { Command } from "../../core/command";
import { Message } from "discord.js";
import { TwitchAlertModule } from "./twitchAlertModule";

export class TwitchAlertCommand extends Command {
    private readonly module: TwitchAlertModule;

    public constructor(module: TwitchAlertModule) {
        super({
            name: "twitch",
            description:
                "Add an alert to this channel when the specified channel goes live",
            guildOnly: true,
        });
        this.module = module;
    }

    async hasPermission(msg: Message) {
        return msg.member?.hasPermission("ADMINISTRATOR") || false;
    }

    async run(message: Message, args: string[]): Promise<void> {
        const [subcommand, streamerName] = args;

        switch (subcommand) {
            case "add":
                if (!streamerName) return;

                const response = await this.module.addAlert({
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

                const result = await this.module.removeAlert({
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
                const r = await this.module.list(message.channel.id);
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
