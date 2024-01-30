import dotenv from 'dotenv';
import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import link from './commands/link.js';
import clientReady from './events/clientReady.js';
import interactionCreate from './events/interactionCreate.js';
import { connectDatabase } from './database/mongo.js';
import { deployCommands } from './deploy-commands.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js'

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();
client.commands.set(link.data.name, link);

client.once(Events.ClientReady, (...args) => clientReady.execute(...args));
client.on(Events.InteractionCreate, (...args) => interactionCreate.execute(...args));

client.login(process.env.DISCORD_BOT_TOKEN);

deployCommands();

const app = new Koa();

app.use(cors({
    credentials: true,
    origin: 'https://rolinker.net'
}));
app.use(bodyParser());

connectDatabase().then(() => {
    app.use(userRoutes.routes());
    app.use(authRoutes.routes());

    app.listen(3000);
})