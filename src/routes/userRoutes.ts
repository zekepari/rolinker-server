import Router from 'koa-router';
import * as userController from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';

const router = new Router();

//@me (authenticated)
router.get('/users/@me', authenticate, userController.getCurrentUser);
router.delete('/users/@me/accounts/:accountId', authenticate, userController.deleteAccount);
router.post('/users/@me/accounts/primary/:accountId', authenticate, userController.setPrimaryAccount);

//open
router.get('/users/:userId') //return basic discord user information - build the information based on the refresh token
router.get('/users/:userId/accounts', userController.getUserAccounts); //return roblox account ids and primary id
router.get('/users/:userId/servers') //return discord servers in which the user owns and rolinker is a member of

//only non-get routes should be authenticated for security.

export default router;
