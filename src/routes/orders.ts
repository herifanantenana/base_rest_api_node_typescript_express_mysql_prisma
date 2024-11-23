import { Router } from "express";
import { errorHandlerThis } from "../middlewares/errors";
import { authMiddleware } from '../middlewares/auth';
import { createOrder, listOrder, cancelOrder, getOrderById, listAllOrders, listUserOrder, changeStatus } from '../controllers/orders';

const ordersRoutes: Router = Router();

ordersRoutes.post("/", [authMiddleware], errorHandlerThis(createOrder));
ordersRoutes.get("/", [authMiddleware], errorHandlerThis(listOrder));
ordersRoutes.put("/:id/cancel", [authMiddleware], errorHandlerThis(cancelOrder));

ordersRoutes.get("/index", [authMiddleware], errorHandlerThis(listAllOrders));
ordersRoutes.get("/users/:id", [authMiddleware], errorHandlerThis(listUserOrder));
ordersRoutes.put("/:id/status", [authMiddleware], errorHandlerThis(changeStatus));
ordersRoutes.get("/:id", [authMiddleware], errorHandlerThis(getOrderById));

export default ordersRoutes;
