import { REST, Routes, SlashCommandBuilder, RESTPutAPIApplicationCommandsResult } from 'discord.js';
import dotenv from 'dotenv';
import link from './commands/link.js';

dotenv.config();

export async function deployCommands() {
    const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN ?? '');

    const commands: SlashCommandBuilder[] = [];
    commands.push(link.data);
    
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
            const data = await rest.put(
                Routes.applicationCommands(process.env.DISCORD_CLIENT_ID ?? ''),
                {body: commands}
            ) as RESTPutAPIApplicationCommandsResult;
    
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error)
        }
    })();
}