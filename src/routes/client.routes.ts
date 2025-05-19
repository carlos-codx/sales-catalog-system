import { Router } from 'express';
import { createClient } from '../controllers/client.controller';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { CreateClientSchema } from '../utils/validators/client.validators';

const router = Router();

router.post('/', validateRequestBody(CreateClientSchema), createClient);

export default router;