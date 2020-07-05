require("dotenv").config();

import WebHookListener, {
    ConnectionAdapter,
    ReverseProxyAdapter,
} from "twitch-webhooks";
import twitch from "twitch";
import address from "address";

const twitchClientId = process.env.TWITCH_CLIENT_ID || "";
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET || "";

console.log("PORT", process.env.PORT);

const setup = async () => {
    const port = Number(process.env.PORT);

    const twitchClient = await twitch.withClientCredentials(
        twitchClientId,
        twitchClientSecret
    );

    const listener = new WebHookListener(
        twitchClient,
        new ReverseProxyAdapter({
            hostName: address.ip(),
            ssl: false,
            port: 8090,
            listenerPort: port,
        }),
        { logger: { minLevel: "trace" } }
    );
    console.log("PORT", process.env.PORT);

    listener.listen();
    console.log("PORT", process.env.PORT);

    const atuuh = await twitchClient.helix.users.getUserByName("atuuh");
    console.log("atuuh", atuuh?.id);

    const subscription = await listener.subscribeToFollowsFromUser(
        atuuh?.id || "",
        async (follow) => {
            console.log(`Follow changed`, follow);
        }
    );
};

setup();
