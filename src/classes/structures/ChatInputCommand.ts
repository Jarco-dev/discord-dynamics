import Client from "../../index";
import { HandlerResult } from "@/types";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export abstract class ChatInputCommand {
    protected readonly client = Client;
    public readonly data: ReturnType<SlashCommandBuilder["toJSON"]>;
    public readonly mainGuildOnly: boolean;
    public readonly enabled: boolean;

    protected constructor(p: {
        builder: Pick<SlashCommandBuilder, "toJSON">;
        mainGuildOnly?: boolean;
        enabled?: boolean;
    }) {
        this.data = p.builder.toJSON();
        this.mainGuildOnly = p.mainGuildOnly ?? false;
        this.enabled = p.enabled ?? true;
    }

    public abstract run(
        i: ChatInputCommandInteraction
    ): HandlerResult | Promise<HandlerResult>;
}
