import { Router } from "express";
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

router.put("/:cid/products/:pid", async (req, res) => {
    const { code, status, payload } = await cartManager.updateCart( req.params.cid, req.params.pid, req.body.quantity);
    res.status(code).send({
        status,
        payload
    })
});

export default router;
