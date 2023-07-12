import { request, response } from "express";
import { productService } from "../repositories/index.js";
import { io } from "../app.js";
import { CustomError } from "../services/errors/CustomErrors.service.js";
import { generateProductErrorInfo, generateProductErrorParams } from "../services/errors/productErrorsInfo.js"
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

    async readSingleProduct(req , res , next) {
        try{
            //Handle id error
            const OjbIdRegEx = /^[0-9a-fA-F]{24}$/;
            const validIdFormat = OjbIdRegEx.test(req.params.pid);
            if ( !validIdFormat ) {
                CustomError.createError({
                    name: "Read product error",
                    cause: generateProductErrorParams(req.params.pid),
                    message: "Id provided didn't pass validation",
                    errorCode: EErrors.INVALID_PARAM,
                });
            }
        const { product, status, description } =
            await productService.readProduct(req.params.pid);
        res.status(status).send({
            status,
            description,
            product,
        });
    } catch(error){
        next(error);
    }
    }

    async addProduct(req = request, res = response, next) {
        try{
            //Handle json error
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

    async updateProduct(req , res, next) {
        try{
            //Handle id error
            const OjbIdRegEx = /^[0-9a-fA-F]{24}$/;
            const validIdFormat = OjbIdRegEx.test(req.params.pid);
            if ( !validIdFormat ) {
                CustomError.createError({
                    name: "Update product error",
                    cause: generateProductErrorParams(req.params.pid),
                    message: "Id provided didn't pass validation",
                    errorCode: EErrors.INVALID_PARAM,
                });
            }
            //Handle json error
            if ( !req.body.title || !req.body.description || !req.body.code || !req.body.price ||  !req.body.status || !req.body.stock || !req.body.category ){
                    CustomError.createError({
                        name: "Update product error",
                        cause: generateProductErrorInfo(req.body),
                        message: "An error ocurred while creating product",
                        errorCode: EErrors.INVALID_JSON,
                    });
            }

            const { status, description, payload } = await productService.updateProduct(req.params.pid, req.body);
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

    async deleteProduct(req, res, next) {
        try{
            //Handle id error
            const OjbIdRegEx = /^[0-9a-fA-F]{24}$/;
            const validIdFormat = OjbIdRegEx.test(req.params.pid);
            if ( !validIdFormat ) {
                CustomError.createError({
                    name: "Delete product error",
                    cause: generateProductErrorParams(req.params.pid),
                    message: "Id provided didn't pass validation",
                    errorCode: EErrors.INVALID_PARAM,
                });
            }
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
        } catch (error){
            next(error);
        }
    }
}

export default new ProductController();
