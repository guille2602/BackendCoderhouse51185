import { request, response } from "express";
import { productService } from "../repositories/index.js";
import { io } from "../app.js";
import { CustomError } from "../services/errors/CustomErrors.service.js";
import { generateProductErrorInfo } from "../services/errors/productErrorsInfo.js"
import { EErrors } from "../services/errors/enums.js"

class ProductController {
    async readProducts(req = request, res = response) {
        const prodsList = await productService.readProducts({
            limit: req.query.limit,
            sort: req.query.sort,
        });
        prodsList
            ? res.status(200).send(prodsList)
            : res.status(500).send(prodsList);
    }

    async readSingleProduct(req = request, res = response) {
        const { product, status, description } =
            await productService.readProduct(req.params.pid);
        res.status(status).send({
            status,
            description,
            product,
        });
    }

    async addProduct(req = request, res = response, next) {
        //Manejo de errores
        try{
        const { title, description: desc, code, price, stock, category } = req.body;
        if (!title || !desc || !code || !price || !stock || !category) {
            CustomError.createError({
                name: "Create product error",
                cause: generateProductErrorInfo(req.body),
                message: "An error ocurred while creating product",
                errorCode: EErrors.INVALID_JSON,
            });
        }

        const { status, description, payload } =
            await productService.addProduct(req.body);
        if (status == 200) {
            const prodsList = await productService.readProducts();
            io.emit("updatelist", prodsList);
        }
        res.status(status).send({
            status,
            description,
            payload,
        })
        }
        catch(error){
            next(error);
        }
    }

    async updateProduct(req = request, res = response) {
        const { status, description, payload } =
            await productService.updateProduct(req.params.pid, req.body);
        if (status == 200) {
            const prodsList = await productService.readProducts();
            io.emit("updatelist", prodsList);
        }
        res.status(status).send({
            status,
            description,
            payload,
        });
    }

    async deleteProduct(req = request, res = response) {
        const { status, description, payload } =
            await productService.deleteProduct(req.params.pid);
        if (status == 200) {
            const prodsList = await productService.readProducts();
            io.emit("updatelist", prodsList);
        }
        res.status(status).send({
            status,
            description,
            payload,
        });
    }
}

export default new ProductController();
