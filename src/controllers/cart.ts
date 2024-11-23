import { cartItem, Product } from "@prisma/client";
import { Request, Response } from "express";
import { prismaClient } from "..";
import { BadRequestsException, NotFoundException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';
import { ChangeQuantitySchema, CreateCartSchema } from '../schemas/carts';

export const addItemToCart = async (req: Request, res: Response) => {
	// todo: check if product is already in the cards
	let validateData = CreateCartSchema.parse(req.body);
	let product: Product;
	try {
		product = await prismaClient.product.findFirstOrThrow({
			where: { id: validateData.productId }
		});
	} catch (error) {
		throw new NotFoundException("Product not found!", ErrorCode.PRODUCT_NOT_FOUND);
	}
	const cart = await prismaClient.cartItem.create({
		data: {
			userId: req.user?.id!,
			productId: product.id,
			quantity: validateData.quantity
		}
	});
	res.json(cart);
}

export const getCart = async (req: Request, res: Response) => {
	const carts = await prismaClient.cartItem.findMany({
		where: { userId: req.user?.id },
		include: { product: true }
	})
	res.json(carts);
}

export const deleteItemFromCart = async (req: Request, res: Response) => {
	let cart: cartItem;
	try {
		cart = await prismaClient.cartItem.findFirstOrThrow({
			where: { id: +req.params.id }
		});
	} catch (error) {
		throw new NotFoundException("Cart not found!", ErrorCode.CART_NOT_FOUND)
	}
	if (cart.userId !== req.user?.id as number)
		throw new BadRequestsException("Cart does not belong to the user!", ErrorCode.CART_NOT_BELONG)
	cart = await prismaClient.cartItem.delete({
		where: { id: +req.params.id }
	});
	res.json(cart);
}

export const changeQuantity = async (req: Request, res: Response) => {
	let validateData = ChangeQuantitySchema.parse(req.body);
	let cart: cartItem;
	try {
		cart = await prismaClient.cartItem.findFirstOrThrow({
			where: { id: +req.params.id }
		});
	} catch (error) {
		throw new NotFoundException("Cart not found!", ErrorCode.CART_NOT_FOUND)
	}
	if (cart.userId !== req.user?.id as number)
		throw new BadRequestsException("Cart does not belong to the user!", ErrorCode.CART_NOT_BELONG)
	cart = await prismaClient.cartItem.update({
		where: { id: +req.params.id },
		data: { quantity: validateData.quantity }
	});
	res.json(cart);
}
