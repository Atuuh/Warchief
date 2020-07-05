require("dotenv").config();

import discord from "discord.js";
import { User } from "./data/user";
import { connect, getUserRepository } from "./database";
import { parseCommand } from "./commands";

const client = new discord.Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

client.on("message", async (msg) => {
    if (msg.author.bot || msg.channel.type === "dm") return;
    const command = parseCommand(msg);
    if (command) command();
});

const start = async () => {
    await connect(process.env.DATABASE_URL || "");

    const repo = getUserRepository();

    const user = new User();
    user.firstName = "Flak";
    user.lastName = "Jack";
    user.age = 27;
    await repo.save(user);

    await client.login(process.env.DISCORD_BOT_TOKEN);
};

start();
