import { request, response } from "express";
import { productService, userService } from "../repositories/index.js";
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
        req.logger.error(error.cause)
        next(error);
    }
    }

    async addProduct(req = request, res = response, next) {
        try{
            //Handle json error
            const { title, description: desc, code, price, stock, category, thumbnail } = req.body;
            if (!title || !desc || !code || !price || !stock || !category) {
                CustomError.createError({
                    name: "Create product error",
                    cause: generateProductErrorInfo(req.body),
                    message: "An error ocurred while creating product",
                    errorCode: EErrors.INVALID_JSON,
                });
                return res.status(400).json({
                    status: "failed",
                    description: "Bad request, incomplete data"
                })
            }
            const owner = await userService.getUser({email: req.session.user.email});

            const newProduct = {
                title, 
                description: desc,
                code,
                price,
                stock,
                category,
                thumbnail,
                owner: owner._id
            };
            const { status, description, payload } =
                await productService.addProduct(newProduct);
            if (status == 200) {
                req.logger.info('Se ha agregado un producto nuevo');
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
            req.logger.error(error.cause)
            next(error);
        }
    }

    async updateProduct(req , res, next) {
        try{
            //Mover esto despues a un middleware
            const {product} = await productService.readProduct(req.params.pid);
            const productOwner = product.owner._id
            const user = await userService.getUser({email:req.user.email});
            if (productOwner.toString() !== user._id.toString() && !req.session?.admin){
                return res.status(403).send({
                    status: "failed",
                    description: "El usuario no puede editar productos que no le pertenecen",
                    payload: null
                })
            }
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

                    return res.status(400).json({
                        status: "failed",
                        description: "Bad request, incomplete data"
                    })

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
            req.logger.error(error.cause)
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try{
            //Handle id error
            const {product} = await productService.readProduct(req.params.pid);
            const productOwner = product.owner._id
            const user = await userService.getUser({email:req.user.email});
            if (productOwner.toString() !== user._id.toString() && !req.session?.admin ){
                return res.status(403).send({
                    status: "failed",
                    description: "El usuario no puede editar productos que no le pertenecen",
                    payload: null
                })
            }
            const OjbIdRegEx = /^[0-9a-fA-F]{24}$/;
            const validIdFormat = OjbIdRegEx.test(req.params.pid);
            if ( !validIdFormat ) {
                CustomError.createError({
                    name: "Delete product error",
                    cause: generateProductErrorParams(req.params.pid),
                    message: "Id provided didn't pass validation",
                    errorCode: EErrors.INVALID_PARAM,
                });
                return res.status(400).json({
                    status: "failed",
                    description: "Bad request, incomplete data"
                })
            }
            const { status, description, payload } =
                await productService.deleteProduct(req.params.pid);
            if (status == 200) {
                req.logger.info('Se ha agregado borrado un producto');
                const prodsList = await productService.readProducts();
                io.emit("updatelist", prodsList);
            }
            res.status(status).send({
                status,
                description,
                payload,
            });
        } catch (error){
            req.logger.error(error.cause)
            next(error);
        }
    }
}

export default new ProductController();
