import { addProductToCart, createCart, getCartDetail, getCurrentCart } from 'controller/v1/carts';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const router = Router();

router.get('/:userID', expressAsyncHandler(getCurrentCart));
router.get('/:userID/cart/:cartId', expressAsyncHandler(getCartDetail));
router.post('/:userId', expressAsyncHandler(createCart))
router.put('/:userId/cart/:cartId/add' , expressAsyncHandler(addProductToCart))
router.put('/:userId/cart/:cartId/remove' , expressAsyncHandler(addProductToCart))


export default router;
