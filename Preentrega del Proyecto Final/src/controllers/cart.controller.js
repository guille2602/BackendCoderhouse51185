import { cartsService, productService, ticketService, userService } from "../repositories/index.js";
import { v4 as uuidv4 } from "uuid";
import transport from "../config/gmail.js";
import { CustomError } from "../services/errors/CustomErrors.service.js";
import { 
    generateUpdateCartErrorInfo, 
    generateCartErrorParams, 
    generateCartOrProductErrorParams, 
    generateProdsQuantityErrorParams, 
    generateCartNotFoundError 
} from "../services/errors/cartErrorsInfo.js";
import { EErrors } from "../services/errors/enums.js"

class CartController {
    async createCart(req, res) {
        const { code, status, payload } = await cartsService.createCart();
        res.status(code).send({
            status,
            payload,
        });
    }

    async readCart(req, res, next) {
        try{
            //Handle id error
            const OjbIdRegEx = /^[0-9a-fA-F]{24}$/;
            const validIdFormat = OjbIdRegEx.test(req.params.cid);
            if ( !validIdFormat ) {
                CustomError.createError({
                    name: "Read cart error",
                    cause: generateCartErrorParams(req.params.cid),
                    message: "Id provided didn't pass validation",
                    errorCode: EErrors.INVALID_PARAM,
                });
                req.logger.error(`error: ${error.cause}`)
            }
            const { code, status, payload } = await cartsService.readCart(
                req.params.cid
            );
            res.status(code).send({
                status,
                payload,
            });
        }
        catch (error) {
            req.logger.error(error.cause)
            next(error);
        }
    }

    async insertManyInCart(req, res, next) {
        const products = req.body.products;
        try{
            //handle id error
            const OjbIdRegEx = /^[0-9a-fA-F]{24}$/;
            const validIdFormat = OjbIdRegEx.test(req.params.cid);
            if ( !validIdFormat ) {
                CustomError.createError({
                    name: "Update cart error",
                    cause: generateCartErrorParams(req.params.cid),
                    message: "Id provided didn't pass validation",
                    errorCode: EErrors.INVALID_PARAM,
                });
                req.logger.error(`error: ${error.cause}`)
            }
            //handle json error
            let validation = true;
            products.forEach(item => {
                if (!OjbIdRegEx.test(item.product._id) || typeof item.quantity !== "number"){
                    validation = false;
                }
            })
            if ( !validation ) {
                CustomError.createError({
                    name: "Update cart error",
                    cause: generateUpdateCartErrorInfo(req.body.products),
                    message: "Error updating cart with many products",
                    errorCode: EErrors.INVALID_JSON,
                });
                req.logger.error(`error: ${error.cause}`)
            }
            const { code, status, payload } = await cartsService.insertManyInCart(
            req.params.cid,
            products
            );
            return res.status(code).send({
                status,
                payload,
            })
        } catch (error){
            req.logger.error(error.cause)
            next(error);
        }
    }

    async addProductInCart(req, res, next) {
        try{
            //handle id error
            const OjbIdRegEx = /^[0-9a-fA-F]{24}$/;
            const validIdFormat = OjbIdRegEx.test(req.params.cid) && OjbIdRegEx.test(req.params.pid);
            if ( !validIdFormat ) {
                CustomError.createError({
                    name: "Update cart error",
                    cause: generateCartOrProductErrorParams(req.params.cid, req.params.pid),
                    message: "Id provided didn't pass validation",
                    errorCode: EErrors.INVALID_PARAM,
                });
            }

            //Validate own products
            const {product} = await productService.readProduct(req.params.pid);
            const productOwner = product.owner._id;
            const user = await userService.getUser({email:req.user.email});
            const userId = user._id;
            if (productOwner.toString() == userId.toString() ){
                return res.status(400).send({
                    status: "failed",
                    description: "El usuario no puede agregar sus productos al carrito",
                    payload: null
                })
            }
            //end of validation
            const { code, status, payload } = await cartsService.addToCart(
                req.params.cid,
                req.params.pid
            );
            return res.status(code).send({
                status,
                payload,
            });
        } catch(error){
            req.logger.error(error.cause)
            next(error);
        }
    }

    async updateCart(req, res, next) {
        try{
            //handle id error
            if ( typeof parseInt(req.body.quantity) !== "number" || parseInt(req.body.quantity) === 0) {
                CustomError.createError({
                    name: "Update cart error",
                    cause: generateProdsQuantityErrorParams(req.body.quantity),
                    message: "Invalid quantity to update product in cart",
                    errorCode: EErrors.INVALID_JSON,
                });
            }
            const OjbIdRegEx = /^[0-9a-fA-F]{24}$/;
            const validIdFormat = OjbIdRegEx.test(req.params.cid) && OjbIdRegEx.test(req.params.pid);
            if ( !validIdFormat ) {
                CustomError.createError({
                    name: "Update cart error",
                    cause: generateCartOrProductErrorParams(req.params.cid, req.params.pid),
                    message: "Id provided didn't pass validation",
                    errorCode: EErrors.INVALID_PARAM,
                });
            }

            const { code, status, payload } = await cartsService.updateCart(
                req.params.cid,
                req.params.pid,
                req.body.quantity
            );
            res.status(code).send({
                status,
                payload,
            });
        } catch(error){
            req.logger.error(error.cause)
            next(error);
        }
    }

