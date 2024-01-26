import { Client } from "discord.js"

export default {
    async execute(client: Client<true>) {
        console.log(`Logged in as ${client.user.tag}`)
    }
}