import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { getDatabase } from "../database/mongo.js";

export default {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('view and edit your user settings'),
    async execute(interaction: CommandInteraction) {
        const db = getDatabase();
        const usersCollection = db.collection('users');

        const result = await usersCollection.deleteOne({ _id: interaction.user.id as any });

        if (result.deletedCount > 0) {
            await interaction.reply('Your Roblox and Discord account have been unlinked.');
        } else {
            await interaction.reply('No linked account found or an error occurred.');
        }
    },
};