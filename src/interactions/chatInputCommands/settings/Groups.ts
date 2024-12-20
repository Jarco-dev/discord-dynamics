import { HandlerResult } from "@/types";
import { ChatInputCommand } from "@/structures";
import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder
} from "discord.js";
import { BotPermissionsBitField } from "@/classes";
import GroupPermissionsAddStringSelectMenuComponent from "@/stringMenu/settings/GroupPermissionsAdd";
import GroupPermissionsRemoveStringSelectMenuComponent from "@/stringMenu/settings/GroupPermissionsRemove";

export default class GroupsChatInputCommand extends ChatInputCommand {
    constructor() {
        super({
            builder: new SlashCommandBuilder()
                .setName("groups")
                .setDescription("Manage the bots permission groups")
                .setDMPermission(false)
                .addSubcommand(builder =>
                    builder
                        .setName("create")
                        .setDescription("Create a permission group")
                        .addStringOption(builder =>
                            builder
                                .setName("name")
                                .setDescription("Group name")
                                .setRequired(true)
                                .setMinLength(1)
                                .setMaxLength(32)
                        )
                )
                .addSubcommand(builder =>
                    builder
                        .setName("delete")
                        .setDescription("Delete a permission group")
                        .addStringOption(builder =>
                            builder
                                .setName("group")
                                .setDescription("The permission group")
                                .setAutocomplete(true)
                                .setRequired(true)
                        )
                )
                .addSubcommand(builder =>
                    builder
                        .setName("list")
                        .setDescription("View all the permission groups")
                )
                .addSubcommand(builder =>
                    builder
                        .setName("view")
                        .setDescription("View a group")
                        .addStringOption(builder =>
                            builder
                                .setName("group")
                                .setDescription("The permission group")
                                .setAutocomplete(true)
                                .setRequired(true)
                        )
                )
                .addSubcommand(builder =>
                    builder
                        .setName("list-for")
                        .setDescription(
                            "View a list of a users groups and permissions"
                        )
                        .addUserOption(builder =>
                            builder
                                .setName("user")
                                .setDescription("The user")
                                .setRequired(true)
                        )
                )
                .addSubcommandGroup(builder =>
                    builder
                        .setName("role")
                        .setDescription("Manage the permission group roles")
                        .addSubcommand(builder =>
                            builder
                                .setName("add")
                                .setDescription(
                                    "Add a role to a permission group"
                                )
                                .addStringOption(builder =>
                                    builder
                                        .setName("group")
                                        .setDescription("The permission group")
                                        .setAutocomplete(true)
                                        .setRequired(true)
                                )
                                .addRoleOption(builder =>
                                    builder
                                        .setName("role")
                                        .setDescription("The role to add")
                                        .setRequired(true)
                                )
                        )
                        .addSubcommand(builder =>
                            builder
                                .setName("remove")
                                .setDescription(
                                    "Remove a role from a permission group"
                                )
                                .addStringOption(builder =>
                                    builder
                                        .setName("group")
                                        .setDescription("The permission group")
                                        .setAutocomplete(true)
                                        .setRequired(true)
                                )
                                .addRoleOption(builder =>
                                    builder
                                        .setName("role")
                                        .setDescription("The role to add")
                                        .setRequired(true)
                                )
                        )
                        .addSubcommand(builder =>
                            builder
                                .setName("reset")
                                .setDescription(
                                    "Remove all roles from a permission group"
                                )
                                .addStringOption(builder =>
                                    builder
                                        .setName("group")
                                        .setDescription("The permission group")
                                        .setAutocomplete(true)
                                        .setRequired(true)
                                )
                        )
                )
                .addSubcommandGroup(builder =>
                    builder
                        .setName("user")
                        .setDescription("Manage the permission group users")
                        .addSubcommand(builder =>
                            builder
                                .setName("add")
                                .setDescription(
                                    "Add a user to a permission group"
                                )
                                .addStringOption(builder =>
                                    builder
                                        .setName("group")
                                        .setDescription("The permission group")
                                        .setAutocomplete(true)
                                        .setRequired(true)
                                )
                                .addUserOption(builder =>
                                    builder
                                        .setName("user")
                                        .setDescription("The user to add")
                                        .setRequired(true)
                                )
                        )
                        .addSubcommand(builder =>
                            builder
                                .setName("remove")
                                .setDescription(
                                    "Remove a user from a permission group"
                                )
                                .addStringOption(builder =>
                                    builder
                                        .setName("group")
                                        .setDescription("The permission group")
                                        .setAutocomplete(true)
                                        .setRequired(true)
                                )
                                .addUserOption(builder =>
                                    builder
                                        .setName("user")
                                        .setDescription("The user to add")
                                        .setRequired(true)
                                )
                        )
                        .addSubcommand(builder =>
                            builder
                                .setName("reset")
                                .setDescription(
                                    "Remove all users from a permission group"
                                )
                                .addStringOption(builder =>
                                    builder
                                        .setName("group")
                                        .setDescription("The permission group")
                                        .setAutocomplete(true)
                                        .setRequired(true)
                                )
                        )
                )
                .addSubcommandGroup(builder =>
                    builder
                        .setName("permissions")
                        .setDescription("Manage a groups permissions")
                        .addSubcommand(builder =>
                            builder
                                .setName("add")
                                .setDescription("Add permissions to a group")
                                .addStringOption(builder =>
                                    builder
                                        .setName("group")
                                        .setDescription("The permission group")
                                        .setAutocomplete(true)
                                        .setRequired(true)
                                )
                        )
                        .addSubcommand(builder =>
                            builder
                                .setName("remove")
                                .setDescription(
                                    "Remove permissions from a group"
                                )
                                .addStringOption(builder =>
                                    builder
                                        .setName("group")
                                        .setDescription("The permission group")
                                        .setAutocomplete(true)
                                        .setRequired(true)
                                )
                        )
                        .addSubcommand(builder =>
                            builder
                                .setName("reset")
                                .setDescription(
                                    "Remove all permissions from a permission group"
                                )
                                .addStringOption(builder =>
                                    builder
                                        .setName("group")
                                        .setDescription("The permission group")
                                        .setAutocomplete(true)
                                        .setRequired(true)
                                )
                        )
                )
        });
    }

