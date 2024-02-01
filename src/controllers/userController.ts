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

export const deleteAccount = async (ctx: Context) => {
    const user = ctx.state.user;
    
    if (!user || !ctx.params.accountId) {
        ctx.status = 400;
        ctx.body = { error: "Invalid request" };
        return;
    };

    const accountId = ctx.params.accountId;
    const accounts = user.accounts.ids;

    if (!accounts.includes(accountId)) {
        ctx.status = 404;
        ctx.body = { error: "Account not found" };
        return;
    }

    try {
        const db = getDatabase();
        const usersCollection = db.collection('users');

        await usersCollection.updateOne(
            { _id: user._id },
            { $pull: { 'accounts.ids': accountId } }
        );

        ctx.status = 200;
        ctx.body = { message: "Account deleted successfully" };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
    };
};

export const setPrimaryAccount = async (ctx: Context) => {
    const user = ctx.state.user;

    if (!user || !ctx.params.accountId) {
        ctx.status = 400;
        ctx.body = { error: "Invalid request" };
        return;
    };

    const newPrimaryAccountId = ctx.params.accountId;
    const accounts = user.accounts.ids;

    if (!accounts.includes(newPrimaryAccountId)) {
        ctx.status = 404;
        ctx.body = { error: "Account not found" };
        return;
    }

    try {
        const db = getDatabase();
        const usersCollection = db.collection('users');

        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { 'accounts.primary': newPrimaryAccountId } }
        );

        ctx.status = 200;
        ctx.body = { message: "Primary account set successfully" };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
    };
};