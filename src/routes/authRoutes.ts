import Router from 'koa-router';
import * as authController from '../controllers/authController.js';

const router = new Router();

router.get('/auth/discord/login', authController.discordLogin);
router.get('/auth/discord/callback', authController.discordCallback);

export default router;