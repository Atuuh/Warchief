import { Message } from "discord.js";
import { pingCommand } from "./modules/ping/ping";
import { twitchCommand } from "./modules/twitch/twitch";

const commands = [pingCommand, twitchCommand];

export const parseCommand = (message: Message) => {
    const [command, ...params] = message.content.split(" ");

    if (command.charAt(0) !== "!") return;

    const commandd = commands.find((c) => c.name === command.slice(1));

    return () => commandd?.execute(params, { message });
};
