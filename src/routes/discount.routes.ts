import { Router } from 'express';
import { createDiscount } from '../controllers/discount.controller';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { CreateDiscountSchema } from '../utils/validators/discount.validators';

const router = Router();

router.post('/', validateRequestBody(CreateDiscountSchema), createDiscount);

export default router;