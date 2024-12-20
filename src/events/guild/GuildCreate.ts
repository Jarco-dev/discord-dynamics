import { HandlerResult } from "@/types";
import { EventHandler } from "@/structures";
import { Guild } from "discord.js";

export default class GuildCreateEventHandler extends EventHandler<"guildCreate"> {
    constructor() {
        super({
            name: "guildCreate"
        });
    }

    public async run(guild: Guild): Promise<HandlerResult> {
        if (guild.id === this.client.sConfig.MAIN_GUILD)
            return { result: "OTHER", note: "Guild is the main guild" };

        const settings = await this.client.utils.getGuildSettings(guild.id);
        if (!settings || !settings.isWhitelisted) {
            this.client.logger.info(
                `Bot leaving un whitelisted guild: ${guild.name}`
            );
            guild.leave();

            const botMember = await guild.members.fetch(this.client.user!.id);
            if (
                guild.systemChannel &&
                this.client.utils.checkPermissions(botMember, [
                    "ViewChannel",
                    "SendMessages"
                ])
            ) {
                this.client.sender.msgChannel(
                    guild.systemChannel,
                    {
                        content:
                            "This server doesn't seem to be whitelisted, bot leaving server"
                    },
                    { msgType: "INVALID" }
                );
            }
            return { result: "OTHER", note: "Guild not whitelisted" };
        }

        if (settings.banLogChannel) {
            this.client.sender.msgChannel(
                settings.banLogChannel,
                {
                    content: `Bot has been invited, bans are now being tracked for: ${guild.name}`
                },
                { msgType: "SUCCESS" }
            );
        }

        // Success
        return { result: "SUCCESS" };
    }
}
