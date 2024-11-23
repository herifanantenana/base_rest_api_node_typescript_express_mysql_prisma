import { Router } from "express";
import { errorHandlerThis } from "../middlewares/errors";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from '../controllers/cart';
import { authMiddleware } from '../middlewares/auth';

const cartsRouter: Router = Router();

cartsRouter.post("/", [authMiddleware], errorHandlerThis(addItemToCart));
cartsRouter.get("/", [authMiddleware], errorHandlerThis(getCart));
cartsRouter.delete("/:id", [authMiddleware], errorHandlerThis(deleteItemFromCart));
cartsRouter.put("/:id", [authMiddleware], errorHandlerThis(changeQuantity));

export default cartsRouter;
