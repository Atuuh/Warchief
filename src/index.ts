import discord, { Channel, TextChannel } from "discord.js";
import { createConnection } from "typeorm";
import { User } from "./data/user";
import { connect, getUserRepository } from "./database";
const client = new discord.Client();

require("dotenv").config();

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

client.on("message", (msg) => {
    if (msg.content === "ping") {
        msg.reply("Pong");
    }
});

const start = async () => {
    await connect("postgres");

    const repo = getUserRepository();

    const user = new User();
    user.firstName = "Flak";
    user.lastName = "Jack";
    user.age = 27;
    await repo.save(user);

    const allUser = await repo.find();
    console.log(allUser);
};

start();
