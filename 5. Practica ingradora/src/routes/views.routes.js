import { Router } from "express";
import productsModel from "../dao/models/products.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const prodsList = await productsModel.find();
        let parsedProdsList = prodsList.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            code: item.code,
            price: item.price,
            status: item.status,
            stock: item.stock,
            category: item.category
          }))
        res.render("home", {
            css: "home.css",
            parsedProdsList,
        });
    } catch (error) {
        console.log("Error al leer la base de datos de MongoDB", +error);
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const prodsList = await productsModel.find();
        let parsedProdsList = prodsList.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            code: item.code,
            price: item.price,
            status: item.status,
            stock: item.stock,
            category: item.category
          }))
        res.render("realTimeProducts", {
            css: "home.css",
            parsedProdsList,
        });
    } catch (error) {
        console.log("Error al leer la base de datos de MongoDB", + error);
    }
});

export default router;
