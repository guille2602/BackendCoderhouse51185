import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { checkRole } from "../middlewares/autorization.js"

const router = Router();

router.get("/", productController.readProducts)
router.get("/:pid", productController.readSingleProduct);
//Access restricted, only admin & premium
router.post("/", checkRole(["admin", "premium"]), productController.addProduct);
//El usuario premium solo podrá modificar sus productos.
router.put("/:pid", checkRole(["admin", "premium"]), productController.updateProduct)
router.delete("/:pid", checkRole(["admin", "premium"]), productController.deleteProduct);

export default router;