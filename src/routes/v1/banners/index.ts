import { getBanners } from "controller/v1/banners";
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get('/', expressAsyncHandler(getBanners));

export default router