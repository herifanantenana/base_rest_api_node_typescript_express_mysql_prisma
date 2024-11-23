import { Router } from "express";
import { errorHandlerThis } from '../middlewares/errors';
import { addAddress, deleteAddress, listAddress, updateUser } from '../controllers/users';
import { authMiddleware } from '../middlewares/auth';

const usersRouter: Router = Router()

usersRouter.put("/", [authMiddleware], errorHandlerThis(updateUser))
usersRouter.post("/address", [authMiddleware], errorHandlerThis(addAddress));
usersRouter.get("/address", [authMiddleware], errorHandlerThis(listAddress));
usersRouter.delete("/address/:id", [authMiddleware], errorHandlerThis(deleteAddress));
export default usersRouter;
