import { BitField, BitFieldResolvable } from "discord.js";
import { BotPermissionsString } from "@/types";

export class BotPermissionsBitField extends BitField<
    BotPermissionsString,
    bigint
> {
    public static Flags = {
        Administrator: 1n << 0n,
        ManageGroups: 1n << 1n,
        WhitelistAdd: 1n << 2n,
        WhitelistRemove: 1n << 3n,
        WhitelistView: 1n << 4n
    } as const;
    public static FlagToString: { [key in BotPermissionsString]: string } = {
        Administrator: "Administrator",
        ManageGroups: "Manage groups",
        WhitelistAdd: "Whitelist add",
        WhitelistRemove: "Whitelist remove",
        WhitelistView: "Whitelist view"
    };
    static All = Object.values(this.Flags).reduce((all, p) => all | p, 0n);
    static DefaultBit = BigInt(0);

    /**
     * Gets all given bits that are missing from the bitfield
     */
    public missing(
        bits: BitFieldResolvable<BotPermissionsString, bigint>,
        checkAdmin = true
    ): BotPermissionsString[] {
        return checkAdmin &&
            this.has(BotPermissionsBitField.Flags.Administrator)
            ? []
            : super.missing(bits);
    }

    /**
     * Checks whether the bitfield has a permission, or any of multiple permissions
     */
    public any(
        permission: BitFieldResolvable<BotPermissionsString, bigint>,
        checkAdmin = true
    ): boolean {
        return (
            (checkAdmin &&
                super.has(BotPermissionsBitField.Flags.Administrator)) ||
            super.any(permission)
        );
    }

    /**
     * Checks whether the bitfield has a permission, or multiple permissions
     */
    public has(
        permission: BitFieldResolvable<BotPermissionsString, bigint>,
        checkAdmin = true
    ): boolean {
        return (
            (checkAdmin &&
                super.has(BotPermissionsBitField.Flags.Administrator)) ||
            super.has(permission)
        );
    }

    /**
     * Gets an array of bitfield names based on the permissions available
     */
    public toArray(): BotPermissionsString[] {
        return super.toArray(false);
    }

    /**
     * Gets an array of human-readable bitfield names based on the permissions available
     */
    public toTranslatedArray(): string[] {
        return super
            .toArray(false)
            .map(
                (p: BotPermissionsString) =>
                    BotPermissionsBitField.FlagToString[p]
            );
    }
}
