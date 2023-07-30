import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import { io } from "../app.js";

const router = Router();
const products = new ProductManager("./src/files/products.json");

router.get("/", async (req, res) => {
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

router.get("/:pid", async (req, res) => {
  const prodsList = await products.getProducts();
  const prodIndex = prodsList.findIndex((prod) => prod.id == req.params.pid);
  if (prodIndex !== -1) {
    res.send(prodsList[prodIndex]);
  } else {
    res.send({ Error: "El id de producto ingresado no existe" });
  }
});

router.post("/", async (req, res) => {
  const prodsList = await products.addProduct(
    req.body.title,
    req.body.description,
    req.body.code,
    parseInt(req.body.price),
    parseInt(req.body.stock),
    req.body.category,
    req.body.thumbnail
  );
  if (prodsList) {
    io.emit('updatelist', prodsList);
    res.send({
      status: "Success",
      product: prodsList[prodsList.length - 1],
    });
  }
  res.status(400).send({
    status: "Validation failed",
  });
});

/*Debería cambiarlo si tengo tiempo dentro de ProductManager por un método con Object.values y Object.keys*/

router.put("/:pid", async (req, res) => {
  let { pid } = req.params;
  const productToUpdate = await products.updateProduct(
    parseInt(pid),
    req.body.title,
    req.body.description,
    req.body.code,
    req.body.price,
    req.body.status,
    req.body.stock,
    req.body.category,
    req.body.thumbnail
  );
  if (productToUpdate) {
    res.send({
      status: "Success",
      productToUpdate,
    });
  } else {
    res.status(400).send({
        status: "Failed to update"
    })
  }
});

router.delete("/:pid", async (req, res) => {
    let { pid } = req.params;
    const productToDelete = await products.deleteProduct(pid);
    if (productToDelete) {
        const prodsList = await products.getProducts()
        io.emit('updatelist', prodsList);
        res.send({
            status: "Success",
            "deleted item": productToDelete
        })
    } else {
        res.status(400).send({
            status: "Failed to delete"
        })
    }
});

export default router;
