import { Router } from 'express';

import categories from './categories';
import products from './products';
import orders from './orders';
import users from './users';

const router = Router();

router.use('/categories', categories);
router.use('/products', products);
router.use('/orders', orders);

router.use('/users', orders);

export default router;
