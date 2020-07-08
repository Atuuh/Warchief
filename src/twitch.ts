import TwitchClient, { HelixUser, HelixStream, HelixFollow } from "twitch";
import WebHookListener, {
    ConnectCompatibleApp,
    ReverseProxyAdapter,
    Subscription,
} from "twitch-webhooks";

require("dotenv").config();

const twitchClientId = process.env.TWITCH_CLIENT_ID || "";
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET || "";
const hostName = process.env.HOSTNAME || "d065809335c6.ngrok.io";
const port = Number(process.env.PORT);

let twitchClient: TwitchClient;
let webHookListener: WebHookListener;
const subscriptions: Map<string, Subscription> = new Map<
    string,
    Subscription
>();

export const setup = async (server: ConnectCompatibleApp) => {
    twitchClient = TwitchClient.withClientCredentials(
        twitchClientId,
        twitchClientSecret
    );

    const adapter = new ReverseProxyAdapter({
        hostName,
        listenerPort: port,
        pathPrefix: "twitch",
    });

    webHookListener = new WebHookListener(twitchClient, adapter, {
        logger: { minLevel: "trace" },
    });

    webHookListener.applyMiddleware(server);
};

export const cleanup = async () => {
    const subs = [...subscriptions].map((s) => s[1].stop());
    await Promise.all(subs);
};

export const addStreamFollowerSubscription = async (
    userName: string,
    callback: (follow: HelixFollow) => void
) => {
    const user = await twitchClient.helix.users.getUserByName(userName);
    if (!user) return null;

    webHookListener.subscribeToFollowsToUser(user.id, callback);
};

export const addStreamGoesLiveSubscription = async (
    userName: string,
    callback: (stream: HelixStream) => void
) => {
    let user = await twitchClient.helix.users.getUserByName(userName);
    if (!user) return null;

    let previousStream = await twitchClient.helix.streams.getStreamByUserId(
        user.id
    );

    const subscription = await webHookListener.subscribeToStreamChanges(
        user.id,
        (stream) => {
            if (!previousStream && stream) {
                callback(stream);
            }
            previousStream = stream || null;
        }
    );

    subscriptions.set(userName, subscription);
};

export const removeStreamGoesLiveSubscription = async (userName: string) => {
    subscriptions.get(userName)?.stop();
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
