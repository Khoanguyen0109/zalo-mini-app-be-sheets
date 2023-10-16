import { Router } from 'express';

import categories from './categories';
import products from './products';
import orders from './orders';
import users from './users';
import carts from './carts';

const router = Router();

router.use('/categories', categories);
router.use('/products', products);
router.use('/orders', orders);
router.use('/users', users);
router.use('/users', carts);

export default router;
