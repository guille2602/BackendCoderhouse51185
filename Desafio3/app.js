import express from "express";
import ProductManager from "./src/managers/ProductManager.js";

const PORT = 8080;
const app = express();
const products = new ProductManager("./src/files/db.json");

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto: ${PORT}`);
});

//Necesario para traer consultas por querys.
app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
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
});

app.get("/products/:pid", async (req, res) => {
 const prodsList = await products.getProducts();
 const prodIndex = prodsList.findIndex( prod => prod.id == req.params.pid);
 if (prodIndex !== -1 ){
    res.send(prodsList[prodIndex])
 } else {
    res.send({"Error":'El id de producto ingresado no existe'})
 }
})
