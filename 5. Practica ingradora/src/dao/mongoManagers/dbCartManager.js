import cartsModel from "../models/carts.model.js";
import productsModel from "../models/products.model.js";

export default class MongoCartManager {

    async createCart() {
        let code;
        let status;
        let cart = null;

        const newCart = {
            products: [],
        };

        try {
            cart = await cartsModel.create(newCart);
            if (cart) {
                code = 200;
                status = "Sucess";
            }
        } catch (error) {
            console.log("Error al crear carrito en MongoDB" + error);
            code = 500;
            status = "Error al crear carrito en MongoDB";
        }
        return {
            code,
            status,
            payload: cart,
        };
    }

    async readCart(id) {
        let cart = null;
        let code;
        let status;

        const regEx = /^[0-9a-fA-F]{24}$/;
        const validIdFormat = regEx.test(id);

        if (validIdFormat) {
            try {
                cart = await cartsModel.findOne({ _id: id });
                if (cart) {
                    code = 200;
                    status = "Sucess";
                } else {
                    console.log("Error: El id ingresado no existe");
                    code = 400;
                    status = "Error: El id ingresado no existe";
                }
            } catch (error) {
                code = 500;
                status = "Error al leer la base de datos de MongoDB";
            }
        } else {
            code = 400;
            status = "Error: El formato de id es incorrecto";
        }
        return {
            code,
            status,
            payload: cart
        }
    }

    async addToCart(cartId, prodId) {
        let payload = null;
        let code;
        let description;

        if (!cartId || !prodId) {
            return {
                code: 400,
                description:
                    "Error: No se han enviado todos los datos para agregar un producto al carrito",
                payload: null,
            };
        }

        const regEx = /^[0-9a-fA-F]{24}$/;
        const validIdFormat = regEx.test(cartId) && regEx.test(prodId);

        if (validIdFormat) {
            try {
                //Validación de producto existente
                const productExists = await productsModel.findOne({
                    _id: prodId,
                });
                if (!productExists) {
                    return {
                        code: 400,
                        status: "Error: El id de producto es incorrecto",
                        payload: null,
                    };
                }

                let cartExists = await cartsModel.findOne({ _id: cartId });
                if (!cartExists) {
                    return {
                        code: 400,
                        status: "Error: El id de carrito es incorrecto",
                        payload: null,
                    };
                }
                let quantity = 1;
                cartExists["products"].forEach((item) => {
                    if (item.product._id == prodId) {
                        item.quantity += 1;
                        quantity = item.quantity;
                        return;
                    }
                });

                if (quantity == 1) {
                    cartExists["products"].push({
                        product: prodId,
                        quantity,
                    });
                }

                const payload = await cartsModel.updateOne(
                    { _id: cartId },
                    cartExists
                );

                return {
                    code: 200,
                    status: "Sucess",
                    payload,
                };
            } catch (error) {
                return {
                    code: 500,
                    status: "Error al actualizar el carrito",
                    payload,
                }
            }
        } else {
            return {
                code: 400,
                status: "Error: El formato de id es incorrecto",
            };
        }
    }

    async replaceCart(cid, products) {
        const regEx = /^[0-9a-fA-F]{24}$/;
        const validIdFormat = regEx.test(cid);
        if (!validIdFormat)
            return {
                code: 400,
                status: "Error: El formato de id es incorrecto",
                payload: null,
            };
        try {
            const cart = await cartsModel.findOne({ _id: cid });
            if (!cart)
                return {
                    code: 400,
                    status: "Error, no se encontró el id",
                    payload: null,
                };
            const originalLength = products.length;
            const filteredArray = [];
            for (let product of products) {
                console.log(product.product._id);
                const validation =
                    regEx.test(product.product._id) &&
                    (await productsModel.findOne({
                        _id: product.product._id,
                    })) &&
                    parseInt(product.quantity) >= 1;
                if (validation) {
                    filteredArray.push(product);
                }
            }
            if (originalLength == filteredArray.length) {
                cart.products = products;
                const result = await cartsModel.updateOne({ _id: cid }, cart);
                return {
                    code: 200,
                    status: "Sucess",
                    payload: result,
                };
            } else {
                return {
                    code: 400,
                    status: "Falló al actualizar, error en los datos enviados",
                    payload: null,
                };
            }
        } catch (error) {
            console.log("Error al actualizar el carrito" + error);
            return {
                code: 500,
                status: "Error",
                payload: error,
            };
        }
    }

    async updateCart(cid, pid, qty) {
        try {
            const cart = await cartsModel.findOne({ _id: cid });
            let prodIndex = cart.products.findIndex(
                (prod) => prod.product._id == pid
            );
            if (prodIndex !== -1) {
                cart.products[prodIndex].quantity = qty;
                const result = await cartsModel.updateOne({ _id: cid }, cart);
                if (modifiedCount == 1) {
                    return {
                        code: 200,
                        status: "Sucess",
                        payload: result,
                    };
                } else {
                    return {
                        code: 200,
                        status: "No se han detectado cambios en el producto",
                        payload: result,
                    };
                }
            }
            return {
                code: 400,
                status: "Bad request: Se han pasado parametros incorrectos",
                payload: null,
            };
        } catch (error) {
            console.log("Error al actualizar el carrito" + error);
            return {
                code: 500,
                status: "Error",
                payload: error,
            };
        }
    }

    async deleteProduct(cid, pid) {
        const regEx = /^[0-9a-fA-F]{24}$/;
        const validIdFormat = regEx.test(cid) && regEx.test(pid);
        if (validIdFormat) {
            try {
                const cart = await cartsModel.findOne({ _id: cid });
                const product = await productsModel.findOne({ _id: pid });
                if (!cart || !product) {
                    return {
                        code: 400,
                        status: "Bad request: Se han pasado parametros incorrectos",
                        payload: null,
                    };
                }
                cart.products = cart.products.filter((prod) => {
                    prod.product._id !== pid;
                });
                const result = await cartsModel.updateOne({ _id: cid }, cart);
                return {
                    code: 200,
                    status: "Sucess",
                    payload: result,
                };
            } catch (error) {
                console.log("Error al actualizar el carrito" + error);
                return {
                    code: 500,
                    status: "Error",
                    payload: error,
                };
            }
        } else {
            return {
                code: 400,
                status: "Error, revise los id ingresados",
                payload: null,
            };
        }
    }

    async emptyCart(cid) {
        const regEx = /^[0-9a-fA-F]{24}$/;
        const validIdFormat = regEx.test(cid);
        if (!validIdFormat) {
            return {
                code: 400,
                status: "Error: El formato de id es incorrecto",
                payload: null,
            };
        }
        try {
            const cart = await cartsModel.findOne({ _id: cid });
            if (!cart) {
                return {
                    code: 400,
                    status: "Failed: No se encuentra el id de carrito",
                    payload: null,
                };
            }
            cart.products = [];
            const result = await cartsModel.updateOne({ _id: cid }, cart);
            return {
                code: 200,
                status: "Sucess",
                payload: result,
            };
        } catch (error) {
            console.log("Error al actualizar el carrito" + error);
            return {
                code: 500,
                status: "Error",
                payload: error,
            };
        }
    }
}
