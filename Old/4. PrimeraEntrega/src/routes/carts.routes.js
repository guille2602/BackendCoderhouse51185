import {Router} from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const carts = new CartManager("./src/files/carts.json");

router.post('/', async (req,res) => {
    const cart = await carts.addNewCart();
    if (cart) {
        res.send({cart})
    } else {
        res.send({
            status: "Failed to add new cart"
        })
    }
})

router.get("/:cid", async (req,res) => {
    const { cid } = req.params;
    const cart = await carts.getCartById(cid);
    if (cart) {
        const products = cart.products;
        res.send({
            Status: "Sucess",
            products
        })
    } else {
        res.send({
            Error: "Cart ID not found"
        })
    }
})

router.post("/:cid/product/:pid", async (req,res) => {
    const { cid, pid } = req.params;

    //Hacer validación de que el pid exista

    const isSuccess = await carts.addProdsToCart(cid, pid);
    if (isSuccess) {
        res.send({
            status: "Success",
            isSuccess
        })
    } else {
        res.send({
            "Error": "Product not added to cart"
        })
    }
})

export default router;