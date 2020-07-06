require("dotenv").config();

import discord, { Channel, TextChannel, GuildChannel } from "discord.js";
import { connect } from "./database";
import { parseCommand } from "./commands";
import { setup } from "./twitch";

const client = new discord.Client();

client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

client.on("message", async (msg) => {
    if (msg.author.bot || msg.channel.type === "dm") return;
    const command = parseCommand(msg);
    if (command) command();
});

const start = async () => {
    await connect(process.env.DATABASE_URL || "");

    await client.login(process.env.DISCORD_BOT_TOKEN);

    await setup();
};

export const sendMessage = async (message: string) => {
    const channel = await client.channels.fetch("410111956830388234");
    if (channel instanceof TextChannel) {
        channel.send(message);
    }
};

start();
