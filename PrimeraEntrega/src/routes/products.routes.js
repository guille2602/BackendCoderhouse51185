import {Router} from 'express';
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const products = new ProductManager("./src/files/products.json");

router.get('/', async (req,res) => {
        const prodsList = await products.getProducts();
        const { limit } = req.query;
        let filteredProds = [];
        if (!limit) {
          res.send(prodsList);
        } else {
          for (let i = 0; i < limit; i++) {
            filteredProds.push(prodsList[i]);
          }
          res.send(filteredProds);
        }
})

router.get("/:pid", async (req, res) => {
    const prodsList = await products.getProducts();
    const prodIndex = prodsList.findIndex( prod => prod.id == req.params.pid);
    if (prodIndex !== -1 ){
       res.send(prodsList[prodIndex])
    } else {
       res.send({"Error":'El id de producto ingresado no existe'})
    }
   })

//addProduct(title, description, code, price, status, stock, category, thumbnail)
router.post('/', async (req,res) => {
    const prodsList = await products.addProduct(
        req.body.title, 
        req.body.description, 
        req.body.code,
        parseInt(req.body.price),
        parseInt(req.body.stock),
        req.body.category, 
        req.body.thumbnail
    );
    if (prodsList){
        res.send({
            status: "Success",
            product: prodsList[prodsList.length - 1]
        })
    }
    res.status(400).send({
        status: "Validation failed"
    })
})

export default router;