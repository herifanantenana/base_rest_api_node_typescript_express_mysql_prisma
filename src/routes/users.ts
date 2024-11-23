import { Router } from "express";
import { errorHandlerThis } from '../middlewares/errors';
import { addAddress, changeUserRole, deleteAddress, listAddress, listUsers, updateUser, getUserById } from '../controllers/users';
import { authMiddleware } from '../middlewares/auth';
import { adminMiddleware } from '../middlewares/admin';

const usersRouter: Router = Router()

usersRouter.put("/", [authMiddleware], errorHandlerThis(updateUser))
usersRouter.post("/address", [authMiddleware], errorHandlerThis(addAddress));
usersRouter.get("/address", [authMiddleware], errorHandlerThis(listAddress));
usersRouter.delete("/address/:id", [authMiddleware], errorHandlerThis(deleteAddress));

usersRouter.get("/", [authMiddleware, adminMiddleware], errorHandlerThis(listUsers));
usersRouter.get("/:id", [authMiddleware, adminMiddleware], errorHandlerThis(getUserById));
usersRouter.put("/:id/role", [authMiddleware, adminMiddleware], errorHandlerThis(changeUserRole));
export default usersRouter;
