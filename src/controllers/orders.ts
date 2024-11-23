import { Order } from "@prisma/client";
import { Request, Response } from "express";
import { prismaClient } from '..';
import { BadRequestsException, NotFoundException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';

export const createOrder = async (req: Request, res: Response) => {
	return await prismaClient.$transaction(async (tx) => {
		const cartItems = await tx.cartItem.findMany({
			where: { userId: req.user?.id },
			include: { product: true, }
		})
		if (cartItems.length === 0)
			res.json({ message: "Cart is empty!" })
		const netAmount = cartItems.reduce((acc, item) => acc + (item.quantity * +item.product.price), 0);
		const address = await tx.address.findFirst({
			where: { id: +req.user?.defaultShippingAddressId! }
		})
		const order = await tx.order.create({
			data: {
				userId: req.user?.id!,
				netAmount: netAmount,
				address: address!.formattedAddress,
				orderProducts: {
					create: cartItems.map((cartItem) => ({
						productId: cartItem.productId,
						quantity: cartItem.quantity
					}))
				}
			}
		})
		const orderEvent = await tx.orderEvent.create({
			data: {
				orderId: order.id
			}
		})

		await tx.cartItem.deleteMany({
			where: {
				userId: req.user?.id
			}
		})
		return res.json(order);
	})
}

export const listOrder = async (req: Request, res: Response) => {
	const orders = await prismaClient.order.findMany({
		where: { userId: req.user?.id }
	})
	res.json(orders);
}

export const cancelOrder = async (req: Request, res: Response) => {
	return await prismaClient.$transaction(async (tx) => {
		let order: Order;
		try {
			order = await tx.order.findFirstOrThrow({
				where: { id: +req.params.id }
			})
		} catch (error) {
			throw new NotFoundException("Order not found!", ErrorCode.ORDER_NOT_FOUND);
		}
		if (order.userId !== req.user?.id)
			throw new BadRequestsException("Order does not belong to the user!", ErrorCode.ORDER_NOT_BELONG);
		order = await tx.order.update({
			where: { id: order.id },
			data: { status: "CANCELLED" }
		})
		await tx.orderEvent.create({
			data: {
				orderId: order.id,
				status: "CANCELLED"
			}
		})
		return res.json(order);
	})
}

export const getOrderById = async (req: Request, res: Response) => {
	try {
		const order = await prismaClient.order.findFirstOrThrow({
			where: { id: +req.params.id },
			include: {
				orderProducts: true,
				orderEvents: true
			}
		})
		res.json(order);
	} catch (error) {
		throw new NotFoundException("Order not found!", ErrorCode.ORDER_NOT_FOUND);
	}
}

export const listAllOrders = async (req: Request, res: Response) => {
	let filter = {}
	let status = req.query.status;
	if (status)
		filter = { status }
	const count = await prismaClient.order.count({
		where: filter
	})
	const orders = await prismaClient.order.findMany({
		where: filter,
		skip: +req.query?.skip! || 0,
		take: +req.query?.take! || count
	})
	res.json(orders);
}

export const changeStatus = async (req: Request, res: Response) => {
	return await prismaClient.$transaction(async (tx) => {
		try {
			const order = await tx.order.update({
				where: { id: +req.params.id },
				data: {
					status: req.body.status,
					orderEvents: {
						create: {
							status: req.body.status
						}
					}
				}
			})
			res.json(order);
		} catch (error) {
			console.log(error);

			throw new NotFoundException("Order not found!", ErrorCode.ORDER_NOT_FOUND);
		}
	})
}

export const listUserOrder = async (req: Request, res: Response) => {
	let filter: {} = {
		userId: +req.params.id
	}
	let status = req.query.status;
	if (status)
		filter = {
			...filter,
			status
		}
	const count = await prismaClient.order.count({
		where: filter
	})
	const orders = await prismaClient.order.findMany({
		where: filter,
		skip: +req.query?.skip! || 0,
		take: +req.query?.take! || count
	})
	res.json(orders);
}


