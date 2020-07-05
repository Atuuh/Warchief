import twitch, { HelixUser } from "twitch";
import TwitchClient from "twitch";
import WebHookListener from "twitch-webhooks";

const twitchClientId = process.env.TWITCH_CLIENT_ID || "";
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET || "";

let twitchClient: TwitchClient;

export const setup = async () => {
    twitchClient = await twitch.withClientCredentials(
        twitchClientId,
        twitchClientSecret
    );

    const listener = await WebHookListener.create(twitchClient, {
        port: Number(process.env.PORT) || 8090,
        logger: { minLevel: "trace" },
    });
    await listener.listen();

    const atuuh = await twitchClient.helix.users.getUserByName("atuuh");
    console.log("atuuh", atuuh);

    const subscription = await listener.subscribeToFollowsFromUser(
        atuuh?.id || "",
        async (follow) => {
            console.log(`Follow changed`, follow);
        }
    );
};

export const doesStreamExist = async (username: string): Promise<boolean> => {
    let user: HelixUser | null;
    try {
        user = await twitchClient.helix.users.getUserByName(username);
        return !!user;
    } catch (error) {
        return false;
    }
};
