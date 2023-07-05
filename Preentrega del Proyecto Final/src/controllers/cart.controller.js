import { cartsService, productService, ticketService } from "../repositories/index.js";
import { v4 as uuidv4 } from "uuid";
import transport from "../config/gmail.js";

class CartController {
    async createCart(req, res) {
        const { code, status, payload } = await cartsService.createCart();
        res.status(code).send({
            status,
            payload,
        });
    }

    async readCart(req, res) {
        const { code, status, payload } = await cartsService.readCart(
            req.params.cid
        );
        res.status(code).send({
            status,
            payload,
        });
    }

    async insertManyInCart(req, res) {
        const products = req.body.products;
        const { code, status, payload } = await cartsService.insertManyInCart(
            req.params.cid,
            products
        );
        res.status(code).send({
            status,
            payload,
        });
    }

    async addProductInCart(req, res) {
        const { code, status, payload } = await cartsService.addToCart(
            req.params.cid,
            req.params.pid
        );
        res.status(code).send({
            status,
            payload,
        });
    }

    async updateCart(req, res) {
        const { code, status, payload } = await cartsService.updateCart(
            req.params.cid,
            req.params.pid,
            req.body.quantity
        );
        res.status(code).send({
            status,
            payload,
        });
    }

    async deleteCart(req, res) {
        const { code, status, payload } = await cartsService.deleteProduct(
            req.params.cid,
            req.params.pid
        );
        res.status(code).send({
            status,
            payload,
        });
    }

    async emptyCart(req, res) {
        const { code, status, payload } = await cartsService.emptyCart(
            req.params.cid
        );
        res.status(code).send({
            status,
            payload,
        });
    }

    async purchase(req, res) {
        try {
            const cart = await cartsService.readCart(req.params.cid);
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
            console.log("Error al finalizar la compra: " + error);
            res.status(500).send({
                status: "Failed",
                message: "Falló al generar ticket",
                payload: null,
            });
        }
    }
}

export default new CartController();
