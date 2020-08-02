import { Client, TextChannel } from "discord.js";

import { parseCommand } from "./commands";
import { config } from "./config";

let client: Client;

export type DiscordClient = Client;

export const setup = () => {
    client = new Client();

    client.once("ready", () => {
        console.log(`Logged in as ${client.user?.tag}`);
    });

    client.on("message", async (msg) => {
        if (msg.author.bot || msg.channel.type === "dm") return;
        const command = parseCommand(msg);
        if (command) command();
    });

    client.login(config.discordBotToken);

    return { client, sendMessage };
};

export const cleanup = () => {
    client.destroy();
};

export const sendMessage = async (channelId: string, message: string) => {
    const channel = await client.channels.fetch(channelId);
    if (channel instanceof TextChannel) {
        channel.send(message);
    }
};
