import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { getCategories } from 'controller/v1/categories';

const router = Router();

router.get('/', expressAsyncHandler(getCategories));

export default router;
