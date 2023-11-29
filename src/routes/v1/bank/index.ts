import { getBank } from "controller/v1/bank";
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get('/', expressAsyncHandler(getBank));

export default router