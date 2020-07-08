import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    EntityRepository,
    AbstractRepository,
} from "typeorm";
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

@EntityRepository(TwitchAlert)
export class TwitchAlertRepository extends AbstractRepository<TwitchAlert> {
    private find(streamerName: string, channelId: Snowflake) {
        return this.repository.findOne({ where: { streamerName, channelId } });
    }

    async add(streamerName: string, channelId: Snowflake) {
        const existingAlert = await this.find(streamerName, channelId);
        if (existingAlert) return;

        const alert = createTwitchAlert(streamerName, channelId);

        return this.repository.save(alert);
    }

    async remove(streamerName: string, channelId: Snowflake): Promise<boolean> {
        const result = await this.repository.delete({
            streamerName,
            channelId,
        });
        return !!result.affected && result.affected > 0;
    }

    list(channelId: Snowflake) {
        return this.repository.find({ channelId });
    }

    getAll() {
        return this.repository.find();
    }
}
