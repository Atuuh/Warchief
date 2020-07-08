import { doesStreamExist, addStreamGoesLiveSubscription } from "../../twitch";
import { createCommand } from "../../command";
import { getTwitchAlertRepository } from "../../database";
import { defaultTwitchAlert } from "../../app";

export const twitchCommand = createCommand(
    "twitch",
    async (params, { message }) => {
        if (!message.member?.hasPermission("ADMINISTRATOR")) return;

        const [subcommand, streamName] = params;

        const alertRepo = await getTwitchAlertRepository();

        switch (subcommand) {
            case "add":
                if (!streamName) return;

                const streamExists = await doesStreamExist(streamName);
                if (!streamExists) {
                    await message.reply(
                        `The twitch channel '${streamName}' does not exist`
                    );
                    return;
                }

                const response = await alertRepo.add(
                    streamName,
                    message.channel.id
                );

                if (!response) {
                    await message.reply(
                        `Alert has already been setup for ${streamName}`
                    );
                    return;
                }

                addStreamGoesLiveSubscription(
                    streamName,
                    defaultTwitchAlert(response.channelId)
                );

                await message.reply(`Added twitch alert for ${streamName}`);
                break;

            case "remove":
                if (!streamName) return;

                const result = await alertRepo.remove(
                    streamName,
                    message.channel.id
                );
                if (result) {
                    await message.reply(
                        `Deleted twitch alert for ${streamName}`
                    );
                } else {
                    await message.reply(
                        `Cannot delete twitch alert for ${streamName}`
                    );
                }
                break;

            case "list":
                const alerts = await alertRepo.list(message.channel.id);
                await message.reply(
                    `The following streams have alerts set up: \n${alerts
                        .map((a) => a.streamerName)
                        .join(", \n")}`
                );
                break;

            default:
                await message.reply("Invalid command format");
                break;
        }
    }
);
