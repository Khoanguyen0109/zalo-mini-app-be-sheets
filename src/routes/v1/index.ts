import { Router } from 'express';

import categories from './categories';
import products from './products';
import orders from './orders';
import users from './users';
import carts from './carts';
import banners from './banners';
import bank from './bank';
import discount from './discount';

const router = Router();

router.use('/categories', categories);
router.use('/products', products);
router.use('/orders', orders);
router.use('/users', users);
router.use('/users', carts);
router.use('/banners', banners);
router.use('/banners', banners);
router.use('/discount', discount);
router.use('/bank-info', bank);

export default router;
