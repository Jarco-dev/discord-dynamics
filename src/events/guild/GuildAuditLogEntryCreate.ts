import { HandlerResult } from "@/types";
import { EventHandler } from "@/structures";
import { Guild, GuildAuditLogsEntry, AuditLogEvent } from "discord.js";

export default class GuildAuditLogEntryCreate extends EventHandler<"guildAuditLogEntryCreate"> {
    constructor() {
        super({
            name: "guildAuditLogEntryCreate"
        });
    }

    public async run(
        log: GuildAuditLogsEntry,
        guild: Guild
    ): Promise<HandlerResult> {
        if (log.action !== AuditLogEvent.MemberBanAdd) {
            return {
                result: "OTHER",
                note: "Action not used"
            };
        }
        if (!log.targetId || !log.executorId) {
            return {
                result: "OTHER",
                note: "Action missing information"
            };
        }

        const settings = await this.client.utils.getGuildSettings(guild.id);
        if (!settings || !settings.isWhitelisted || !settings.banLogChannel) {
            return {
                result: "OTHER",
                note: "Guild not white listed or configured"
            };
        }

        const target = await this.client.users.fetch(log.targetId);
        const executor = await this.client.users.fetch(log.targetId);
        const embed = this.client.utils
            .defaultEmbed()
            .setTitle(`Member banned: ${target.username}`)
            .setThumbnail(target.displayAvatarURL())
            .setFields([
                {
                    name: "Banned by",
                    value: `${executor}\n${executor.username}\n${executor.id}`,
                    inline: true
                },
                {
                    name: "User",
                    value: `${target}\n${target.id}`,
                    inline: true
                },
                {
                    name: "Reason",
                    value: log.reason ? log.reason : "No reason given",
                    inline: true
                }
            ]);
        this.client.sender.msgChannel(settings.banLogChannel, {
            embeds: [embed]
        });

        // Success
        return { result: "SUCCESS" };
    }
}
