import { Role, User } from "@prisma/client";

declare global {
	namespace Express {
		interface Request {
			user?: User;
			role?: Role;
		}
	}
}
