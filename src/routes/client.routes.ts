import { Router } from 'express';
import { createClient, getClients } from '../controllers/client.controller';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { CreateClientSchema, GetClientsSchema } from '../utils/validators/client.validators';
import { validateRequestQuery } from '../middlewares/validate-request-query';

const router = Router();

router.post('/', validateRequestBody(CreateClientSchema), createClient);
router.get('/', validateRequestQuery(GetClientsSchema), getClients);

export default router;