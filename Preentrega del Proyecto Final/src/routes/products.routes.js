import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { onlyAdminAuth } from "../middlewares/policies.js"

const router = Router();

router.get("/", productController.readProducts)
router.get("/:pid", productController.readSingleProduct);
//Access restricted, only admin 
router.post("/", onlyAdminAuth, productController.addProduct);
router.put("/:pid", onlyAdminAuth, productController.updateProduct)
router.delete("/:pid", onlyAdminAuth, productController.deleteProduct);

export default router;