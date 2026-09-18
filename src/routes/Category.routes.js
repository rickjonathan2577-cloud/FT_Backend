import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { create, deleted, getCategory } from "../controller/category.controller.js";
const router = express.Router();

router.get('/', authMiddleware, getCategory)
router.post('/create', authMiddleware, create);
router.delete('/delete/:id', authMiddleware, deleted);
export default router;