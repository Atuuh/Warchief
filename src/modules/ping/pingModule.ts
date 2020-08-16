import { Module } from "../../core/module";
import { PingCommand } from "./pingCommand";

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
