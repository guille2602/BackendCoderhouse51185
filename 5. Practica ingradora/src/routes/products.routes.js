import { Router } from "express";
import { io } from "../app.js";
import productsModel from "../dao/models/products.model.js";
import MongoProductManager from "../dao/mongoManagers/dbProductManager.js";

const router = Router();
const prodManager = new MongoProductManager();

router.get("/", async (req, res) => {
    const prodsList = await prodManager.readProducts( req.query.limit );
    prodsList ? res.status(200).send(prodsList) : res.status(500).send(prodsList);
})

router.get("/:pid", async (req, res) => {
    const {product, status, description } = await prodManager.readProduct( req.params.pid );
    res.status(status).send({
        status,
        description,
        product
    })
    }
);

router.post("/", async (req, res) => {
    const {status, description, payload } = await prodManager.addProduct( req.body );

    if (status == 200){
        const prodsList = await prodManager.readProducts();
        io.emit("updatelist", prodsList);
    }

    res.status(status).send({
        status,
        description,
        payload
    })
});

router.put("/:pid", async (req, res) => {
    const {status, description, payload } = await prodManager.updateProduct(  req.params.pid , req.body );

    if (status == 200){
        const prodsList = await prodManager.readProducts();
        io.emit("updatelist", prodsList);
    }

    res.status(status).send({
        status,
        description,
        payload
    })
})


router.delete("/:pid", async (req, res) => {
    
    const {status, description, payload } = await prodManager.deleteProduct(  req.params.pid , req.body );

    if (status == 200){
        const prodsList = await prodManager.readProducts();
        io.emit("updatelist", prodsList);
    }

    res.status(status).send({
        status,
        description,
        payload
    })

});

export default router;
