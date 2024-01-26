import crypto from 'crypto';

export const stateMap = new Map<string, string>();

export function createAuthUrl(discordId: string) {
    const redirectUri = 'https://rolinker.net/auth';
    const scope = 'openid+profile';
    const state = crypto.randomBytes(16).toString('hex');
    const authUrl = `https://apis.roblox.com/oauth/v1/authorize?client_id=${process.env.ROBLOX_OAUTH_CLIENT}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${state}`;

    stateMap.set(state, discordId);

    setTimeout(async () => {
        stateMap.delete(state);
    }, 120000)

    return authUrl;
}

export function getAuthUser(state: string) {
    const discordId = stateMap.get(state) || null;
    stateMap.delete(state);

    return discordId;
}