import { validateVoucher } from "controller/v1/discounts";
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.post('/validate', expressAsyncHandler(validateVoucher));


export default router;
