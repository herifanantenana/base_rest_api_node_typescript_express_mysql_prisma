import z, { nullable } from "zod";

export const CreateProductsSchema = z.object({
	name: z.string(),
	description: z.string(),
	price: z.number(),
	tags: z.array(z.string().nullable()),
})


