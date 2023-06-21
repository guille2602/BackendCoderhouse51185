import { request, response } from "express";
import MongoCartManager from "../dao/mongoManagers/dbCartManager.js";

const cartManager = new MongoCartManager();

class CartController {
    async createCart(req = request, res = response) {
        const { code, status, payload } = await cartManager.createCart();
        res.status(code).send({
            status,
            payload,
        });
    }

    async readCart( req = request, res = response ) {
        const { code, status, payload } = await cartManager.readCart( req.params.cid );
        res.status(code).send({
            status,
            payload,
        });
    }

    async insertManyInCart( req = request, res = response ) {
        const products = req.body.products;
        const { code, status, payload } = await cartManager.insertManyInCart( req.params.cid, products );
        res.status(code).send({
            status,
            payload
        })
    }

    async addProductInCart ( req = request, res = response ) {
        const { code, status, payload } = await cartManager.addToCart( req.params.cid, req.params.pid);
        res.status(code).send({
            status,
            payload
        })
    }

    async updateCart ( req = request, res = response ) {
        const { code, status, payload } = await cartManager.updateCart( req.params.cid, req.params.pid, req.body.quantity);
        res.status(code).send({
            status,
            payload
        })
    }

    async deleteCart ( req = request, res = response ) {
        const { code, status, payload } = await cartManager.deleteProduct( req.params.cid, req.params.pid );
        res.status(code).send({
            status,
            payload
        })
    }

    async emptyCart ( req = request, res = response ) {
        const { code, status, payload } = await cartManager.emptyCart( req.params.cid );
        res.status(code).send({
            status,
            payload
        })
    }

}

export default new CartController();
