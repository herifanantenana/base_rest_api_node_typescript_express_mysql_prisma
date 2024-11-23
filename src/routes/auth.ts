import { Router } from "express";
import { login, me, signup } from "../controllers/auth";
import { errorHandlerThis } from "../middlewares/errors";
import { authMiddleware } from '../middlewares/auth';

export default (router: Router): Router => {
	router.post("/signup", errorHandlerThis(signup));
	router.post("/login", errorHandlerThis(login));
	router.get("/me", [authMiddleware], errorHandlerThis(me));
	return router;
};
