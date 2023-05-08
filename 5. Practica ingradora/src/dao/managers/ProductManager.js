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
  }

  async addProduct(title, description, code, price, stock, category, thumbnail) {
    const productsList = await this.readProdsFile(this.path);

    let id = 1;
    if (productsList.length !== 0) {
      id = productsList[productsList.length - 1].id + 1;
    }

    let product = {
      id: id,
      title: title,
      description: description,
      code: code,
      price: parseInt(price),
      status: true,
      stock: parseInt(stock),
      category: category,
      thumbnail: thumbnail || [],
    };

    function validData() {
      let validate = true;
      let objValues = Object.values(product);
      //Thumbnails no requiere validación:
      objValues.pop(); 

      objValues.forEach((value) => {
        if (value == undefined || value === "") {
          console.log("Validación de campos vacios falló");
          validate = false;
        }
      });

      if (isNaN(objValues[4]) || isNaN(objValues[6])) {
        validate = false;
        console.log("Validación de campo de tipo numérico falló")
        console.log(product);
      }

      return validate;
    }

    const validCode = ! await this.codeExists(code)
    if (validData() && validCode) {
      productsList.push(product);
      await this.writeProdsFile(productsList);
      return productsList;
    } else {
      console.log("Validación de código de producto repetido falló");
      return false;
    }
  }

  async codeExists(code) {
    const productsList = await this.getProducts();
    let found = productsList.find((prod) => prod.code == code);
    if (found) return true;
    else return false;
  }

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
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
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
      if (code) {
        product["code"] = code;
      }
      if (price) {
        product["price"] = price;
      }
      if (status) {
        product["status"] = status;
      }
      if (stock) {
        product["stock"] = stock;
      }
      if (category) {
        product["category"] = category;
      }
      if (thumbnail) {
        product["thumbnail"] = thumbnail;
      }

      const index = productsList.findIndex((prod) => prod.id === prodId);
      productsList[index] = product;
      await this.writeProdsFile(productsList);
    }
    return product;
  }

  async deleteProduct(prodId) {
    const prodToDelete = await this.getProductById(prodId);
    if (prodToDelete){
      const productsList = await this.readProdsFile(this.path);
      const newProductsList = productsList.filter((prod) => parseInt(prod.id) !== parseInt(prodId));
      await this.writeProdsFile(newProductsList);
      return prodToDelete;
    } else {
      console.log('No existe el ID a borrar')
    }
  }
}

const product = new ProductManager("./productos.json");
