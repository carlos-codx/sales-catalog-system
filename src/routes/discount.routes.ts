import { Router } from 'express';
import { activateDiscount, createDiscount, deactivateDiscount } from '../controllers/discount.controller';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { CreateDiscountSchema } from '../utils/validators/discount.validators';

const router = Router();

router.post('/', validateRequestBody(CreateDiscountSchema), createDiscount);
router.patch('/:id/activate', activateDiscount);
router.patch('/:id/deactivate', deactivateDiscount);

export default router;