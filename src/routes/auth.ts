import express, { Request, Response } from 'express';
import { getAuthUser } from '../oauth.js';
import { getDatabase } from '../database/mongo.js';

const authRouter = express.Router();

interface TokenData {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
};

interface UserInfoData {
    sub: string;
    name: string;
    nickname: string;
    preffered_username: string;
    created_at: number;
    profile: string;
    picture: string;
};

authRouter.get('/auth', async (req: Request, res: Response) => {
    const code = req.query.code as string;
        const state = req.query.state as string;
        const discordId = getAuthUser(state);

        if (!code || !discordId) {
            res.status(400);
            return;
        };

        try {
            const tokenResponse = await fetch('https://apis.roblox.com/oauth/v1/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    client_id: process.env.ROBLOX_OAUTH_CLIENT ?? '',
                    client_secret: process.env.ROBLOX_OAUTH_KEY ?? '',
                    grant_type: 'authorization_code',
                    code: code as string
                })
            });

            if (!tokenResponse.ok) {
                res.status(500);
            };

            const tokenData = await tokenResponse.json() as TokenData;

            const userInfoResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`
                }
            });

            if (!userInfoResponse.ok) {
                res.status(500);
            };

            const userInfoData = await userInfoResponse.json() as UserInfoData;

            const db = getDatabase();
            const usersCollection = db.collection('users');

            await usersCollection.updateOne(
                { _id: discordId as any },
                { $set: { robloxId: userInfoData.sub } },
                { upsert: true }
            );

            res.status(200).redirect('https://rolinker.net/success');
        } catch {
            res.status(500);
            return;
        };
});

export default authRouter;
