import { Router } from 'express';
import { cancelSale, createSale } from '../controllers/sale.controller';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { CreateSaleSchema } from '../utils/validators/sale.validators';

const router = Router();

router.post('/', validateRequestBody(CreateSaleSchema), createSale);
router.delete('/:id', cancelSale);

export default router;