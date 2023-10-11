import { getOrderDetail, getOrders, getOrdersByUser } from 'controller/v1/orders';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { commonValidate } from 'middleware/validate';

const router = Router();

router.get('/', commonValidate(), expressAsyncHandler(getOrders));
router.get('/', expressAsyncHandler(getOrdersByUser));
router.get('/', expressAsyncHandler(getOrderDetail));

export default router;
