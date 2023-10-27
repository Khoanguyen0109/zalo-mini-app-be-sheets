import { createOrder, getOrderDetail, getOrders, getOrdersByUser } from 'controller/v1/orders';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { commonValidate } from 'middleware/validate';

const router = Router();

// router.get('/', commonValidate(), expressAsyncHandler(getOrders));
router.get('/:userId', expressAsyncHandler(getOrdersByUser));
router.get('/:userId/details/:orderId', expressAsyncHandler(getOrderDetail));
router.post('/', expressAsyncHandler(createOrder));


export default router;
