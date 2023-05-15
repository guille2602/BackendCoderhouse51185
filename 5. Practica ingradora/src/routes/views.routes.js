import { Router } from "express";
import productsModel from "../dao/models/products.model.js";

const router = Router();

router.get("/", async (req, res) => {
    const { limit = 10, sort = null, page = 1, query = null } = req.query;

    //Parse query
    const parsedQuery = query && query.split("_");
    let searchKey = null;
    let searchValue = null;
    if (parsedQuery?.length == 2) {
        searchKey = parsedQuery[0];
        searchValue = parsedQuery[1];
        if(searchKey == "price" || searchKey == "stock") {
            searchValue = parseInt(searchValue)
        } else if (searchKey === "status") {
            searchValue = searchValue == "true" ? true : false
        }
    }

    try {
        const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = await productsModel.paginate({[searchKey]:searchValue}, {limit:limit, page: page,  sort: sort == 1 || sort == -1 ? {price: sort} : null})
        let parsedProdsList = docs.map((item) => ({
            id: item._id,
            title: item.title,
            description: item.description,
            code: item.code,
            price: item.price,
            status: item.status,
            stock: item.stock,
            category: item.category,
        }));
        const prevLink = `/?page=${hasPrevPage? parseInt(page) - 1: null}&limit=${limit? limit: null}&${ query ? query: null}&sort=${sort}`
        const nextLink = `/?page=${hasNextPage? parseInt(page) + 1: null}&limit=${limit? limit: null}&${ query ? query: null}&sort=${sort}`
        res.render("home", {
            css: "home.css",
            status: "sucess",
            payload: parsedProdsList,
            totalPages,
            prevPage,
            nextPage,
            page, 
            hasPrevPage, 
            hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        console.log("Error al leer la base de datos de MongoDB", +error);
    }
});

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

export default router;
