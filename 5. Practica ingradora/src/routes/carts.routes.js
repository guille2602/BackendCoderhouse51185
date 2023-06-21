import { Router } from "express";
import cartController from "../controllers/cart.controller.js";

const router = Router();

router.post("/", cartController.createCart)
router.get("/:cid", cartController.readCart)
router.put("/:cid", cartController.insertManyInCart)
router.post("/:cid/product/:pid", cartController.addProductInCart)
router.put("/:cid/products/:pid", cartController.updateCart)
router.delete("/:cid/products/:pid", cartController.deleteCart)
router.delete("/:cid", cartController.emptyCart)

export default router;