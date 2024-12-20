import { HandlerResult } from "@/types";
import { ChatInputCommand } from "@/structures";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    PermissionsBitField,
    SlashCommandBuilder
} from "discord.js";

export default class InviteChatInputCommand extends ChatInputCommand {
    constructor() {
        super({
            mainGuildOnly: true,
            builder: new SlashCommandBuilder()
                .setName("invite")
                .setDescription("Get a link to invite the bot")
                .setDMPermission(true)
        });
    }

    public run(
        i: ChatInputCommandInteraction
    ): HandlerResult | Promise<HandlerResult> {
        const permissions = new PermissionsBitField().add(
            this.client.config.NEEDED_BOT_PERMISSIONS
        );

        const embed = this.client.utils
            .defaultEmbed()
            .setTitle("Bot invite")
            .setDescription(
                "Please note that you can only invite the bot if you have been whitelisted!"
            );
        const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("Invite")
                .setURL(
                    `https://discord.com/api/oauth2/authorize?client_id=${this.client.user!.id}&permissions=${permissions.bitfield.toString()}&scope=bot%20applications.commands`
                )
        );

        this.client.sender.reply(i, { embeds: [embed], components: [button] });

        // Success
        return { result: "SUCCESS" };
    }
}
