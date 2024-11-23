import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';
import { CreateProductsSchema } from '../schemas/products';

export const createProduct = async (req: Request, res: Response) => {
	CreateProductsSchema.parse(req.body);

	let product = await prismaClient.product.create({
		data: {
			...req.body,
			tags: req.body.tags.join(',')
		}
	});
	res.json(product);
}

export const updateProduct = async (req: Request, res: Response) => {
	try {
		let product = req.body;
		if (product?.tags)
			product.tags = product.tags.join(',');
		product = await prismaClient.product.update({
			where: { id: +req.params.id },
			data: product
		});
		res.json(product);
	} catch (error) {
		throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
	}
}

export const deleteProduct = async (req: Request, res: Response) => {
	try {

		let product = await prismaClient.product.delete({
			where: { id: +req.params.id }
		});
		res.json(product);
	} catch (error) {
		throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
	}
}

export const listProducts = async (req: Request, res: Response) => {
	const count = await prismaClient.product.count()
	const products = await prismaClient.product.findMany({
		skip: +req.query.skip! || 0,
		take: +req.query.take! || count
	});
	res.json({ count, products })
}


export const getProductById = async (req: Request, res: Response) => {
	try {
		const product = await prismaClient.product.findFirstOrThrow({
			where: { id: +req.params.id }
		})
		res.json(product);
	} catch (error) {
		throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
	}
}

export const searchProducts = async (req: Request, res: Response) => {
	const products = await prismaClient.product.findMany({
		where: {
			name: { search: req.query.q?.toString() },
			description: { search: req.query.q?.toString() },
			tags: { search: req.query.q?.toString() }
		}
	})
	res.json(products);

}
