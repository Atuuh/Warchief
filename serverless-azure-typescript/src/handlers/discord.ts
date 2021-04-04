import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import { discordAuth } from "../helpers/discordAuth";

const handleInteraction: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    context.log("HTTP trigger function processed a request.");

    const interaction = req.body;

    if (
        interaction &&
        interaction.type === InteractionType.APPLICATION_COMMAND
    ) {
        context.res = {
            body: {
                type: 4,
                data: {
                    content: `You used: ${interaction.data.name}`,
                },
            },
        };
    } else {
        context.res = {
            body: { type: InteractionResponseType.PONG },
        };
    }
};

export const interaction = discordAuth(handleInteraction);
