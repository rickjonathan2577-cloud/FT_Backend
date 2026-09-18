import express from "express";
import { login, register, logout } from "../controller/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../utils/auth.validation.js";

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

export default router;