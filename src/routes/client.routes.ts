import { Router } from 'express';
import { createClient, deleteClient, getClients, updateClient } from '../controllers/client.controller';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { CreateClientSchema, GetClientsSchema, UpdateClientSchema } from '../utils/validators/client.validators';
import { validateRequestQuery } from '../middlewares/validate-request-query';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.post('/', validateRequestBody(CreateClientSchema), createClient);
router.get('/', validateRequestQuery(GetClientsSchema), getClients);

router.put('/:id', validateRequestBody(UpdateClientSchema), updateClient);
router.delete('/:id', deleteClient);

export default router;