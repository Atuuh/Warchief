import { PingCommand } from ".";
import { Module } from "../../core";

export class PingModule extends Module {
    static register = async () => {
        return new PingModule();
    };

    private constructor() {
        super();
        this.commands = [new PingCommand()];
    }

    unregister(): void {}
}
