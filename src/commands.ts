import { Message } from "discord.js";
import { pingCommand } from "./modules/ping/ping";
import { twitchCommand } from "./modules/twitchAlert/twitch.command";
import { Command } from "./command";

const commands = [pingCommand];

export const parseCommand = (message: Message) => {
    const [commandName, ...params] = message.content.split(/ +/);

    if (commandName.charAt(0) !== "!" || message.author.bot) return;

    const command = commands.find((c) => c.name === commandName.slice(1));

    return () => command?.execute(params, { message });
};

export const addCommand = (command: Command) => commands.push(command);
