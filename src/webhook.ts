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

const setup = async () => {
    const port = Number(process.env.PORT);

    const twitchClient = await twitch.withClientCredentials(
        twitchClientId,
        twitchClientSecret
    );

    const adapter = new EnvPortAdapter({
        hostName: "https://warchief-discord-bot.herokuapp.com/",
    });
    console.log("adapter", adapter);

    const listener = new WebHookListener(twitchClient, adapter, {
        logger: { minLevel: "trace" },
    });

    // await listener.listen();

    console.log("listener", listener);
    console.log(listener["_server"]);

    const atuuh = await twitchClient.helix.users.getUserByName("atuuh");
    console.log("atuuh", atuuh?.id);

    const subscription = await listener.subscribeToFollowsFromUser(
        atuuh?.id || "",
        async (follow) => {
            console.log(`Follow changed`, follow);
        }
    );

    console.log("subscription", subscription);

    var app = express();
    app.post("/:id", (req, res) => {
        console.log("Express request", req);
    });
    app.listen(Number(process.env.PORT), () =>
        console.log("Express is listening")
    );
};

setup();
