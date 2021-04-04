import { AzureFunction, Context, HttpRequest } from "@azure/functions";

export const sayHello: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    context.log("Typescript HTTP trigger function processed a request.");

    if (req.query.name || req.body?.name) {
        context.res = {
            body: `Hello ${req.query.name || req.body.name}`,
        };
    } else {
        context.res = {
            status: 400,
            body:
                "Please pass a name on the query string or in the request body",
        };
    }
};
