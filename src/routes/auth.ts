import { Router } from "express";
import { login, signup } from "../controllers/auth";
import { errorHandlerThis } from "../middlewares/errors";

export default (router: Router): Router => {
	router.post("/signup", errorHandlerThis(signup));
	router.post("/login", errorHandlerThis(login));
	return router;
};
