import { Router } from "express";
import cartsModel from "../dao/models/carts.model.js";
import productsModel from "../dao/models/products.model.js";

const router = Router();

router.post("/", async (req, res) => {
    const newCart = {
        products: [],
    };
    try {
        const result = await cartsModel.create(newCart);
        res.send({
            status: "Sucess",
            result,
        });
    } catch (error) {
        console.log("Error al crear carrito en MongoDB" + error);
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartsModel.findOne({ _id: cid });
        if (cart) {
            res.send(cart);
        } else
            res.status(400).send({
                status: "El id ingresado no se encuentra en la base de datos",
            });
    } catch (error) {
        console.log("Error al conectar con MongoDB" + error);
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        //Validación de producto existente
        const productExists = await productsModel.findOne({ _id: pid });
        !productExists &&
            res.status(400).send("El id de producto es incorrecto");
        //Validación de carrito existente
        let cartExists = await cartsModel.findOne({ _id: cid });
        !cartExists && res.status(400).send("El id de carrito es incorrecto");
        //Si existe, chequear si tiene el producto agregado, si existe hacer un updateOne y sumarle 1,
        let quantity = 1;
        cartExists["products"].forEach((item) => {
            if (item.product == pid) {
                item.quantity += 1;
                quantity = item.quantity;
                return;
            }
        });
        if (quantity == 1){
            cartExists["products"].push({
                product: pid,
                quantity: 1,
            })
        }
        const result = await cartsModel.updateOne({ _id:cid }, cartExists);
        res.send({
            status: "Sucess",
            result
        })
    } catch (error) {
        console.log("Error al actualizar el carrito" + error);
    }
});

export default router;
