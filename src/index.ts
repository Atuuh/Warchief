import discord, { Channel, TextChannel } from "discord.js";
import { User } from "./data/user";
import { connect, getUserRepository } from "./database";

const client = new discord.Client();

require("dotenv").config();

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

client.on("message", async (msg) => {
    if (msg.content === "ping") {
        msg.reply("Pong");
    } else if (msg.content === "report") {
        const repo = getUserRepository();
        const users = await repo.find();

        const mappedUsers = users.map((u) => u.firstName);

        msg.reply(
            `There are ${
                users.length
            } users with the following names: ${mappedUsers.join(", ")}`
        );
    }
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
