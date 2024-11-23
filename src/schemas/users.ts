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


export const AddressSchema = z.object({
	lineOne: z.string(),
	lineTwo: z.string().nullable(),
	city: z.string(),
	country: z.string(),
	pincode: z.string().length(6),
})


export const UpdateUserSchema = z.object({
	name: z.string().optional(),
	defaultShippingAddressId: z.number().min(1).optional(),
	defaultBillingAddressId: z.number().min(1).optional(),
})
