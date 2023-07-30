import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const products = new ProductManager("./src/files/products.json");

router.get('/', async (req,res)=>{
    const prodsList = await products.getProducts();
    res.render('home',{
        css: 'home.css',
        prodsList
    })
})

router.get('/realtimeproducts', async (req,res)=>{
    const prodsList = await products.getProducts();
    res.render('realTimeProducts',{
        css:'home.css',
        prodsList
    })
})

export default router;