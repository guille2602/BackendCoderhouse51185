import { request, response } from "express";
import { cartsService } from "../repositories/index.js";
import { userService } from '../repositories/index.js';

class CartController {
    async createCart(req = request, res = response) {
        const { code, status, payload } = await cartsService.createCart();
        res.status(code).send({
            status,
            payload,
        });
    }

    async readCart( req = request, res = response ) {
        const { code, status, payload } = await cartsService.readCart( req.params.cid );
        res.status(code).send({
            status,
            payload,
        });
    }

    async insertManyInCart( req = request, res = response ) {
        const products = req.body.products;
        const { code, status, payload } = await cartsService.insertManyInCart( req.params.cid, products );
        res.status(code).send({
            status,
            payload
        })
    }

    async addProductInCart ( req = request, res = response ) {
        const { code, status, payload } = await cartsService.addToCart( req.params.cid, req.params.pid);
        res.status(code).send({
            status,
            payload
        })
    }

    async updateCart ( req = request, res = response ) {
        const { code, status, payload } = await cartsService.updateCart( req.params.cid, req.params.pid, req.body.quantity);
        res.status(code).send({
            status,
            payload
        })
    }

    async deleteCart ( req = request, res = response ) {
        const { code, status, payload } = await cartsService.deleteProduct( req.params.cid, req.params.pid );
        res.status(code).send({
            status,
            payload
        })
    }

    async emptyCart ( req = request, res = response ) {
        const { code, status, payload } = await cartsService.emptyCart( req.params.cid );
        res.status(code).send({
            status,
            payload
        })
    }

}

export default new CartController();
