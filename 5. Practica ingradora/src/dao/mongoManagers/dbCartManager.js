import cartsModel from "../models/carts.model.js";
import productsModel from "../models/products.model.js";


export default class MongoCartManager {
    
    async createCart() {
        let status;
        let description;
        let cart = null;

        const newCart = {
            products: [],
        };

        try {
            cart = await cartsModel.create(newCart);
            if (cart) {
                status = 200;
                description = "Sucess";
            }
        } catch (error) {
            console.log("Error al crear carrito en MongoDB" + error);
            status = 500;
            description = "Error al crear carrito en MongoDB";
        }
        return{
            status,
            description,
            cart
        }
    }

    async readCart(id) {
        let cart = null;
        let status;
        let description;

        const regEx = /^[0-9a-fA-F]{24}$/;
        const validIdFormat = regEx.test(id);

        if (validIdFormat) {
            try {
                cart = await cartsModel.findOne({ _id: id });
                if (cart) {
                    status = 200;
                    description = "Sucess";
                } else {
                    console.log("Error: El id de producto ingresado no existe");
                    description =
                        "Error: El id de producto ingresado no existe";
                    status = 400;
                }
            } catch (error) {
                console.log(
                    "Error al leer la base de datos de MongoDB" + error
                );
                description = "Error al leer la base de datos de MongoDB";
                status = 500;
            }
        } else {
            status = 400;
            description = "Error: El formato de id es incorrecto";
            console.log("Error: El formato de id es incorrecto");
        }

        return {
            status,
            description,
            cart,
        };
    }

    async addToCart( cartId , prodId ){

        let payload = null;
        let status;
        let description;

        if ( !cartId || !prodId ){
            return{
                status: 400,
                description: "Error: No se han enviado todos los datos para agregar un producto al carrito",
                payload: null
            }
        }

        const regEx = /^[0-9a-fA-F]{24}$/;
        const validIdFormat = regEx.test(cartId) && regEx.test(prodId)
        
        if (validIdFormat) {
            
            try {

                //Validación de producto existente
                const productExists = await productsModel.findOne({ _id:prodId });
                if ( !productExists ) {
                    return{
                        status: 400,
                        description: "Error: El id de producto es incorrecto",
                        payload: null
                    }
                }

                //Validación de carrito existente
                let cartExists = await cartsModel.findOne({ _id: cartId });
                if ( !cartExists ) {
                    return{
                        status: 400,
                        description: "Error: El id de carrito es incorrecto",
                        payload: null
                    }
                }

                let quantity = 1;
                
                //Si tiene el producto en el carrito sumar 1
                cartExists["products"].forEach((item) => {
                    if (item.product == prodId) {
                        item.quantity += 1;
                        quantity = item.quantity;
                        return;
                    }
                });

                // Si no existe, agregar el producto con una unidad
                if (quantity == 1){
                    cartExists["products"].push({
                        product: prodId,
                        quantity,
                    })
                }

                const payload = await cartsModel.updateOne({ _id:cartId }, cartExists);

                return{
                    status: 200,
                    description:"Sucess",
                    payload
                }
            } catch (error) {
                console.log("Error al actualizar el carrito" + error);
                return{
                    status: 500,
                    description:"Error al actualizar el carrito",
                    payload
                }
            }
        }
        else {
            console.log("Error: El formato de id es incorrecto");
            return{
                status: 400,
                description: "Error: El formato de id es incorrecto"
            }
        }
    }

    async updateCart ( cid, pid, qty ){
        try {
            const cart = await cartsModel.findOne({ _id:cid });
            let prodIndex = cart.products.findIndex( (prod) => prod.product._id == pid )
            if (prodIndex !== -1) {
                cart.products[prodIndex].quantity = qty;
                const result = await cartsModel.updateOne( {_id:cid }, cart )
                if (modifiedCount == 1) {
                    return {
                        code: 200,
                        status: "Sucess",
                        payload: result
                    }
                } else {
                    return {
                        code: 200,
                        status: "No se han detectado cambios en el producto",
                        payload: result
                    }
                }
            }
            return{
                code: 400,
                status: "Bad request: Se han pasado parametros incorrectos",
                payload: null
            }
        } catch (error) {
            console.log('Error al actualizar el carrito' + error);
            return ({
                code: 500,
                status: "Error",
                payload: error
            })
        }
    }
}
