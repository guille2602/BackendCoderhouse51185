import { Router } from "express";
import MongoCartManager from "../dao/mongoManagers/dbCartManager.js";

const router = Router();
const cartManager = new MongoCartManager();

router.post("/", async (req, res) => {

    const { code, status, payload } = await cartManager.createCart();
    res.status(code).send({
        status,
        payload
    })

})

router.get("/:cid", async (req, res) => {

    const { code, status, payload } = await cartManager.readCart( req.params.cid );
    res.status(code).send({
        status,
        payload
    })

})

router.put("/:cid", async (req, res) => {
    
    const products = req.body.products;
    const cid = req.params.cid;
    const { code, status, payload } = await cartManager.replaceCart( cid, products );
    res.status(code).send({
        status,
        payload
    })
})

router.post("/:cid/product/:pid", async (req, res) => {

    const { code, status, payload } = await cartManager.addToCart( req.params.cid, req.params.pid);
    res.status(code).send({
        status,
        payload
    })
})

router.put("/:cid/products/:pid", async (req, res) => {
    const { code, status, payload } = await cartManager.updateCart( req.params.cid, req.params.pid, req.body.quantity);
    res.status(code).send({
        status,
        payload
    })
})

//Faltan los 2 DELETE

router.delete("/:cid/products/:pid", async (req, res) => {
    const { code, status, payload } = await cartManager.deleteProduct( req.params.cid, req.params.pid );
    res.status(code).send({
        status,
        payload
    })
})

router.delete("/:cid", async (req, res) => {
    const { code, status, payload } = await cartManager.emptyCart( req.params.cid );
    res.status(code).send({
        status,
        payload
    })
})

export default router;
