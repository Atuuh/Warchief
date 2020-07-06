require("dotenv").config();

import WebHookListener, { EnvPortAdapter } from "twitch-webhooks";
import twitch from "twitch";
import express from "express";
import { sendMessage } from ".";

const twitchClientId = process.env.TWITCH_CLIENT_ID || "";
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET || "";

console.log("PORT", process.env.PORT);

const setup = async () => {
    const port = Number(process.env.PORT);

    const twitchClient = await twitch.withClientCredentials(
        twitchClientId,
        twitchClientSecret
    );

    const server = express();

    const adapter = new EnvPortAdapter({
        hostName: "warchief-discord-bot.herokuapp.com",
    });

    const listener = new WebHookListener(twitchClient, adapter, {
        logger: { minLevel: "trace" },
    });

    listener.applyMiddleware(server);

    const dunnykin = await twitchClient.helix.users.getUserByName("dunnykin");

    const subscription = await listener.subscribeToFollowsToUser(
        dunnykin?.id || "",
        async (follow) => {
            await sendMessage(
                `${follow.userDisplayName} is now following ${follow.followedUserDisplayName}!`
            );
        }
    );

    server.listen(port);
};

const cleanup = async (client: twitch) => {
    const subs = await client.helix.webHooks.getSubscriptions();
    const hooks = await subs.getAll();
    hooks.forEach((h) => h.unsubscribe());
};

setup();
