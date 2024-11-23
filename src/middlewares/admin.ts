import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	let user = req.user;
	console.log(user);
	if (user && user.role === "ADMIN")
		next();
	else
		next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
}
