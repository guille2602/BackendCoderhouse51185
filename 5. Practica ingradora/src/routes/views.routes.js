import { Router } from "express";
import productsModel from "../dao/models/products.model.js";
import MongoProductManager from "../dao/mongoManagers/dbProductManager.js";
import MongoCartManager from "../dao/mongoManagers/dbCartManager.js";

const router = Router();
const productManager = new MongoProductManager();
const cartManager = new MongoCartManager();

router.get("/realtimeproducts", async (req, res) => {
    try {
        const prodsList = await productsModel.find();
        let parsedProdsList = prodsList.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            code: item.code,
            price: item.price,
            status: item.status,
            stock: item.stock,
            category: item.category,
        }));
        res.render("realTimeProducts", {
            css: "home.css",
            parsedProdsList,
        });
    } catch (error) {
        console.log("Error al leer la base de datos de MongoDB", +error);
    }
});

router.get("/", async (req, res) => {
    const { limit = 10, sort = null, page = 1, query = null } = req.query;
    const {
        code,
        status,
        payload,
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
    } = await productManager.paginateContent(limit, sort, page, query);

    res.status(code).send({
        status,
        payload,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
    });
});

router.get("/products", async (req, res) => {
    const { limit = 10, sort = null, page = 1, query = null } = req.query;
    const {
        code,
        status,
        payload,
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
    } = await productManager.paginateContent(limit, sort, page, query);

    res.render("products", {
        css: "../css/products.css",
        code,
        status,
        payload,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
    });
});

router.get("/carts/:cid", async (req, res) => {
    const { payload } = await cartManager.readCart( req.params.cid );
    let parsedList = payload.products.map((item) => ({
        id: item.product.id,
        title: item.product.title,
        description: item.product.description,
        code: item.product.code,
        price: item.product.price,
        category: item.product.category,
        quantity: item.quantity,
    }));
    console.log(parsedList)
    res.render("cart", {
        css: "../../css/home.css",
        payload: parsedList
    });
});

export default router;
