import { addUserFollowed } from 'controller/v1/users';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const router = Router();

router.get('/', expressAsyncHandler(addUserFollowed));
router.get('/:userID', expressAsyncHandler(addUserFollowed));

export default router;
