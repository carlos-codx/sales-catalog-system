import { Router } from 'express';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/product.controller';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { CreateProductSchema, GetProductSchema, UpdateProductSchema } from '../utils/validators/product.validator';
import { validateRequestQuery } from '../middlewares/validate-request-query';

const router = Router();

router.post('/', validateRequestBody(CreateProductSchema), createProduct);
router.get('/', validateRequestQuery(GetProductSchema), getProducts);
router.put('/:id', validateRequestBody(UpdateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;