import { EmbedBuilder, Colors, ButtonStyle, ButtonBuilder, ActionRowBuilder } from "discord.js";

export const successEmbed = (description: string) => (
    new EmbedBuilder()
        .setTitle('Success')
        .setDescription(description)
        .setColor(Colors.Green)
);

export const failureEmbed = (description: string) => (
    new EmbedBuilder()
        .setTitle('Failure')
        .setDescription(description)
        .setColor(Colors.Red)
);

export const authEmbed = (
    new EmbedBuilder()
        .setTitle('Your Authorization Link')
        .setDescription('Click to authorize RoLinker to access your Roblox user information.')
        .setFooter({ text: 'You will be redirected to apis.roblox.com. This link will expire in 2 minutes.' })
);

export const authComponent = (authUrl: string) => (
    new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setLabel('Authorize')
            .setURL(authUrl)
            .setStyle(ButtonStyle.Link)
    )
);

export const userEmbed = (username: string, imageUrl: string) => (
    new EmbedBuilder()
        .setTitle('Your User Settings')
        .setDescription(`Welcome, ${username}!`)
        .setThumbnail(imageUrl)
);