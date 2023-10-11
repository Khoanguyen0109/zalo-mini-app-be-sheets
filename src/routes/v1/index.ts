import { Router } from 'express';

import categories from './categories';
const router = Router();

router.use('/categories', categories);
export default router;
