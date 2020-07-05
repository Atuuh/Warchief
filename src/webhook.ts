import WebHookListener from "twitch-webhooks";
import twitch from "twitch";

const twitchClientId = process.env.TWITCH_CLIENT_ID || "";
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET || "";

const setup = async () => {
    const twitchClient = await twitch.withClientCredentials(
        twitchClientId,
        twitchClientSecret
    );

    const listener = await WebHookListener.create(twitchClient, {
        hostName: "68884b3dc79a.ngrok.io",
        port: Number(process.env.PORT) || 8090,
        reverseProxy: { port: 80, ssl: true },
        logger: { minLevel: "trace" },
    });

    listener.listen();

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
