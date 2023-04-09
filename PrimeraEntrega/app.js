import express from "express";
// import ProductManager from "./src/managers/ProductManager.js";
// import CartManager from "./src/managers/CartManager.js";
import cartsRouter from './src/routes/carts.routes.js'
import productsRouter from './src/routes/products.routes.js'

// const products = new ProductManager("./src/files/products.json");
// const carts = new CartManager("./src/files/carts.json");

const PORT = 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto: ${PORT}`);
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);