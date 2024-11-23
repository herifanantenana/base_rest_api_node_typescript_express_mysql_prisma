
import { Address } from "@prisma/client";
import { Request, Response } from "express";
import { prismaClient } from '..';
import { BadRequestsException, NotFoundException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';
import { AddressSchema, UpdateUserSchema } from '../schemas/users';

export const addAddress = async (req: Request, res: Response) => {
	AddressSchema.parse(req.body);
	const address = await prismaClient.address.create({
		data: {
			...req.body,
			userId: req.user?.id,
		}
	});
	res.json(address);
}


export const deleteAddress = async (req: Request, res: Response) => {
	try {
		let address = await prismaClient.address.delete({
			where: { id: +req.params.id }
		});
		res.json(address);
	} catch (error) {
		throw new NotFoundException("Address not found!", ErrorCode.ADDRESS_NOT_FOUND);
	}
}

export const listAddress = async (req: Request, res: Response) => {
	const addresses = await prismaClient.address.findMany({
		where: { userId: req.user?.id }
	});
	res.json(addresses);
}


export const updateUser = async (req: Request, res: Response) => {
	const validateData = UpdateUserSchema.parse(req.body);
	let shippingAddress: Address;
	let billingAddress: Address;

	if (validateData.defaultShippingAddressId) {
		try {
			shippingAddress = await prismaClient.address.findFirstOrThrow({
				where: { id: validateData.defaultShippingAddressId }
			});
			console.log("shippingAddress", shippingAddress);
		} catch (error) {
			throw new NotFoundException("Address not found!", ErrorCode.ADDRESS_NOT_FOUND);
		}
		if (shippingAddress.userId !== req.user?.id)
			throw new BadRequestsException("Address not belong to the user", ErrorCode.ADDRESS_NOT_BELONG);
	}
	if (validateData.defaultBillingAddressId) {
		try {
			billingAddress = await prismaClient.address.findFirstOrThrow({
				where: { id: validateData.defaultBillingAddressId }
			});
		} catch (error) {
			throw new NotFoundException("Address not found!", ErrorCode.ADDRESS_NOT_FOUND);
		}
		if (billingAddress.userId !== req.user?.id)
			throw new BadRequestsException("Address not belong to the user", ErrorCode.ADDRESS_NOT_BELONG);
	}
	const user = await prismaClient.user.update({
		where: { id: req.user?.id },
		data: validateData
	})
	res.json(user);
}
