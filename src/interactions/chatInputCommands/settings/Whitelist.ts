import { HandlerResult } from "@/types";
import { ChatInputCommand } from "@/structures";
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ChannelType,
    GuildTextBasedChannel
} from "discord.js";
import { BotPermissionsBitField } from "@/classes";
import { GuildSetting } from "@prisma/client";

export default class WhitelistChatInputCommand extends ChatInputCommand {
    constructor() {
        super({
            mainGuildOnly: true,
            builder: new SlashCommandBuilder()
                .setName("whitelist")
                .setDescription("Add or remove guilds from the whitelist")
                .setDMPermission(false)
                .addSubcommand(builder =>
                    builder
                        .setName("add")
                        .setDescription("Add a guild to the whitelist")
                        .addStringOption(builder =>
                            builder
                                .setName("guild-id")
                                .setDescription("The guild to whitelist")
                                .setRequired(true)
                        )
                        .addChannelOption(builder =>
                            builder
                                .setName("ban-log-channel")
                                .setDescription(
                                    "The channel to log the server bans"
                                )
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand(builder =>
                    builder
                        .setName("remove")
                        .setDescription("Remove a guild from the whitelist")
                        .addStringOption(builder =>
                            builder
                                .setName("guild-id")
                                .setDescription("The guild to un whitelist")
                                .setRequired(true)
                        )
                )
                .addSubcommand(builder =>
                    builder
                        .setName("view")
                        .setDescription("View all whitelisted servers")
                )
        });
    }

    public async run(i: ChatInputCommandInteraction): Promise<HandlerResult> {
        switch (i.options.getSubcommand()) {
            case "add":
                return this.runAdd(i);
            case "remove":
                return this.runRemove(i);
            case "view":
                return this.runView(i);

            default:
                return {
                    result: "ERRORED",
                    note: "Whitelist subcommand executor not found",
                    error: new Error("Command executor not found")
                };
        }
    }

    public async runAdd(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const permissions = await this.client.utils.getMemberBotPermissions(i);
        if (!permissions.has(BotPermissionsBitField.Flags.WhitelistAdd)) {
            this.client.sender.reply(
                i,
                {
                    content:
                        "You don't have the permissions required to do this",
                    ephemeral: true
                },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "USER_MISSING_PERMISSIONS" };
        }

        const guildId = i.options.getString("guild-id", true);
        if (!/[0-9]{17,19}/.test(guildId)) {
            this.client.sender.reply(
                i,
                {
                    content: "The given guild id is a invalid id",
                    ephemeral: true
                },
                { msgType: "INVALID" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        const settings = await this.client.utils.getGuildSettings(guildId);
        if (settings?.isWhitelisted) {
            this.client.sender.reply(
                i,
                {
                    content: "The given guild is already whitelisted",
                    ephemeral: true
                },
                { msgType: "INVALID" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        const banLogChannel = i.options.getChannel(
            "ban-log-channel",
            true
        ) as GuildTextBasedChannel;
        const botMember = await i.guild!.members.fetch(this.client.user!.id);
        const missingPerms = this.client.utils.checkPermissions(
            botMember,
            ["ViewChannel", "SendMessages"],
            banLogChannel
        );
        if (!missingPerms.hasAll) {
            const embed = this.client.utils
                .defaultEmbed()
                .setTitle("The bot is missing some permissions")
                .setDescription(
                    `Please make sure the bot has the following permissions in ${banLogChannel}\n\n\`View channel\`, \`Send messages\``
                );
            this.client.sender.reply(i, { embeds: [embed], ephemeral: true });
            return { result: "INVALID_ARGUMENTS" };
        }

        await this.client.prisma.guilds.upsert({
            where: { discordId: guildId },
            create: {
                discordId: guildId,
                Settings: {
                    create: [
                        { type: GuildSetting.IS_WHITELISTED, value: "1" },
                        {
                            type: GuildSetting.BAN_LOG_CHANNEL,
                            value: banLogChannel.id
                        }
                    ]
                }
            },
            update: {
                Settings: {
                    create: [
                        { type: GuildSetting.IS_WHITELISTED, value: "1" },
                        {
                            type: GuildSetting.BAN_LOG_CHANNEL,
                            value: banLogChannel.id
                        }
                    ]
                }
            }
        });

        this.client.sender.reply(
            i,
            { content: "Guild has been added" },
            { msgType: "SUCCESS" }
        );
        this.client.sender.msgChannel(
            banLogChannel,
            {
                content:
                    "Server has been whitelisted, waiting for bot to be invited"
            },
            { msgType: "SUCCESS" }
        );

        return { result: "SUCCESS" };
    }

    public async runRemove(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const permissions = await this.client.utils.getMemberBotPermissions(i);
        if (!permissions.has(BotPermissionsBitField.Flags.WhitelistRemove)) {
            this.client.sender.reply(
                i,
                {
                    content:
                        "You don't have the permissions required to do this",
                    ephemeral: true
                },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "USER_MISSING_PERMISSIONS" };
        }

        const guildId = i.options.getString("guild-id", true);
        if (
            !/[0-9]{17,19}/.test(guildId) ||
            this.client.sConfig.MAIN_GUILD === guildId
        ) {
            this.client.sender.reply(
                i,
                {
                    content: "The given guild id is a invalid id",
                    ephemeral: true
                },
                { msgType: "INVALID" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        const settings = await this.client.utils.getGuildSettings(guildId);
        if (!settings || !settings.isWhitelisted) {
            this.client.sender.reply(
                i,
                {
                    content: "The given guild is not whitelisted",
                    ephemeral: true
                },
                { msgType: "INVALID" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        this.client.guilds.cache.get(guildId)?.leave();
        await this.client.prisma.guildSettings.updateMany({
            where: {
                Guild: { discordId: guildId },
                type: GuildSetting.IS_WHITELISTED
            },
            data: { value: "0" }
        });

        this.client.sender.reply(
            i,
            {
                content:
                    "Guild has been removed from the whitelist, bot has left the server"
            },
            { msgType: "SUCCESS" }
        );
        if (settings.banLogChannel) {
            this.client.sender.msgChannel(
                settings.banLogChannel,
                { content: "Server has been removed from the whitelist" },
                { msgType: "INVALID" }
            );
        }

        return { result: "SUCCESS" };
    }

    public async runView(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const permissions = await this.client.utils.getMemberBotPermissions(i);
        if (!permissions.has(BotPermissionsBitField.Flags.WhitelistView)) {
            this.client.sender.reply(
                i,
                {
                    content:
                        "You don't have the permissions required to do this",
                    ephemeral: true
                },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "USER_MISSING_PERMISSIONS" };
        }

        const guilds = await this.client.prisma.guilds.findMany({
            where: {
                Settings: {
                    some: {
                        type: GuildSetting.IS_WHITELISTED,
                        value: "1"
                    }
                }
            },
            select: {
                discordId: true
            }
        });

        const embed = this.client.utils
            .defaultEmbed()
            .setTitle("Whitelisted guilds");
        let count = 1;
        for (const dbGuild of guilds) {
            const settings = await this.client.utils.getGuildSettings(
                dbGuild.discordId
            );
            const botGuild = this.client.guilds.cache.get(dbGuild.discordId);

            embed.addFields({
                name: `Guild #${count}`,
                value: [
                    botGuild ? `**Name:** ${botGuild.name}` : undefined,
                    botGuild
                        ? `**Members:** ${botGuild.memberCount}`
                        : undefined,
                    `**Bot present:** ${botGuild ? "Yes" : "No"}`,
                    settings?.banLogChannel
                        ? `**Ban log channel:** <#${settings.banLogChannel}>`
                        : undefined,
                    `**Guild ID:** ${dbGuild.discordId}`
                ]
                    .filter(v => v !== undefined)
                    .join("\n"),
                inline: true
            });
            count++;
        }
        this.client.sender.reply(i, { embeds: [embed] });

        return { result: "SUCCESS" };
    }
}
