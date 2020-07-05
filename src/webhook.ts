require("dotenv").config();

import WebHookListener from "twitch-webhooks";
import twitch from "twitch";

const twitchClientId = process.env.TWITCH_CLIENT_ID || "";
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET || "";

console.log("PORT", process.env.PORT);

const setup = async () => {
    const port = Number(process.env.PORT);

    const twitchClient = await twitch.withClientCredentials(
        twitchClientId,
        twitchClientSecret
    );

    const listener = await WebHookListener.create(twitchClient, {
        port: 8090,
        reverseProxy: { port: port, ssl: true },
        logger: { minLevel: "trace" },
    });
    console.log("PORT", process.env.PORT);

    listener.listen();
    console.log("PORT", process.env.PORT);

    const atuuh = await twitchClient.helix.users.getUserByName("atuuh");
    console.log("atuuh", atuuh);

    const subscription = await listener.subscribeToFollowsFromUser(
        atuuh?.id || "",
        async (follow) => {
            console.log(`Follow changed`, follow);
        }
    );
};

setup();
