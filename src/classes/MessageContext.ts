import { MessageContextData } from "@/types";
import { Snowflake } from "discord.js";
import { Client } from "./Client";

export class MessageContext {
    private context = new Map();
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public set<T extends keyof MessageContextData>(
        type: T,
        messageId: Snowflake,
        context: MessageContextData[T]
    ): MessageContextData[T] | undefined {
        this.client.logger.verbose(
            `[MessageContext] Set: ${type}:${messageId}`
        );
        this.context.set(messageId, context);
        setTimeout(() => this.context.delete(messageId), 5 * 60 * 1000); // Purge after 5 minutes
        return context;
    }

    public get<T extends keyof MessageContextData>(
        type: T,
        messageId: Snowflake
    ): MessageContextData[T] | undefined {
        this.client.logger.verbose(
            `[MessageContext] Get: ${type}:${messageId}`
        );
        return this.context.get(messageId);
    }

    public delete<T extends keyof MessageContextData>(
        type: T,
        messageId: Snowflake
    ): void {
        this.client.logger.verbose(
            `[MessageContext] Delete: ${type}:${messageId}`
        );
        this.context.delete(messageId);
        return;
    }
}
