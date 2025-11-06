import express from 'express';
import { register, login } from '../controllers/authController.js'; 
import { loginLimiter } from '../middlewares/rateLimiter.js'; 

const router = express.Router();

router.post('/register', register); 
router.post('/login', loginLimiter, login); 

export default router;