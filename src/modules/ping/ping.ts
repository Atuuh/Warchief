import { createCommand } from "../../command";

export const pingCommand = createCommand("ping", (_, { message }) => {
    message.reply("pong");
});
