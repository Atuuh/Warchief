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
import { init } from "./signals";
import { wakeUpDyno } from "./wakeUpDyno";
import { config } from "./config";

let server: Server;

export const start = async () => {
    const server = createServer();

    await connect(config.databaseUrl);
    await setupDiscord();
    await setupTwitch(server);

    server.listen(config.port);

    const repo = getTwitchAlertRepository();
    const twitchAlerts = await repo.getAll();
    twitchAlerts.map((alert) => {
        addStreamGoesLiveSubscription(
            alert.streamerName,
            defaultTwitchAlert(alert.channelId)
        );
    });

    if (isDyno) wakeUpDyno(`https://${config.hostname}`, 25);
};

const isDyno = config.hostname.includes("herokuapp.com");

const shutdown = init(() => async () => {
    await cleanupTwitch();
    server.close(() => {
        console.log("Server closed");
    });
    await disconnect();
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export const defaultTwitchAlert = (channelId: string) => (
    stream: HelixStream
) => sendMessage(channelId, `${stream.userDisplayName} has just gone live!`);
