import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { validateUser, onlyuserAuth } from "../middlewares/policies.js"

const router = Router();

//Access granted to any user because it's 'read only'
router.post("/", cartController.createCart)
router.get("/:cid", cartController.readCart)
//Auth user only restriction
router.put("/:cid", onlyuserAuth, validateUser, cartController.insertManyInCart)
//Agregar middleware para que los premium no puedan agregar productos propios a su carrito.
router.post("/:cid/products/:pid", onlyuserAuth, validateUser, cartController.addProductInCart)
router.put("/:cid/products/:pid", onlyuserAuth, validateUser, cartController.updateCart)
router.delete("/:cid/products/:pid", validateUser, cartController.deleteCart)
router.delete("/:cid", validateUser, cartController.emptyCart)
router.post("/:cid/purchase", validateUser, cartController.purchase)

export default router;