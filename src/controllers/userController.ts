import { Context } from 'koa';
import { getDatabase } from '../database/mongo.js';

export const getCurrentUser = async (ctx: Context) => {
    ctx.body = ctx.state.user;
};

export const getUserAccounts = async (ctx: Context) => {
    if (!ctx.params.userId) {
        ctx.status = 400;
        ctx.body = { error: "Invalid user ID" };
        return;
    };

    const sub = ctx.params.userId;

    try {
        const db = getDatabase();
        const usersCollection = db.collection('users');

        const userDocument = await usersCollection.findOne({ _id: sub as any });

        if (!userDocument) {
            ctx.status = 400;
            ctx.body = { error: "User not found" };
            return;
        }

        ctx.body = userDocument.accounts;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
    };
};
