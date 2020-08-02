import { App } from "./app";
import { TwitchAlertModule } from "./modules/twitchAlert/twitchAlert";
import "reflect-metadata";

(async () => {
    const app = await App.create();

    await app.registerModule(TwitchAlertModule);

    process.on("SIGINT", app.shutdown);
    process.on("SIGTERM", app.shutdown);
})();
