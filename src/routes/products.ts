import { Router } from "express";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from '../controllers/products';
import { adminMiddleware } from '../middlewares/admin';
import { authMiddleware } from '../middlewares/auth';
import { errorHandlerThis } from '../middlewares/errors';


const productsRouter: Router = Router();

productsRouter.get("/", [authMiddleware, adminMiddleware], errorHandlerThis(listProducts));
productsRouter.get("/:id", [authMiddleware, adminMiddleware], errorHandlerThis(getProductById));
productsRouter.post("/", [authMiddleware, adminMiddleware], errorHandlerThis(createProduct));
productsRouter.put("/:id", [authMiddleware, adminMiddleware], errorHandlerThis(updateProduct));
productsRouter.delete("/:id", [authMiddleware, adminMiddleware], errorHandlerThis(deleteProduct));

export default productsRouter;
