import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { Snowflake } from "discord.js";

@Entity()
export class TwitchAlert {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    streamerName!: string;

    @Column()
    channelId!: Snowflake;
}

export const createTwitchAlert = (
    streamerName: string,
    channelId: Snowflake
): TwitchAlert => ({ id: 0, streamerName: streamerName, channelId: channelId });
