import Router from 'koa-router';
import * as authController from '../controllers/authController.js';
import authenticate from '../middlewares/authenticate.js';

const router = new Router();

router.get('/auth/discord/login', authController.discordLogin);
router.get('/auth/discord/callback', authController.discordCallback);
router.get('/auth/roblox/login', authenticate, authController.robloxLogin);
router.get('/auth/roblox/callback', authenticate, authController.robloxCallback);

export default router;