import "reflect-metadata";
import { App } from "./app";

(async () => {
    const app = await App.create();

    process.on("SIGINT", app.shutdown);
    process.on("SIGTERM", app.shutdown);
})();
