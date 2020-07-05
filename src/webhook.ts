require("dotenv").config();

import WebHookListener, {
    ConnectionAdapter,
    ReverseProxyAdapter,
    SimpleAdapter,
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

    const adapter = new SimpleAdapter({
        hostName: address.ip(),
        listenerPort: port,
    });
    console.log("adapter", adapter);
    const listener = new WebHookListener(twitchClient, adapter, {
        logger: { minLevel: "trace" },
    });

    listener.listen();

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
