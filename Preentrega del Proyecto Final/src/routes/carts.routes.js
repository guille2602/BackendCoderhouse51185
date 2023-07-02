import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { validateUser, onlyuserAuth } from "../middlewares/policies.js"

const router = Router();

router.post("/", cartController.createCart)
router.get("/:cid", cartController.readCart)
//Auth user only restriction
router.put("/:cid", onlyuserAuth, validateUser, cartController.insertManyInCart)
router.post("/:cid/product/:pid", onlyuserAuth, validateUser, cartController.addProductInCart)
router.put("/:cid/products/:pid", onlyuserAuth, validateUser, cartController.updateCart)
router.delete("/:cid/products/:pid", cartController.deleteCart)
router.delete("/:cid", validateUser, cartController.emptyCart)

export default router;