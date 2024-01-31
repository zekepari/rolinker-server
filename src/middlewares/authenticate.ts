import { Context, Next } from "koa";
import jwt from "jsonwebtoken";
import { getDatabase } from "../database/mongo.js";

export default async (ctx: Context, next: Next) => {
    const token = ctx.cookies.get('token');

    if (!token) {
        ctx.state.user = null;
        
        return await next();
    }

    const db = getDatabase();
    const usersCollection = db.collection('users');

    try {
        const { sub } = await jwt.verify(token, process.env.JWT_SECRET as string);
        ctx.state.user = await usersCollection.findOne({ _id: sub as any });
    } catch (e) {
        ctx.state.user = null;
    }

    await next();
}