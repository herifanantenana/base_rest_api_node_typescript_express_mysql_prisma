import { Router } from "express";
import authRouter from "./auth";

const rootRouter: Router = Router();

export default (): Router => {
	rootRouter.use("/auth", authRouter(rootRouter));
	return rootRouter;
};
