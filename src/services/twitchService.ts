import TwitchClient, { HelixUser, HelixStream } from "twitch";
import WebHookListener, {
    ReverseProxyAdapter,
    ConnectCompatibleApp,
    Subscription,
} from "twitch-webhooks";

type TwitchConfig = {
    clientID: string;
    clientSecret: string;
    hostName: string;
    port: number;
    path: string;
};

interface Disposable {
    dispose(): void | Promise<void>;
}

export class TwitchService implements Disposable {
    private _twitchClient: TwitchClient;
    private _wehhookListener: WebHookListener;
    private _subscriptions: Map<string, Subscription> = new Map<
        string,
        Subscription
    >();

    constructor(config: TwitchConfig, app: ConnectCompatibleApp) {
        this._twitchClient = TwitchClient.withClientCredentials(
            config.clientID,
            config.clientSecret
        );

        const adapter = new ReverseProxyAdapter({
            hostName: config.hostName,
            listenerPort: config.port,
            pathPrefix: config.path,
        });

        this._wehhookListener = new WebHookListener(
            this._twitchClient,
            adapter,
            {
                logger: { minLevel: "trace" },
            }
        );

        this._wehhookListener.applyMiddleware(app);
    }

    dispose = async () => {
        const subs = [...this._subscriptions].map((s) => s[1].stop());
        await Promise.all(subs);
    };

    doesStreamExist = async (username: string): Promise<boolean> => {
        let user: HelixUser | null;
        try {
            user = await this._twitchClient.helix.users.getUserByName(username);
            return !!user;
        } catch (error) {
            return false;
        }
    };

    addStreamGoesLiveSubscription = async (
        userName: string,
        callback: (stream: HelixStream) => void
    ) => {
        if (this._subscriptions.has(userName)) return;

        let user = await this._twitchClient.helix.users.getUserByName(userName);
        if (!user) return null;

        let previousStream = await this._twitchClient.helix.streams.getStreamByUserId(
            user.id
        );

        const subscription = await this._wehhookListener.subscribeToStreamChanges(
            user.id,
            (stream) => {
                console.info(
                    `TwitchService: Received event from webhook for ${user?.displayName}`
                );
                if (!previousStream && stream) {
                    console.info(`TwitchService: ${user?.displayName}`);
                    callback(stream);
                }
                previousStream = stream || null;
            }
        );

        this._subscriptions.set(userName, subscription);
    };
}
