import { App } from "./app";
import { TwitchAlertModule } from "./modules/twitchAlert/twitchAlertModule";
import "reflect-metadata";

(async () => {
    const app = await App.create();

    process.on("SIGINT", app.shutdown);
    process.on("SIGTERM", app.shutdown);
})();
