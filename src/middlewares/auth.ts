import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';
import { prismaClient } from '../index';
import { JWT_SECRET } from '../secrets';
import { User } from "@prisma/client";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization!;

	if (!token)
		next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
	try {
		const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
		const user = await prismaClient.user.findFirst({ where: { id: payload.userId } }) as User;
		if (!user)
			next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
		req.user = user;
		next()
	}
	catch (error) {
		next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
	}
}
