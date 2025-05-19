import { Router } from 'express';
import { activateDiscount, createDiscount, deactivateDiscount, getDiscounts } from '../controllers/discount.controller';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { CreateDiscountSchema } from '../utils/validators/discount.validators';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.post('/', validateRequestBody(CreateDiscountSchema), createDiscount);
router.patch('/:id/activate', activateDiscount);
router.patch('/:id/deactivate', deactivateDiscount);
router.get('/', getDiscounts);

export default router;