import { TwitchService } from "../../services/twitch.service";
import { TwitchAlertRepository, TwitchAlert } from "../../data/twitchAlert";
import { TextChannel } from "discord.js";
import { DomainError } from "../../core/domainError";
import { Result } from "../../core/result";
import { Either, left, right } from "../../core/either";
import { AppError } from "../../core/appError";
import { Command } from "../../command";
import { App } from "../../app";
import { Module } from "../../module";
import { TwitchAlertCommand } from "./twitch.command";
import { DiscordService } from "../../services/discord.service";

type TwitchAlertNoId = Omit<TwitchAlert, "id">;

export class TwitchAlertModule extends Module {
    static register = async ({
        twitchService,
        discordService,
        database,
    }: App) => {
        const repo = database.getCustomRepository(TwitchAlertRepository);
        const module = new TwitchAlertModule(
            twitchService,
            discordService,
            repo
        );

        const existingAlerts = await repo.getAll();
        const alerts = existingAlerts.map((alert) =>
            twitchService.addStreamGoesLiveSubscription(
                alert.streamerName,
                () => module.onStreamGoneLive(alert)
            )
        );
        await Promise.all(alerts);

        return module;
    };

    public commands: Command[];

    private constructor(
        private readonly _twitchService: TwitchService,
        private readonly _discordService: DiscordService,
        private readonly _repo: TwitchAlertRepository
    ) {
        super();
        this.commands = [new TwitchAlertCommand(this)];
    }

    onStreamGoneLive = async (alert: TwitchAlert) => {
        const channel = (await this._discordService.getChannel(
            alert.channelId
        )) as TextChannel;

        const everyoneRole = channel.guild.roles.everyone;
        const message = `Hey ${everyoneRole}, ${alert.streamerName} is going live! Go say hello at https://www.twitch.tv/${alert.streamerName}`;

        channel.send(message);
    };

    addAlert = async ({
        streamerName,
        channelId,
    }: TwitchAlertNoId): Promise<AddAlertResponse> => {
        const streamExists = await this._twitchService.doesStreamExist(
            streamerName
        );

        if (!streamExists) {
            return left(AddAlertError.StreamNotFound.create(streamerName));
        }

        try {
            const alert = await this._repo.add(streamerName, channelId);

            if (!alert) {
                return left(
                    AddAlertError.AlertAlreadySetup.create(streamerName)
                );
            }

            this._twitchService.addStreamGoesLiveSubscription(
                streamerName,
                () => this.onStreamGoneLive(alert)
            );
        } catch (err) {
            return left(AppError.UnexpectedError.create(err));
        }

        return right(Result.ok());
    };

    removeAlert = async ({
        streamerName,
        channelId,
    }: TwitchAlertNoId): Promise<RemoveAlertResponse> => {
        try {
            const result = await this._repo.remove(streamerName, channelId);
            if (result) return right(Result.ok());
            else
                return left(
                    RemoveAlertError.AlertNotSetup.create(streamerName)
                );
        } catch (err) {
            return left(AppError.UnexpectedError.create(err));
        }
    };

    list = async (channelId: string) => {
        const alerts = await this._repo.list(channelId);

        return right(Result.ok(alerts));
    };

    unregister = () => {};
}

type AddAlertResponse = Either<
    AddAlertError.StreamNotFound | AddAlertError.AlertAlreadySetup,
    Result<any>
>;
namespace AddAlertError {
    export class StreamNotFound extends Result<DomainError> {
        private constructor(streamName: string) {
            super(false, {
                message: `The stream '${streamName}' was not found`,
            });
        }

        public static create = (streamName: string) =>
            new StreamNotFound(streamName);
    }

    export class AlertAlreadySetup extends Result<DomainError> {
        private constructor(streamName: string) {
            super(false, {
                message: `The stream '${streamName}' already has an alert in this channel`,
            });
        }

        public static create = (streamName: string) =>
            new AlertAlreadySetup(streamName);
    }
}

type RemoveAlertResponse = Either<RemoveAlertError.AlertNotSetup, Result<any>>;
namespace RemoveAlertError {
    export class AlertNotSetup extends Result<DomainError> {
        private constructor(streamName: string) {
            super(false, {
                message: `The stream '${streamName}' does not have an alert setup in this channel`,
            });
        }

        public static create = (streamName: string) =>
            new AlertNotSetup(streamName);
    }
}
