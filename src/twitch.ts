import twitch, { HelixUser } from "twitch";
import TwitchClient from "twitch";
import WebHookListener from "twitch-webhooks";
import { LogLevel } from "logger";

const twitchClientId = process.env.TWITCH_CLIENT_ID || "";
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET || "";

let twitchClient: TwitchClient;

export const setup = async () => {
    twitchClient = await twitch.withClientCredentials(
        twitchClientId,
        twitchClientSecret
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
