import { BotPermissionsString, HandlerResult } from "@/types";
import { StringSelectMenuComponent } from "@/structures";
import {
    StringSelectMenuInteraction,
    StringSelectMenuBuilder
} from "discord.js";
import { BotPermissionsBitField } from "@/classes";

export default class GroupPermissionsAddStringSelectMenuComponent extends StringSelectMenuComponent {
    public static readonly builder = new StringSelectMenuBuilder()
        .setCustomId("groupPermissionsAdd")
        .setMinValues(1)
        .setMaxValues(25);

    constructor() {
        super({
            builder: GroupPermissionsAddStringSelectMenuComponent.builder,
            matchRegex: /groupPermissionsAdd[12345]/
        });
    }

    public async run(i: StringSelectMenuInteraction): Promise<HandlerResult> {
        const context = this.client.messageContext.get(
            "groupPermissions",
            i.message.id
        );
        if (!context) {
            this.client.sender.reply(
                i,
                {
                    content:
                        "Due to being idle this is no longer available, please start over",
                    components: []
                },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "ACTION_EXPIRED" };
        }

        const permissions = await this.client.utils.getMemberBotPermissions(i);
        if (
            !permissions.has(BotPermissionsBitField.Flags.ManageGroups) ||
            i.user.id !== context.menuOwnerId
        ) {
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

        const group = await this.client.prisma.groups.findUnique({
            where: { Guild: { discordId: i.guild!.id }, id: context.groupId },
            select: { id: true, name: true, permissions: true }
        });
        if (!group) {
            this.client.messageContext.delete("groupPermissions", i.message.id);
            this.client.sender.reply(
                i,
                {
                    content: "The given group does not exist",
                    ephemeral: true,
                    components: []
                },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return {
                result: "ERRORED",
                note: "Group from redis not found",
                error: new Error("Group not found")
            };
        }

        const groupPermissions = new BotPermissionsBitField(group.permissions);
        const addedPermissions = new BotPermissionsBitField(
            i.values as BotPermissionsString[]
        );
        await this.client.prisma.groups.update({
            where: { Guild: { discordId: i.guild!.id }, id: context.groupId },
            data: {
                permissions: groupPermissions.add(addedPermissions).bitfield
            }
        });
        this.client.messageContext.delete("groupPermissions", i.message.id);

        const embed = this.client.utils
            .defaultEmbed()
            .setTitle(`Permission added to ${group.name}`)
            .setDescription("To add more permissions rerun the command")
            .setFields({
                name: "Permissions added",
                value: addedPermissions
                    .toTranslatedArray()
                    .map(p => `\`${p}\``)
                    .join(" ")
            });

        this.client.sender.reply(
            i,
            { embeds: [embed], components: [] },
            { method: "UPDATE" }
        );

        // Success
        return { result: "SUCCESS" };
    }
}
