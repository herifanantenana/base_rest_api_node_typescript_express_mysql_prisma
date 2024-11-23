import { Router } from "express";
import { login, me, signup } from "../controllers/auth";
import { authMiddleware } from '../middlewares/auth';
import { errorHandlerThis } from "../middlewares/errors";

const authRouter: Router = Router();

authRouter.post("/signup", errorHandlerThis(signup));
authRouter.post("/login", errorHandlerThis(login));
authRouter.get("/me", [authMiddleware], errorHandlerThis(me));

export default authRouter;