    public async run(i: ChatInputCommandInteraction): Promise<HandlerResult> {
        const permissions = await this.client.utils.getMemberBotPermissions(i);
        if (!permissions.has(BotPermissionsBitField.Flags.ManageGroups)) {
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

        const subcommandGroupKey = i.options.getSubcommandGroup()
            ? `${i.options.getSubcommandGroup()}.`
            : "";
        switch (`${subcommandGroupKey}${i.options.getSubcommand()}`) {
            case "create":
                return this.runCreate(i);
            case "delete":
                return this.runDelete(i);
            case "list":
                return this.runList(i);
            case "view":
                return this.runView(i);
            case "list-for":
                return this.runListFor(i);

            case "role.add":
                return this.runRoleAdd(i);
            case "role.remove":
                return this.runRoleRemove(i);
            case "role.reset":
                return this.runRoleReset(i);

            case "user.add":
                return this.runUserAdd(i);
            case "user.remove":
                return this.runUserRemove(i);
            case "user.reset":
                return this.runUserReset(i);

            case "permissions.add":
                return this.runPermissionsAdd(i);
            case "permissions.remove":
                return this.runPermissionsRemove(i);
            case "permissions.reset":
                return this.runPermissionsReset(i);

            default:
                return {
                    result: "ERRORED",
                    note: "Groups subcommand executor not found",
                    error: new Error("Command executor not found")
                };
        }
    }

    private async runCreate(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const name = i.options.getString("name", true);

        await this.client.prisma.groups.create({
            data: {
                name,
                Guild: {
                    connectOrCreate: {
                        where: { discordId: i.guild!.id },
                        create: { discordId: i.guild!.id }
                    }
                }
            }
        });

        const embed = this.client.utils
            .defaultEmbed()
            .setTitle(`${name} group created`)
            .setDescription(
                "You can modify this group using the `/groups` command\nUsing this you're able to give the gropu to users, link the group to roles and add permissions to the group"
            );
        this.client.sender.reply(i, { embeds: [embed] });

        return { result: "SUCCESS" };
    }

    private async runDelete(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const groupId = parseInt(i.options.getString("group", true));
        const group = isNaN(groupId)
            ? undefined
            : await this.client.prisma.groups.findUnique({
                  where: { Guild: { discordId: i.guild!.id }, id: groupId },
                  select: {
                      id: true,
                      name: true,
                      Roles: {
                          select: {
                              id: true,
                              Groups: {
                                  select: {
                                      id: true
                                  }
                              }
                          }
                      }
                  }
              });
        if (!group) {
            this.client.sender.reply(
                i,
                { content: "The given group does not exist", ephemeral: true },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        const rolesToDelete = group.Roles.filter(
            r => r.Groups.length === 1
        ).map(r => r.id);
        await this.client.prisma.$transaction([
            this.client.prisma.groups.delete({
                where: { Guild: { discordId: i.guild!.id }, id: group.id }
            }),
            this.client.prisma.roles.deleteMany({
                where: {
                    Guild: { discordId: i.guild!.id },
                    id: { in: rolesToDelete }
                }
            })
        ]);

        this.client.sender.reply(
            i,
            { content: `The ${group.name} group has been deleted` },
            { msgType: "SUCCESS" }
        );

        return { result: "SUCCESS" };
    }

    private async runList(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const groups = await this.client.prisma.groups.findMany({
            where: { Guild: { discordId: i.guild!.id } },
            select: { name: true }
        });
        if (groups.length === 0) {
            this.client.sender.reply(
                i,
                { content: "There are no groups yet", ephemeral: true },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "SUCCESS" };
        }

        const embed = this.client.utils
            .defaultEmbed()
            .setTitle("Groups")
            .setDescription(groups.map(r => r.name).join(", "));
        this.client.sender.reply(i, { embeds: [embed] });

        return { result: "SUCCESS" };
    }

    private async runView(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const groupId = parseInt(i.options.getString("group", true));
        const group = isNaN(groupId)
            ? undefined
            : await this.client.prisma.groups.findUnique({
                  where: { Guild: { discordId: i.guild!.id }, id: groupId },
                  select: {
                      name: true,
                      permissions: true,
                      Roles: {
                          select: {
                              discordId: true
                          }
                      },
                      Users: {
                          select: {
                              discordId: true
                          }
                      }
                  }
              });
        if (!group) {
            this.client.sender.reply(
                i,
                { content: "The given group does not exist", ephemeral: true },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        const toPurge = group.Roles.filter(
            r => !i.guild!.roles.cache.has(r.discordId)
        );
        if (toPurge.length > 0) {
            group.Roles = group.Roles.filter(r =>
                i.guild!.roles.cache.has(r.discordId)
            );
            await this.client.prisma.roles.deleteMany({
                where: { discordId: { in: toPurge.map(r => r.discordId) } }
            });
        }

        const roles =
            group.Roles.length > 0
                ? group.Roles.map(u => `<@&${u.discordId}>`).join(", ")
                : "This group has no roles";
        const users =
            group.Users.length > 0
                ? group.Users.map(u => `<@${u.discordId}>`).join(", ")
                : "This group has no users";
        const permissions =
            group.permissions > 0n
                ? new BotPermissionsBitField(group.permissions)
                      .toTranslatedArray()
                      .map(p => `\`${p}\``)
                      .join(" ")
                : "This group has no permissions";

        const embed = this.client.utils
            .defaultEmbed()
            .setTitle(`${group.name} information`)
            .setFields([
                { name: "Roles", value: roles },
                { name: "Users", value: users },
                { name: "Permissions", value: permissions }
            ]);
        this.client.sender.reply(i, { embeds: [embed] });

        return { result: "SUCCESS" };
    }

    public async runListFor(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const user = i.options.getUser("user", true);
        const member = await i.guild!.members.fetch(user.id);
        const groups = await this.client.prisma.groups.findMany({
            where: {
                Guild: { discordId: i.guild!.id },
                OR: [
                    { Users: { some: { discordId: member.id } } },
                    {
                        Roles: {
                            some: {
                                discordId: {
                                    in: member.roles.cache.map(r => r.id)
                                }
                            }
                        }
                    }
                ]
            },
            select: {
                name: true
            }
        });

        const permissions = await this.client.utils.getMemberBotPermissions(
            member,
            false
        );
        const embed = this.client.utils
            .defaultEmbed()
            .setTitle(`Permissions and groups for ${member.user.username}`)
            .setFields([
                {
                    name: "Groups",
                    value:
                        groups.length > 0
                            ? groups.map(g => g.name).join(", ")
                            : "This user has no groups"
                },
                {
                    name: "Permissions",
                    value:
                        permissions.bitfield > 0n
                            ? permissions
                                  .toTranslatedArray()
                                  .map(p => `\`${p}\``)
                                  .join(" ")
                            : "This user has no permissions"
                }
            ]);
        if (member.permissions.has("Administrator")) {
            embed.setDescription(
                "This user is a server administrator and has access to everything with in the bot, even if it's not shown here!"
            );
        }

        this.client.sender.reply(i, { embeds: [embed] });

        return { result: "SUCCESS" };
    }

    private async runRoleAdd(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const groupId = parseInt(i.options.getString("group", true));
        const role = i.options.getRole("role", true);
        const group = isNaN(groupId)
            ? undefined
            : await this.client.prisma.groups.findUnique({
                  where: { Guild: { discordId: i.guild!.id }, id: groupId },
                  select: {
                      id: true,
                      name: true,
                      Roles: {
                          where: { discordId: role.id },
                          select: { id: true }
                      }
                  }
              });
        if (!group) {
            this.client.sender.reply(
                i,
                { content: "The given group does not exist", ephemeral: true },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        if (group.Roles.length === 1) {
            this.client.sender.reply(
                i,
                {
                    content: `${role.toString()} is already in ${group.name}`,
                    ephemeral: true
                },
                { msgType: "INVALID" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        await this.client.prisma.groups.update({
            where: { Guild: { discordId: i.guild!.id }, id: group.id },
            data: {
                Guild: {
                    connectOrCreate: {
                        where: { discordId: i.guild!.id },
                        create: { discordId: i.guild!.id }
                    }
                },
                Roles: {
                    connectOrCreate: {
                        where: { discordId: role.id },
                        create: {
                            discordId: role.id,
                            Guild: {
                                connectOrCreate: {
                                    where: { discordId: i.guild!.id },
                                    create: { discordId: i.guild!.id }
                                }
                            }
                        }
                    }
                }
            }
        });

        this.client.sender.reply(
            i,
            { content: `${role.toString()} has been added to ${group.name}` },
            { msgType: "SUCCESS" }
        );

        return { result: "SUCCESS" };
    }

    private async runRoleRemove(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const groupId = parseInt(i.options.getString("group", true));
        const role = i.options.getRole("role", true);
        const group = isNaN(groupId)
            ? undefined
            : await this.client.prisma.groups.findUnique({
                  where: { Guild: { discordId: i.guild!.id }, id: groupId },
                  select: {
                      id: true,
                      name: true,
                      Roles: {
                          where: { discordId: role.id },
                          select: { id: true }
                      }
                  }
              });
        if (!group) {
            this.client.sender.reply(
                i,
                { content: "The given group does not exist", ephemeral: true },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        if (group.Roles.length === 0) {
            this.client.sender.reply(
                i,
                {
                    content: `${role.toString()} is not in ${group.name}`,
                    ephemeral: true
                },
                { msgType: "INVALID" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        const dbRole = await this.client.prisma.roles.update({
            where: { Guild: { discordId: i.guild!.id }, discordId: role.id },
            data: {
                Groups: {
                    disconnect: { id: group.id }
                }
            },
            select: {
                id: true,
                _count: {
                    select: {
                        Groups: true
                    }
                }
            }
        });
        if (dbRole._count.Groups === 0) {
            await this.client.prisma.roles.delete({
                where: { Guild: { discordId: i.guild!.id }, id: dbRole.id }
            });
        }

        this.client.sender.reply(
            i,
            {
                content: `${role.toString()} has been removed from ${
                    group.name
                }`
            },
            { msgType: "SUCCESS" }
        );

        return { result: "SUCCESS" };
    }

    private async runRoleReset(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const groupId = parseInt(i.options.getString("group", true));
        const group = isNaN(groupId)
            ? undefined
            : await this.client.prisma.groups.findUnique({
                  where: { Guild: { discordId: i.guild!.id }, id: groupId },
                  select: {
                      id: true,
                      name: true,
                      Roles: {
                          select: {
                              discordId: true,
                              _count: {
                                  select: {
                                      Groups: true
                                  }
                              }
                          }
                      }
                  }
              });
        if (!group) {
            this.client.sender.reply(
                i,
                { content: "The given group does not exist", ephemeral: true },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        const rolesToDelete = group.Roles.filter(
            r => r._count.Groups === 1
        ).map(r => r.discordId);
        await this.client.prisma.$transaction([
            this.client.prisma.groups.update({
                where: { Guild: { discordId: i.guild!.id }, id: groupId },
                data: { Roles: { set: [] } }
            }),
            this.client.prisma.roles.deleteMany({
                where: {
                    Guild: { discordId: i.guild!.id },
                    discordId: { in: rolesToDelete }
                }
            })
        ]);

        this.client.sender.reply(
            i,
            { content: `Roles reset for ${group.name}` },
            { msgType: "SUCCESS" }
        );

        return { result: "SUCCESS" };
    }

    private async runUserAdd(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const groupId = parseInt(i.options.getString("group", true));
        const user = i.options.getUser("user", true);
        const group = isNaN(groupId)
            ? undefined
            : await this.client.prisma.groups.findUnique({
                  where: { Guild: { discordId: i.guild!.id }, id: groupId },
                  select: {
                      id: true,
                      name: true,
                      Users: {
                          where: { discordId: user.id },
                          select: { id: true }
                      }
                  }
              });
        if (!group) {
            this.client.sender.reply(
                i,
                { content: "The given group does not exist", ephemeral: true },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        if (group.Users.length === 1) {
            this.client.sender.reply(
                i,
                {
                    content: `${user} is already in ${group.name}`,
                    ephemeral: true
                },
                { msgType: "INVALID" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        await this.client.prisma.groups.update({
            where: { Guild: { discordId: i.guild!.id }, id: group.id },
            data: {
                Guild: {
                    connectOrCreate: {
                        where: { discordId: i.guild!.id },
                        create: { discordId: i.guild!.id }
                    }
                },
                Users: {
                    connectOrCreate: {
                        where: {
                            discordId: user.id
                        },
                        create: {
                            discordId: user.id,
                            Guilds: {
                                connectOrCreate: {
                                    where: { discordId: i.guild!.id },
                                    create: { discordId: i.guild!.id }
                                }
                            }
                        }
                    }
                }
            }
        });

        this.client.sender.reply(
            i,
            { content: `${user} has been added to ${group.name}` },
            { msgType: "SUCCESS" }
        );

        return { result: "SUCCESS" };
    }

    private async runUserRemove(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const groupId = parseInt(i.options.getString("group", true));
        const user = i.options.getUser("user", true);
        const group = isNaN(groupId)
            ? undefined
            : await this.client.prisma.groups.findUnique({
                  where: { Guild: { discordId: i.guild!.id }, id: groupId },
                  select: {
                      id: true,
                      name: true,
                      Users: {
                          where: { discordId: user.id },
                          select: { id: true }
                      }
                  }
              });
        if (!group) {
            this.client.sender.reply(
                i,
                { content: "The given group does not exist", ephemeral: true },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        if (group.Users.length === 0) {
            this.client.sender.reply(
                i,
                { content: `${user} is not in ${group.name}`, ephemeral: true },
                { msgType: "INVALID" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        await this.client.prisma.groups.update({
            where: { Guild: { discordId: i.guild!.id }, id: group.id },
            data: {
                Users: {
                    disconnect: { discordId: user.id }
                }
            }
        });

        this.client.sender.reply(
            i,
            { content: `${user} has been removed from ${group.name}` },
            { msgType: "SUCCESS" }
        );

        return { result: "SUCCESS" };
    }

    private async runUserReset(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const groupId = parseInt(i.options.getString("group", true));
        const group = isNaN(groupId)
            ? undefined
            : await this.client.prisma.groups.findUnique({
                  where: { Guild: { discordId: i.guild!.id }, id: groupId },
                  select: {
                      id: true,
                      name: true,
                      Users: {
                          select: {
                              discordId: true,
                              Groups: {
                                  select: {
                                      id: true
                                  }
                              }
                          }
                      }
                  }
              });
        if (!group) {
            this.client.sender.reply(
                i,
                { content: "The given group does not exist", ephemeral: true },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        await this.client.prisma.groups.update({
            where: { Guild: { discordId: i.guild!.id }, id: groupId },
            data: { Users: { set: [] } }
        });

        this.client.sender.reply(
            i,
            { content: `Users reset for ${group.name}` },
            { msgType: "SUCCESS" }
        );

        return { result: "SUCCESS" };
    }

    private async runPermissionsAdd(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const groupId = parseInt(i.options.getString("group", true));
        const group = isNaN(groupId)
            ? undefined
            : await this.client.prisma.groups.findUnique({
                  where: { Guild: { discordId: i.guild!.id }, id: groupId },
                  select: {
                      id: true,
                      name: true,
                      permissions: true
                  }
              });
        if (!group) {
            this.client.sender.reply(
                i,
                { content: "The given group does not exist", ephemeral: true },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        const permissions = new BotPermissionsBitField(
            group.permissions
        ).missing(BotPermissionsBitField.All, false);
        if (permissions.length === 0) {
            this.client.sender.reply(
                i,
                {
                    content: `The ${group.name} group already has all available permissions`,
                    ephemeral: true
                },
                { msgType: "INVALID" }
            );
            return { result: "SUCCESS" };
        }

        const components = [];
        do {
            const customId: string =
                `${GroupPermissionsAddStringSelectMenuComponent.builder.data.custom_id}` +
                (components.length + 1);
            const options = permissions.splice(0, 25).map(permission => ({
                label: BotPermissionsBitField.FlagToString[permission],
                value: permission
            }));

            components.push(
                new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
                    new StringSelectMenuBuilder(
                        GroupPermissionsAddStringSelectMenuComponent.builder.data
                    )
                        .setCustomId(customId)
                        .setOptions(options)
                        .setMaxValues(options.length)
                )
            );
        } while (permissions.length > 0);

        const embed = new EmbedBuilder()
            .setColor(this.client.config.COLORS.DEFAULT)
            .setTitle(
                `Select the permissions you want to add to ${group.name}`
            );
        const reply = await this.client.sender.reply(i, {
            embeds: [embed],
            components: components,
            fetchReply: true
        });

        if (!reply) {
            this.client.sender.reply(
                i,
                { content: "Something went wrong, please try again" },
                { msgType: "ERROR" }
            );
            return {
                result: "ERRORED",
                note: "Groups permission add message unavailable",
                error: new Error("Message unavailable")
            };
        }

        this.client.messageContext.set("groupPermissions", reply.id, {
            groupId: group.id,
            menuOwnerId: i.user.id
        });

        return { result: "SUCCESS" };
    }

    private async runPermissionsRemove(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const groupId = parseInt(i.options.getString("group", true));
        const group = isNaN(groupId)
            ? undefined
            : await this.client.prisma.groups.findUnique({
                  where: { Guild: { discordId: i.guild!.id }, id: groupId },
                  select: {
                      id: true,
                      name: true,
                      permissions: true
                  }
              });
        if (!group) {
            this.client.sender.reply(
                i,
                { content: "The given group does not exist", ephemeral: true },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        const permissions = new BotPermissionsBitField(
            group.permissions
        ).toArray();
        if (permissions.length === 0) {
            this.client.sender.reply(
                i,
                {
                    content: `The ${group.name} group has no permissions`,
                    ephemeral: true
                },
                { msgType: "INVALID" }
            );
            return { result: "SUCCESS" };
        }

        const components = [];
        do {
            const customId: string =
                `${GroupPermissionsRemoveStringSelectMenuComponent.builder.data.custom_id}` +
                (components.length + 1);
            const options = permissions.splice(0, 25).map(permission => ({
                label: BotPermissionsBitField.FlagToString[permission],
                value: permission
            }));

            components.push(
                new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
                    new StringSelectMenuBuilder(
                        GroupPermissionsRemoveStringSelectMenuComponent.builder.data
                    )
                        .setCustomId(customId)
                        .setOptions(options)
                        .setMaxValues(options.length)
                )
            );
        } while (permissions.length > 0);

        const embed = new EmbedBuilder()
            .setColor(this.client.config.COLORS.DEFAULT)
            .setTitle(
                `Select the permissions you want to remove from ${group.name}`
            );
        const reply = await this.client.sender.reply(i, {
            embeds: [embed],
            components: components,
            fetchReply: true
        });
        if (!reply) {
            this.client.sender.reply(
                i,
                { content: "Something went wrong, please try again" },
                { msgType: "ERROR" }
            );
            return {
                result: "ERRORED",
                note: "Groups permission remove message unavailable",
                error: new Error("Message unavailable")
            };
        }

        this.client.messageContext.set("groupPermissions", reply.id, {
            groupId: group.id,
            menuOwnerId: i.user.id
        });

        return { result: "SUCCESS" };
    }

    private async runPermissionsReset(
        i: ChatInputCommandInteraction
    ): Promise<HandlerResult> {
        const groupId = parseInt(i.options.getString("group", true));
        const group = isNaN(groupId)
            ? undefined
            : await this.client.prisma.groups.findUnique({
                  where: { Guild: { discordId: i.guild!.id }, id: groupId },
                  select: { id: true, name: true }
              });
        if (!group) {
            this.client.sender.reply(
                i,
                { content: "The given group does not exist", ephemeral: true },
                { msgType: "INVALID", method: "UPDATE" }
            );
            return { result: "INVALID_ARGUMENTS" };
        }

        await this.client.prisma.groups.update({
            where: { Guild: { discordId: i.guild!.id }, id: group.id },
            data: { permissions: 0n }
        });

        this.client.sender.reply(
            i,
            { content: `Permissions reset for ${group.name}` },
            { msgType: "INVALID" }
        );

        return { result: "SUCCESS" };
    }
}
