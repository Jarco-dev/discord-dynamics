import { HandlerResult } from "@/types";
import { ChatInputCommand } from "@/structures";
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export default class PingChatInputCommand extends ChatInputCommand {
    constructor() {
        super({
            builder: new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Check the bots response time")
                .setDMPermission(true)
                .addStringOption(option =>
                    option
                        .setName("action")
                        .setDescription("Extra actions for the ping command")
                        .addChoices({ name: "Explain", value: "explain" })
                ),
            enabled: true
        });
    }

    public async run(i: ChatInputCommandInteraction): Promise<HandlerResult> {
        // Ping action
        switch (i?.options?.getString("action", false)) {
            // Explain
            case "explain": {
                const explainEmbed = this.client.utils
                    .defaultEmbed()
                    .setTitle("Ping explanation")
                    .setDescription(
                        [
                            "🔁 **RTT**: The delay between you sending the message and the bot replying",
                            "💟 **Heartbeat**: The delay between the bot and the discord api servers"
                        ].join("\n")
                    );
                this.client.sender.reply(i, {
                    embeds: [explainEmbed],
                    ephemeral: true
                });
                break;
            }

            // Ping (default)
            default: {
                // Send a pinging message
                const pingingEmbed = this.client.utils
                    .defaultEmbed()
                    .setTitle("Pinging...");
                const reply = await this.client.sender.reply(i, {
                    embeds: [pingingEmbed],
                    ephemeral: true,
                    fetchReply: true
                });
                if (!reply) {
                    return {
                        result: "OTHER",
                        note: "Initial message unavailable to check ping"
                    };
                }

                // Calculate the delay and edit the reply
                const timeDiff = reply.createdTimestamp - i.createdTimestamp;
                const resultEmbed = this.client.utils
                    .defaultEmbed()
                    .setTitle("Ping result")
                    .setDescription(
                        this.client.utils.addNewLines([
                            `🔁 **RTT**: ${timeDiff}ms`,
                            `💟 **Heartbeat**: ${this.client.ws.ping}ms`
                        ])
                    );
                this.client.sender.reply(
                    i,
                    { embeds: [resultEmbed] },
                    { method: "EDIT_REPLY" }
                );
            }
        }
        return { result: "SUCCESS" };
    }
}
