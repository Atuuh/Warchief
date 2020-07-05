require("dotenv").config();

import WebHookListener, { EnvPortAdapter } from "twitch-webhooks";
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

    await cleanup(twitchClient);

    const adapter = new EnvPortAdapter({
        hostName: "warchief-discord-bot.herokuapp.com",
    });

    const listener = new WebHookListener(twitchClient, adapter, {
        logger: { minLevel: "trace" },
    });

    listener.listen();

    twitchClient.helix.subscriptions;

    const atuuh = await twitchClient.helix.users.getUserByName("atuuh");

    const subscription = await listener.subscribeToFollowsFromUser(
        atuuh?.id || "",
        async (follow) => {
            console.log(`Follow changed`, follow);
        }
    );
};

const cleanup = async (client: twitch) => {
    const subs = await client.helix.webHooks.getSubscriptions();
    const hooks = await subs.getAll();
    hooks.forEach((h) => h.unsubscribe());
};

setup();
