import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }
    //1. Traer carritos desde el filesystem
    async getCarts() {
      let cartsListParsed = [];
      if (fs.existsSync(this.path)) {
        const cartsList = await fs.promises.readFile(this.path, "utf-8");
        cartsListParsed = JSON.parse(cartsList);
      }        
      return cartsListParsed;
    }
  
    //2. Lista los productos del carrito con el id especificado getCartById()
    async getCartById(cId) {
      const cartsList = await this.getCarts();
      let foundCart = cartsList.find(
        (cart) => parseInt(cart.id) == parseInt(cId)
      );
      if (foundCart) {
        return foundCart}
      else {
        console.log("Cart not found");
        return null;
      }
    }
    
    async writeCartsFile(cartsList) {
      try {
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(cartsList, null, "\t")
        );
      } catch(e) {
        console.log("Error al escribir el archivo de carritos", e)
      }
    }

//3. Crea un carrito nuevo con un id autogenerado, autoincremental y un array de productos vacío addCart()

    async addNewCart() {
      const cartsList = await this.getCarts();
      let id = 1;
      if (cartsList.length !== 0) {
        id = cartsList[cartsList.length - 1].id + 1;
      }
  
      let cart = {
        id: id,
        products: []
      }

      cartsList.push(cart);
      await this.writeCartsFile(cartsList);
      return cartsList;
    }

    //4. Agregar productos al carrito con el id especificado. addToCart(), si ya existe un producto con el id, aumentar la cantidad (quantity)

    async addProdsToCart (cid, pid){

      const cartsList = await this.getCarts();
      const cartIndex = cartsList.findIndex((cart) => cart.id == cid);

      if (cartIndex == -1 || cartIndex == undefined ){
        console.log(`Cart with ID ${ cid } not found`)
        return null
      } 

      //Chequear si el producto ya se encuentra agregado al carrito:

      const cartToUpdProducts = cartsList[cartIndex].products;
      const isInCart = cartToUpdProducts.find((prodInCart) => prodInCart.product == pid);
      if (isInCart) {
        isInCart.quantity ++;
      } else {
        cartToUpdProducts.push({
            "product": pid,
            "quantity": 1
        })
      }

      //3. Devuelve el carrito con id seleccionado
      this.writeCartsFile(cartsList);
      return cartsList[cartIndex];

    }
}