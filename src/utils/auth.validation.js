import {z} from "zod";

export const registerSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }).regex(/^[a-zA-Z\s]+$/, {
      message: "Username must contain letters only",
    }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});