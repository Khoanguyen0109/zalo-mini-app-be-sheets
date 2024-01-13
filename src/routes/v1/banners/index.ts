import { getBanners, getScoreRank } from 'controller/v1/banners';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const router = Router();

router.get('/', expressAsyncHandler(getBanners));
router.get('/score', expressAsyncHandler(getScoreRank));

export default router;
