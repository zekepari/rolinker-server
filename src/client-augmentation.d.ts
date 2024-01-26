import { Collection } from 'discord.js';

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>;
    }
}

interface Command {
    data: { name: string; };
    execute: (...args: any[]) => void;
}