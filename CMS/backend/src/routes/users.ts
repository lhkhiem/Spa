import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { listUsers, createUser } from '../controllers/usersController';

const router = Router();

router.get('/', authMiddleware, listUsers);
router.post('/', authMiddleware, createUser);

export default router;
