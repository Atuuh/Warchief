import { Command } from "./command";
import { App } from "./app";
import { TwitchAlertModule } from "./modules/twitchAlert/twitchAlert";

export type RegisterableModule = {
    register: (app: App) => Promise<Module> | Module;
};

export abstract class Module {
    abstract unregister(): Promise<void> | void;
}

export abstract class CommandModule {
    abstract command: Command;
}
