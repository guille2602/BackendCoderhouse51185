import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async readProdsFile(path) {
    if (fs.existsSync(path)) {
      const products = await fs.promises.readFile(path, "utf-8");
      const parsedProducts = JSON.parse(products);
      return parsedProducts;
    } else {
      return [];
    }
  }

  async writeProdsFile(prodsList) {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(prodsList, null, "\t")
      );
    } catch(e) {
        console.log("Error al escribir el archivo de productos", e)
      }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const productsList = await this.readProdsFile(this.path);

    let id = 1;
    if (productsList.length !== 0) {
      id = productsList[productsList.length - 1].id + 1;
    }

    let product = {
      title: title,
      description: description,
      price: parseInt(price),
      thumbnail: thumbnail,
      code: code,
      stock: parseInt(stock),
      id: id,
    };

    function validData() {
      let validate = true;
      let objValues = Object.values(product);

      //Validación de campos vacíos.
      objValues.forEach((value) => {
        if (value == undefined || value === "") {
          console.log("Validación de campos vacios falló");
          validate = false;
        }
      });

      //Validación de campos de tipo numérico.
      if (isNaN(objValues[2]) || isNaN(objValues[5])) {
        validate = false;
        console.log("Validación de campo de tipo numérico falló");
      }

      return validate;
    }

    //Agregar validación para que no se repita el código anulada
    //  && !this.codeExists(code))
    if (validData()) {
      productsList.push(product);
      await this.writeProdsFile(productsList);
      return productsList;
    } else {
      console.log("Validación de código de producto repetido falló");
    }
  }

  // async codeExists(code) {
  //   const productsList = await this.readProdsFile(this.path);
  //   let found = productsList.find((prod) => prod.code === code);
  //   if (found) {
  //     return true;
  //   } else return false;
  // }

  async getProducts() {
    const productsList = await this.readProdsFile(this.path);
    return productsList;
  }

  async getProductById(prodId) {
    const productsList = await this.readProdsFile(this.path);
    let found = productsList.find(
      (prod) => parseInt(prod.id) === parseInt(prodId)
    );
    if (found) return found;
    else {
      console.log("Id Not found");
      return null;
    }
  }

  async updateProduct(
    prodId,
    title,
    description,
    price,
    thumbnail,
    code,
    stock
  ) {
    const productsList = await this.readProdsFile(this.path);
    const product = await this.getProductById(prodId);
    if (product) {
      if (title) {
        product["title"] = title;
      }
      if (description) {
        product["description"] = description;
      }
      if (price) {
        product["price"] = price;
      }
      if (thumbnail) {
        product["thumbnail"] = thumbnail;
      }
      if (code) {
        product["code"] = code;
      }
      if (stock) {
        product["stock"] = stock;
      }
      const index = productsList.findIndex((prod) => prod.id === prodId);
      productsList[index] = product;
      await this.writeProdsFile(productsList);
    }
    return product;
  }

  async deleteProduct(prodId) {
    if (await this.getProductById(prodId)){
      const productsList = await this.readProdsFile(this.path);
      const newProductsList = productsList.filter((prod) => prod.id !== prodId);
      await this.writeProdsFile(newProductsList);
    } else {
      console.log('No existe el ID a borrar')
    }
  }
}

const product = new ProductManager("./productos.json");
