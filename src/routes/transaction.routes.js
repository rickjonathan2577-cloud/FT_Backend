import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { getTrans, UpdateTrans, createTrans, DeleteTrans, getSummary} from '../controller/transaction.controller.js';

const router = express.Router();

router.get('/', authMiddleware, getTrans);
router.post('/create', authMiddleware, createTrans);
router.put('/update/:id', authMiddleware, UpdateTrans);
router.delete('/delete/:id', authMiddleware, DeleteTrans)
router.get('/summary', authMiddleware, getSummary);

export default router