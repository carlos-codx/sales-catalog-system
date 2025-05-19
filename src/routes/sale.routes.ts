import { Router } from 'express';
import { createSale } from '../controllers/sale.controller';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { CreateSaleSchema } from '../utils/validators/sale.validators';

const router = Router();

router.post('/', validateRequestBody(CreateSaleSchema), createSale);

export default router;