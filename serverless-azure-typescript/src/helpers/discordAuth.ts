import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { verifyKey } from "discord-interactions";

export const discordAuth = (fn: AzureFunction) => async (
    context: Context,
    req: HttpRequest
) => {
    context.log("Discord Authorization: Started");

    const signature = req.headers["x-signature-ed25519"];
    const timestamp = req.headers["x-signature-timestamp"];
    context.log(
        `"Discord Authorization: Verifying signature: ${signature} and timestamp: ${timestamp}`
    );
    if (!signature || !timestamp) {
        context.res = badRequest("Bad request");
        context.log(
            "Discord Authorization: Invalid Sig/Timestamp, full request follows",
            req
        );
        return;
    }

    const isValidRequest = verifyKey(
        req.rawBody,
        signature,
        timestamp,
        "63227ba16f76b27647cedceb00453722158949bc86fb93f4de5e81c797b9162b"
    );

    if (!isValidRequest) {
        context.log("Discord Authorization: Invalid request");
        context.log("Discord Authorization: Raw request", req);

        return {
            status: 401,
            body: "Bad request signature",
        };
    } else {
        context.log("Discord Authorization: Verified");

        fn(context, req);
    }
};

const badRequest = (message: string) => ({
    status: 401,
    body: message,
});
