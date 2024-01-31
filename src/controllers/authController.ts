import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Context } from 'koa';
import { getDatabase } from '../database/mongo.js';

export const discordLogin = async (ctx: Context) => {
    const redirectUri = 'https://apis.rolinker.net/auth/discord/callback'

    const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=identify`;
    ctx.redirect(url);
};

export const robloxLogin = async (ctx: Context) => {
    if (!ctx.state.user) {
        ctx.status = 400;
        ctx.body = { error: "User not found" };
    }

    const redirectUri = 'https://apis.rolinker.net/auth/roblox/callback'

    const url = `https://apis.roblox.com/oauth/v1/authorize?client_id=${process.env.ROBLOX_CLIENT_ID}&redirect_uri=${redirectUri}&scope=openid&response_type=code`;
    ctx.redirect(url);
};

export const discordCallback = async (ctx: Context) => {
    let { code } = ctx.query;

    if (!code) {
        ctx.status = 400;
        ctx.body = { error: "Code is invalid" };
        return;
    }

    code = Array.isArray(code) ? code[0] : code;
    const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID as string,
        client_secret: process.env.DISCORD_CLIENT_SECRET as string,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI as string
    });

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
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
            {
                $set: { username: username, avatarUrl: avatarUrl },
                $setOnInsert: { accounts: { primary: null, ids: [] } }
            },
            { upsert: true }
        );

        const token = jwt.sign({ sub: id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        ctx.cookies.set('token', token, { domain: 'rolinker.net' })
        ctx.redirect('https://rolinker.net')
    } catch {
        ctx.status = 500;
        ctx.body = { error: 'Internal Server Error' };
    }
};

export const robloxCallback = async (ctx: Context) => {
    const code = Array.isArray(ctx.query.code) ? ctx.query.code[0] : ctx.query.code;
    const id = ctx.state.user._id

    if (!code) {
        ctx.status = 400;
        ctx.body = { error: "Code is invalid or missing" };
        return;
    };

    if (!id) {
        ctx.status = 400;
        ctx.body = { error: "User not found" };
    };

    const params = new URLSearchParams({
        client_id: process.env.ROBLOX_CLIENT_ID as string,
        client_secret: process.env.ROBLOX_CLIENT_SECRET as string,
        grant_type: 'authorization_code',
        code
    });

    try {
        const tokenResponse = await axios.post('https://apis.roblox.com/oauth/v1/token', params, {
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        });

        console.log(tokenResponse)
        const userResponse = await axios.get('https://apis.roblox.com/oauth/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${tokenResponse.data.access_token}`
            }
        });

        const { sub } = userResponse.data;

        const db = getDatabase();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ _id: id });

        if (user && user.accounts.primary == null) {
            await usersCollection.updateOne(
                { _id: id },
                { 
                    $addToSet: { "accounts.ids": sub },
                    $set: { "accounts.primary": sub }
                },
                { upsert: true }
            );
        } else {
            await usersCollection.updateOne(
                { _id: id },
                { $addToSet: { "accounts.ids": sub } },
                { upsert: true }
            );
        }

        ctx.redirect('https://rolinker.net/manage/accounts')
    } catch (error) {
        console.log(error);
        ctx.status = 500;
        ctx.body = { error: 'Internal Server Error' };
    }
};
