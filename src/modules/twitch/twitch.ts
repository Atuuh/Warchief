import { getTwitchAlertRepository } from "../../database";
import { doesStreamExist } from "../../twitch";
import { TwitchAlert, createTwitchAlert } from "../../data/twitchAlert";
import { createCommand } from "../../command";

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

                const existingAlert = await alertRepo.findOne({
                    where: {
                        streamerName: streamName,
                        channelId: message.channel.id,
                    },
                });
                if (existingAlert) {
                    await message.reply(
                        `Alert has already been setup for ${streamName}`
                    );
                    return;
                }

                const newAlert = createTwitchAlert(
                    streamName,
                    message.channel.id
                );

                await alertRepo.save(newAlert);

                await message.reply(`Added twitch alert for ${streamName}`);
                break;

            case "remove":
                if (!streamName) return;

                const result = await alertRepo.delete({
                    streamerName: streamName,
                    channelId: message.channel.id,
                });
                if (result.affected) {
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
                const alerts = await alertRepo.find();
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
