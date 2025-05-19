import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { validateRequestBody } from '../middlewares/validate-request-body';
import { LoginSchema, RegisterSchema } from '../utils/validators/auth.validators';

const router = Router();

router.post('/register', validateRequestBody(RegisterSchema), registerUser);
router.post('/login', validateRequestBody(LoginSchema), loginUser);

export default router;