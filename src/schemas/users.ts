import { z } from "zod";

export const SignupSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(8).max(20),
})

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string()
})
