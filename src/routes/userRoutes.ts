import Router from 'koa-router';
import * as userController from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';

const router = new Router();

router.get('/users/@me', authenticate, userController.getCurrentUser);
router.get('/users/:userId/accounts', userController.getUserAccounts);

export default router;
