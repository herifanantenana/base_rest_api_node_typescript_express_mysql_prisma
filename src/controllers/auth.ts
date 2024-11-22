import { compareSync, hashSync } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { prismaClient } from "..";
import { BadRequestsException } from '../exceptions/bad-requests';
import { ErrorCode } from '../exceptions/root';
import { LoginSchema, SignupSchema } from '../schemas/users';
import { JWT_SECRET } from "../secrets";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
	SignupSchema.parse(req.body);
	const { name, email, password } = req.body;
	let user = await prismaClient.user.findFirst({ where: { email: email } });

	if (user) {
		next(new BadRequestsException("User already exists!", ErrorCode.USER_ALREADY_EXIST));
		return;
	}
	user = await prismaClient.user.create({
		data: {
			name: name,
			email: email,
			password: hashSync(password, 15),
		},
	});
	res.json(user);
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
	LoginSchema.parse(req.body);
	const { email, password } = req.body;
	if (!email || !password) {
		res.sendStatus(400);
		return;
	}
	let user = await prismaClient.user.findFirst({ where: { email: email } });

	if (!user) {
		next(new BadRequestsException("User does not exits!", ErrorCode.USER_NOT_FOUND));
		return;
	}
	if (!compareSync(password, user.password)) {
		next(new BadRequestsException("Incorrect password!", ErrorCode.INCORRECT_PASSWORD));
		return;
	}
	const token = jwt.sign({ userId: user.id }, JWT_SECRET);

	res.json({ user, token });
};
