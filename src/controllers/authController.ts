import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Context } from 'koa';
import { getDatabase } from '../database/mongo.js';

export const discordLogin = async (ctx: Context) => {
    const url = 'https://discord.com/api/oauth2/authorize?client_id=990855457885278208&response_type=code&redirect_uri=https%3A%2F%2Fapis.rolinker.net%2Fauth%2Fdiscord%2Fcallback&scope=identify';
    ctx.redirect(url);
}

export const discordCallback = async (ctx: Context) => {
    if (!ctx.query.code) {
        throw new Error('Code not provided.');
    }

    const code = Array.isArray(ctx.query.code) ? ctx.query.code[0] : ctx.query.code;
    const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID as string,
        client_secret: process.env.DISCORD_CLIENT_SECRET as string,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI as string
    });

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', params, { headers });
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenResponse.data.access_token}`
            }
        });

        const { id, username, avatar } = userResponse.data;

        const db = getDatabase();
        const usersCollection = db.collection('users');
        const avatarUrl = avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${Math.abs((id >> 22) % 5)}.png`

        await usersCollection.updateOne(
            { _id: id },
            { $set: { username: username, avatarUrl: avatarUrl } },
            { upsert: true }
        );

        const token = jwt.sign({ sub: id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        ctx.cookies.set('token', token, { domain: 'rolinker.net' })
        ctx.redirect('https://rolinker.net')
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Internal Server Error' };
    }
};
