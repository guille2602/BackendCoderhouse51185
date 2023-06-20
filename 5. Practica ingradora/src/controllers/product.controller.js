import { request, response } from "express";
import MongoProductManager from "../dao/mongoManagers/dbProductManager.js";
import { io } from "../app.js";

const productManager = new MongoProductManager();

class ProductController {
    async readProducts(req = request, res = response) {
        const prodsList = await productManager.readProducts({
            limit: req.query.limit,
            sort: req.query.sort,
        });
        prodsList
            ? res.status(200).send(prodsList)
            : res.status(500).send(prodsList);
    }

    async readSingleProduct(req = request, res = response) {
        const { product, status, description } =
            await productManager.readProduct(req.params.pid);
        res.status(status).send({
            status,
            description,
            product,
        });
    }

    async addProduct(req = request, res = response) {
        const {status, description, payload } = await productManager.addProduct( req.body );
        if (status == 200){
            const prodsList = await productManager.readProducts();
            io.emit("updatelist", prodsList);
        }
        res.status(status).send({
            status,
            description,
            payload
        })
    }

    async updateProduct(req = request, res = response) {
        const {status, description, payload } = await productManager.updateProduct(  req.params.pid , req.body );
        if (status == 200){
            const prodsList = await productManager.readProducts();
            io.emit("updatelist", prodsList);
        }
        res.status(status).send({
            status,
            description,
            payload
        })
    }

    async deleteProduct(req = request, res = response) {
        const {status, description, payload } = await productManager.deleteProduct(  req.params.pid , req.body );
        if (status == 200){
            const prodsList = await productManager.readProducts();
            io.emit("updatelist", prodsList);
        }    
        res.status(status).send({
            status,
            description,
            payload
        })
    }
}

export default new ProductController();