import { HandlerResult } from "@/types";
import { EventHandler } from "@/structures";
import { Guild } from "discord.js";

export default class GuildDeleteEventHandler extends EventHandler<"guildDelete"> {
    constructor() {
        super({
            name: "guildDelete"
        });
    }

    public async run(guild: Guild): Promise<HandlerResult> {
        const settings = await this.client.utils.getGuildSettings(guild.id);
        if (settings?.banLogChannel) {
            this.client.sender.msgChannel(
                settings.banLogChannel,
                {
                    content: `Bot not in server, bans are no longer being tracked for: ${guild.name}`
                },
                { msgType: "INVALID" }
            );
        }

        if (!settings?.isWhitelisted) {
            await this.client.prisma.guilds.delete({
                where: { discordId: guild.id }
            });
        }

        // Success
        return { result: "SUCCESS" };
    }
}
