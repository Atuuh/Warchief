import dotenv from "dotenv";

dotenv.config();

export const config = {
    discordBotToken: process.env.DISCORD_BOT_TOKEN as string,
    twitchClientID: process.env.TWITCH_CLIENT_ID as string,
    twitchClientSecret: process.env.TWITCH_CLIENT_SECRET as string,
    databaseUrl: process.env.DATABASE_URL as string,
    hostname: process.env.HOSTNAME as string,
    port: Number(process.env.PORT),
};
