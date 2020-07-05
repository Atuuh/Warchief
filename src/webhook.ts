require("dotenv").config();

import WebHookListener, {
    ConnectionAdapter,
    ReverseProxyAdapter,
    SimpleAdapter,
    EnvPortAdapter,
} from "twitch-webhooks";
import twitch from "twitch";
import express from "express";

const twitchClientId = process.env.TWITCH_CLIENT_ID || "";
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET || "";

console.log("PORT", process.env.PORT);

import http from "http";

const setup = async () => {
    const port = Number(process.env.PORT);

    const twitchClient = await twitch.withClientCredentials(
        twitchClientId,
        twitchClientSecret
    );

    const adapter = new EnvPortAdapter({
        hostName: "https://warchief-discord-bot.herokuapp.com/",
    });

    const listener = new WebHookListener(twitchClient, adapter, {
        logger: { minLevel: "trace" },
    });

    await listener.listen();

    const atuuh = await twitchClient.helix.users.getUserByName("atuuh");

    const subscription = await listener.subscribeToFollowsFromUser(
        atuuh?.id || "",
        async (follow) => {
            console.log(`Follow changed`, follow);
        }
    );

    await subscription.start();

    subscription._verify();

    console.log("SUBSCRIPTION", subscription);
};

setup();
