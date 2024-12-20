import { Snowflake } from "discord.js";
import { Groups } from "@prisma/client";

export interface MessageContextData {
    groupPermissions: {
        groupId: Groups["id"];
        menuOwnerId: Snowflake;
    };
}
