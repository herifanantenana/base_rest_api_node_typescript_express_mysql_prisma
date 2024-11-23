import { compareSync, hashSync } from "bcrypt";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { prismaClient } from "..";
import { BadRequestsException, NotFoundException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';
import { LoginSchema, SignupSchema } from '../schemas/users';
import { JWT_SECRET } from "../secrets";

export const signup = async (req: Request, res: Response) => {
	SignupSchema.parse(req.body);

	const { name, email, password } = req.body;
	let user = await prismaClient.user.findFirst({ where: { email: email } });

	if (user)
		throw new BadRequestsException("User already exists!", ErrorCode.USER_ALREADY_EXIST);

	user = await prismaClient.user.create({
		data: {
			name: name,
			email: email,
			password: hashSync(password, 15),
		},
	});

	const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
	res.json({ user, token });
};

export const login = async (req: Request, res: Response) => {
	LoginSchema.parse(req.body);

	const { email, password } = req.body;
	let user = await prismaClient.user.findFirst({ where: { email: email } });

	if (!user)
		throw new NotFoundException("User does not exits!", ErrorCode.USER_NOT_FOUND);
	if (!compareSync(password, user.password))
		throw new BadRequestsException("Incorrect password!", ErrorCode.INCORRECT_PASSWORD);

	const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
	res.json({ user, token });
};


export const me = async (req: Request, res: Response) => {
	res.json(req.user);
};
