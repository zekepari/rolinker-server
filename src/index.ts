import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import link from './commands/link.js';
import clientReady from './events/clientReady.js';
import interactionCreate from './events/interactionCreate.js';
import { connectDatabase } from './database/mongo.js';
import { deployCommands } from './deploy-commands.js';
import authRouter from './routes/auth.js';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();
client.commands.set(link.data.name, link);

client.once(Events.ClientReady, (...args) => clientReady.execute(...args));
client.on(Events.InteractionCreate, (...args) => interactionCreate.execute(...args));

client.login(process.env.DISCORD_BOT_TOKEN);

deployCommands()

const app = express();

connectDatabase().then(() => {
    app.use(express.json());
    app.use(authRouter)
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})