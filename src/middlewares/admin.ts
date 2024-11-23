import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
	let user = req.user;
	let role = req.role;
	if (user && role && user.role === role && role === 'ADMIN')
		next();
	else
		next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
}