    async deleteCart(req, res, next) {
        try{
            //handle id error
            const OjbIdRegEx = /^[0-9a-fA-F]{24}$/;
            const validIdFormat = OjbIdRegEx.test(req.params.cid) && OjbIdRegEx.test(req.params.pid);
            if ( !validIdFormat ) {
                CustomError.createError({
                    name: "Update cart error",
                    cause: generateCartOrProductErrorParams(req.params.cid, req.params.pid),
                    message: "Id provided didn't pass validation",
                    errorCode: EErrors.INVALID_PARAM,
                });
            }
            const { code, status, payload } = await cartsService.deleteProduct(
                req.params.cid,
                req.params.pid
            );
            res.status(code).send({
                status,
                payload,
            });
        } catch (error){
            req.logger.error(error.cause)
            next(error);
        }
    }

    async emptyCart(req, res, next) {
        try{
            //Handle id error
            const OjbIdRegEx = /^[0-9a-fA-F]{24}$/;
            const validIdFormat = OjbIdRegEx.test(req.params.cid);
            if ( !validIdFormat ) {
                CustomError.createError({
                    name: "Read cart error",
                    cause: generateCartErrorParams(req.params.cid),
                    message: "Id provided didn't pass validation",
                    errorCode: EErrors.INVALID_PARAM,
                });
            }
            const { code, status, payload } = await cartsService.emptyCart(
                req.params.cid
            );
            res.status(code).send({
                status,
                payload,
            });
        } catch (error){
            req.logger.error(error.cause)
            next(error);
        }
    }

    async purchase(req, res, next) {
        try {
            //Handle id error
            const OjbIdRegEx = /^[0-9a-fA-F]{24}$/;
            const validIdFormat = OjbIdRegEx.test(req.params.cid);
            if ( !validIdFormat ) {
                CustomError.createError({
                    name: "Read cart error",
                    cause: generateCartErrorParams(req.params.cid),
                    message: "Id provided didn't pass validation",
                    errorCode: EErrors.INVALID_PARAM,
                });
            }
            const cart = await cartsService.readCart(req.params.cid);
            if ( !cart ) {
                CustomError.createError({
                    name: "Read cart error",
                    cause: generateCartNotFoundError(req.params.cid),
                    message: "Cart with Id provided not found",
                    errorCode: EErrors.INVALID_PARAM,
                });
                req.logger.error(`error: ${error.cause}`)
            }
            const prodsList = cart.payload.products;
            //chequeo de stock
            let acceptedProds = [];
            let rejectedProds = [];
            
            const separateProducts = async (prodsList) => {
                for (const prod of prodsList) {
                  //chequear stock
                  const productFromDB = await productService.readProduct(prod.product._id);
                  const realStock = productFromDB?.product.stock;
                  if (prod.quantity <= realStock) {
                    acceptedProds.push(prod);
                  } else {
                    rejectedProds.push(prod);
                  }
                }
              };
            await separateProducts(prodsList);

            // Armar datos del ticket
            const code = uuidv4();
            const purchase_datetime = new Date().toLocaleString();
            const amount = acceptedProds.reduce((total, prod) => {
                return total + prod.product.price * prod.quantity;
            }, 0);
            const purchaser = req.session.email;
            const ticket = {
                code,
                purchase_datetime,
                amount,
                purchaser,
            };
            
            const sucess = await productService.updateStock(acceptedProds);

            if (acceptedProds.length === 0){
                return res.status(400).send({
                    status:"Failed",
                    message:"No hay stock suficiente para procesar el pedido",
                    payload: null,
                })
            }
            
            const { statusCode, status, message, payload } = await ticketService.createTicket(ticket);

            if (sucess) {
                await cartsService.emptyCart(req.params.cid)
                cartsService.insertManyInCart(req.params.cid, rejectedProds);
            }

            let rejectedProdsText = "<h3>Productos rechazados por falta de stock:</h3><br>";
            if (rejectedProds.length>0){
                rejectedProds.forEach(prod=>{
                    rejectedProdsText = rejectedProdsText + `<b>Producto:</b> ${prod.product.title} - <b>Cantidad:</b> ${prod.quantity}<br>`
                })
            }
            const htmlContent = `
            <h1>Información de su compra</h1>
            <p>
            <b>N° de ticket:</b> ${payload.code}<br>
            <b>Fecha y hora de compra:</b>  ${payload.purchase_datetime.toLocaleDateString()}, ${payload.purchase_datetime.toLocaleTimeString()}<br>
            <b>Importe total:</b> $${payload.amount}<br>
            ${rejectedProds.length > 0 ? rejectedProdsText : ""}
            </p>
            `

            const result = transport.sendMail({
                from: 'CoderBackend 51185 ecommerce',
                to: req.user.email,
                subject:'Ticket de compra',
                html: htmlContent
            })
            
            res.status(statusCode).send({
                status,
                message,
                ticket,
                accepted: acceptedProds,
                rejected: rejectedProds,
                payload,
            });
        } catch (error) {
            req.logger.error(error.cause)
            next(error);
        }
    }
}

export default new CartController();
