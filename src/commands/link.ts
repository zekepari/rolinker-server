import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('link your roblox and discord account together'),
    async execute(interaction: CommandInteraction) {
        console.log('hi')
    },
};