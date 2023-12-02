import { addUserAddress, feedback, getUserAddress, updateUserAddress } from 'controller/v1/users';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const router = Router();


router.get('/:userId/address', expressAsyncHandler(getUserAddress))
router.post('/:userId/address', expressAsyncHandler(addUserAddress))
router.put('/:userId/address/:addressId', expressAsyncHandler(updateUserAddress))
router.post('/:userId/feedback', expressAsyncHandler(feedback))


export default router;
