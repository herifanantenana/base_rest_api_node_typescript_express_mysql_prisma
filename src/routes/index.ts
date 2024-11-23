import { Router } from "express";
import authRouter from "./auth";
import productsRouter from "./products";

const rootRouter: Router = Router();

export default (): Router => {
	rootRouter.use("/auth", authRouter(rootRouter));
	rootRouter.use("/products", productsRouter(rootRouter));
	return rootRouter;
};
