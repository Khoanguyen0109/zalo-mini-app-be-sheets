import { getProducts } from 'controller/v1/products';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { commonValidate } from 'middleware/validate';

const router = Router();

router.get('/', commonValidate(), expressAsyncHandler(getProducts));

export default router;
