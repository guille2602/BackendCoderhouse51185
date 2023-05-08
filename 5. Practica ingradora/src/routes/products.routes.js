import { Router } from "express";
import ProductManager from "../dao/managers/ProductManager.js";
import { io } from "../app.js";
import productsModel from "../dao/models/products.model.js";

const router = Router();
const products = new ProductManager("./src/files/products.json");

router.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        if (!limit) {
          const prodsList = await productsModel.find();
          res.send(prodsList);
        } else {
            const prodsList = await productsModel.find().limit(limit);
            res.send(prodsList);
        }
    } catch (error) {
        console.log("Error al leer la base de datos de MongoDB" + error);
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const prod = await productsModel.find({ _id: pid });
        if (prod) {
            res.send(prod);
        } else {
            res.send({ Error: "El id de producto ingresado no existe" });
        }
    } catch (error) {
        console.log("Error al leer la base de datos de MongoDB" + error);
    }
});

router.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnail } =
        req.body;
    if (!title || !description || !code || !price || !stock || !category)
        return res
            .status(400)
            .send({ status: "error", error: "Datos incompletos" });
    const status = true;
    const product = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
    };
    const result = await productsModel.create(product);
    //Envío a realTimeProducts
    const prodsList = await productsModel.find();
    io.emit("updatelist", prodsList);
    res.send(result);
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
    } = req.body;
    if (
        !title ||
        !description ||
        !code ||
        !price ||
        !status ||
        !stock ||
        !category
    )
        res.send({
            status: "Falló al actualizar, datos de producto incompletos",
        });
    const prodToUpdate = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
    };
    try {
        const updatedProduct = await productsModel.updateOne(
            { _id: pid },
            prodToUpdate
        );
        res.send(updatedProduct);
    } catch (error) {
        console.log("Error al actualizar la base de datos de MongoDB" + error);
    }
});

router.delete("/:pid", async (req, res) => {
    let { pid } = req.params;
    try {
        const result = await productsModel.deleteOne({ _id: pid });
        if (result) {
            res.send(result);
        } else
            res.status(400).send({
                status: "Falló, el id no existe"
            });
    } catch (error) {
        console.log("Error al eliminar el elemento" + error);
    }
});

export default router;
