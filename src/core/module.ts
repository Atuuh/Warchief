import { Command } from "./command";
import { App } from "../app";

export type RegisterableModule = {
    register: (app: App) => Promise<Module> | Module;
};

export abstract class Module {
    abstract unregister(): Promise<void> | void;
    commands: Command[] = [];
}
