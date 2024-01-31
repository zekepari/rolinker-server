import Router from 'koa-router';
import * as userController from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';

const router = new Router();

router.get('/users/@me', authenticate, userController.getCurrentUser);
router.get('/users/:userId/accounts', userController.getUserAccounts);
router.delete('/users/:userId/accounts', authenticate);
router.post('/users/:userId/accounts/primary', authenticate);

export default router;
