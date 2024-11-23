import { Router } from "express";
import { errorHandlerThis } from "../middlewares/errors";
import { authMiddleware } from '../middlewares/auth';
import { createOrder, listOrder, cancelOrder, getOrderById } from '../controllers/orders';

const ordersRoutes: Router = Router();

ordersRoutes.post("/", [authMiddleware], errorHandlerThis(createOrder));
ordersRoutes.get("/", [authMiddleware], errorHandlerThis(listOrder));
ordersRoutes.put("/:id/cancel", [authMiddleware], errorHandlerThis(cancelOrder));
ordersRoutes.get("/:id", [authMiddleware], errorHandlerThis(getOrderById));

export default ordersRoutes;
