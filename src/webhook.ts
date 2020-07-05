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
        hostName: "warchief-discord-bot.herokuapp.com/",
        ssl: false,
    });

    const listener = new WebHookListener(twitchClient, adapter, {
        logger: { minLevel: "trace" },
    });

    const atuuh = await twitchClient.helix.users.getUserByName("atuuh");

    const subscription = await listener.subscribeToFollowsFromUser(
        atuuh?.id || "",
        async (follow) => {
            console.log(`Follow changed`, follow);
        }
    );

    const app = express();

    listener.applyMiddleware(app);

    app.listen();

    app.use((req, res) => {
        console.log("EXPRESS", req);
    });

    console.log("SUBSCRIPTION", subscription["_client"]["_server"]);
};

setup();
