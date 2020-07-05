import { Message } from "discord.js";
import { pingCommand } from "./modules/ping/ping";
import { twitchCommand } from "./modules/twitch/twitch";

const commands = [pingCommand, twitchCommand];

export const parseCommand = (message: Message) => {
    const [commandName, ...params] = message.content.split(/ +/);

    if (commandName.charAt(0) !== "!" || message.author.bot) return;

    const commandd = commands.find((c) => c.name === commandName.slice(1));

    return () => commandd?.execute(params, { message });
};
