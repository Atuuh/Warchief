import { createServer } from "./server";
import {
    setup as setupTwitch,
    cleanup as cleanupTwitch,
    addStreamGoesLiveSubscription,
} from "./twitch";
import { setup as setupDiscord, sendMessage } from "./discord";

import { connect, getTwitchAlertRepository, disconnect } from "./database";
import { HelixStream } from "twitch/lib";
import { Server } from "http";

require("dotenv").config();

const port = Number(process.env.PORT);
const databaseUrl = process.env.DATABASE_URL || "";
let server: Server;

export const start = async () => {
    const server = createServer();

    await connect(databaseUrl);
    await setupDiscord();
    await setupTwitch(server);

    server.listen(port);

    const repo = getTwitchAlertRepository();
    const twitchAlerts = await repo.getAll();
    twitchAlerts.map((alert) => {
        addStreamGoesLiveSubscription(
            alert.streamerName,
            defaultTwitchAlert(alert.channelId)
        );
    });
};

const cleanup = async () => {
    await cleanupTwitch();
    server.close(() => {
        console.log("Server closed");
    });
    await disconnect();
};

process.on("SIGTERM", cleanup);

export const defaultTwitchAlert = (channelId: string) => (
    stream: HelixStream
) => sendMessage(channelId, `${stream.userDisplayName} has just gone live!`);
