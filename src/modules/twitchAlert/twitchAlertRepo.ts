import { Snowflake } from "discord.js";
import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    EntityRepository,
    AbstractRepository,
    ValueTransformer,
} from "typeorm";

class LowercaseTransformer implements ValueTransformer {
    to(value: string): string {
        return value.toLowerCase();
    }
    from(value: string): string {
        return value.toLowerCase();
    }
}

@Entity()
export class TwitchAlert {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        transformer: new LowercaseTransformer(),
    })
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

    async findAll(streamerName: string): Promise<TwitchAlert[]> {
        return await this.repository.find({ where: { streamerName } });
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
