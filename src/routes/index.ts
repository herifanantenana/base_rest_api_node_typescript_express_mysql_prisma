import { Router } from "express";
import authRouter from "./auth";
import cartsRouter from "./carts";
import productsRouter from "./products";
import usersRouter from "./users";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/products", productsRouter);
rootRouter.use("/users", usersRouter);
rootRouter.use("/carts", cartsRouter);

export default rootRouter;
