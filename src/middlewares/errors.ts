import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { InternalException, UnauthorizedException } from '../exceptions/internal-exception';
import { ErrorCode, HttpException } from '../exceptions/root';

export const errorMiddleware = (
	error: HttpException,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.status(error.statusCode).json({
		message: error.message,
		errorCode: error.errorCode,
		errors: error.errors,
	});
};

export const errorHandlerThis = (method: Function) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await method(req, res, next);
		} catch (error: any) {
			let exception: HttpException;
			if (error instanceof HttpException)
				exception = error;
			else if (error instanceof ZodError)
				exception = new UnauthorizedException("Unprocessable entity!", ErrorCode.UNPROCESSABLE_ENTITY, error)
			else
				exception = new InternalException("Something went wrong!", ErrorCode.INTERNAL_EXCEPTION, error)
			next(exception);
		}
		finally {
			console.log("================================================");
		}
	}
}

