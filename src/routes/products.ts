import { Router } from "express";
import { createProduct } from '../controllers/products';
import { errorHandlerThis } from '../middlewares/errors';
import { authMiddleware } from '../middlewares/auth';
import { adminMiddleware } from '../middlewares/admin';

export default (router: Router): Router => {
	router.post("/", [authMiddleware, adminMiddleware],errorHandlerThis(createProduct));
	return router;
}
