import { Router } from "express";
import productsModel from "../dao/models/products.model.js";
import MongoproductManager from "../dao/mongoManagers/dbProductManager.js";

const router = Router();
const productManager = new MongoproductManager();

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
})

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
    } = await productManager.paginateContent( limit, sort, page, query );
    // res.render("home", {
    //     css: "home.css", 
    //     code,
    //     status,
    //     payload,
    //     totalPages,
    //     prevPage,
    //     nextPage,
    //     page,
    //     hasPrevPage,
    //     hasNextPage,
    //     prevLink,
    //     nextLink,
    // })
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
    })

})

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
    } = await productManager.paginateContent( limit, sort, page, query );
    
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
    })

    //3. Agregar botones para agregar a carrito > agregar Swal > ingresar ID de carrito

})

router.get("/carts/:cid", async (req, res) => {
    //1. Recibir el contenido del carrito
    //2. Renderizar la vista
})

export default router;
