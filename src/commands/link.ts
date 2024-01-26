import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { createAuthUrl } from "../oauth.js";

export default {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('link your roblox and discord account together'),
    async execute(interaction: CommandInteraction) {
        const authUrl = createAuthUrl(interaction.user.id)

        await interaction.reply(authUrl);
    },
};