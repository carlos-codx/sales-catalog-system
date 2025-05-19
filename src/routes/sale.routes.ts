import { Router } from 'express';
import { cancelSale, createSale } from '../controllers/sale.controller';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { CreateSaleSchema } from '../utils/validators/sale.validators';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.post('/', validateRequestBody(CreateSaleSchema), createSale);
router.delete('/:id', cancelSale);

export default router;