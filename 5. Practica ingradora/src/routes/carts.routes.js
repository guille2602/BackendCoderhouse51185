import { Router } from "express";
import cartsModel from "../dao/models/carts.model.js";
import productsModel from "../dao/models/products.model.js";
import MongoCartManager from "../dao/mongoManagers/dbCartManager.js";

const router = Router();
const cartManager = new MongoCartManager();

router.post("/", async (req, res) => {

    const { status, description, cart } = await cartManager.createCart();
    res.status(status).send({
        status,
        description,
        cart
    })

});

router.get("/:cid", async (req, res) => {

    const { status, description, cart } = await cartManager.readCart( req.params.cid );
    res.status(status).send({
        status,
        description,
        cart
    })

});

router.post("/:cid/product/:pid", async (req, res) => {

    const { status, description, payload } = await cartManager.addToCart( req.params.cid, req.params.pid);
    res.status(status).send({
        status,
        description,
        payload
    })
    

});

export default router;
