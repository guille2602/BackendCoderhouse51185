import { Router } from "express";
import productController from "../controllers/product.controller.js";

const router = Router();

router.get("/", productController.readProducts)
router.get("/:pid", productController.readSingleProduct);
router.post("/", productController.addProduct);
router.put("/:pid", productController.updateProduct)
router.delete("/:pid", productController.deleteProduct);

export default router;