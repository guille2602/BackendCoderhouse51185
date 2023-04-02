import ProductManager from './Manager/DesafioEntregable2.js';

const path = "./Files/Products.json"
const Productos = new ProductManager(path);

//Testing:

async function env (){
    let prodsList = await Productos.getProducts();
    console.log(prodsList);

    /*
    Se llamará al método “addProduct” con los campos:
    title: “producto prueba”
    description:”Este es un producto prueba”
    price:200,
    thumbnail:”Sin imagen”
    code:”abc123”,
    stock:25
    */

    await Productos.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);
    
    console.log(await Productos.getProducts());

    const findItem = await Productos.getProductById(1);
    console.log('Resultado de getProductByID con id 1:')
    console.log(findItem)
    console.log('Resultado de getProductByID con id 99:')
    const findItem2 = await Productos.getProductById(99)
    console.log(findItem2)

    /*
    Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, 
    se evaluará que no se elimine el id y que sí se haya hecho la actualización.
    */
    const modifiedProd = await Productos.updateProduct(1, 'Nuevo titulo', null, null, null, null, null);
    console.log('Se devolverá el producto 1 con título modificado');
    console.log(await Productos.getProductById(1));
    
    const modifiedProd2 = await Productos.updateProduct(1, null, null, 999, null, null, null);
    console.log('Se devolverá el producto 1 con el precio modificado por: $999');
    console.log(await Productos.getProductById(1));

    console.log('Se intentará cambiar el titulo de un producto que no existe');
    const modifiedProd3 = await Productos.updateProduct(99, 'Nuevo titulo', null, null, null, null, null);
    console.log(modifiedProd3); // Debe devolver null

    /* Se llamará al método “deleteProduct”, 
    se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.*/
    await Productos.deleteProduct(3);
    console.log(await Productos.getProductById(3))
    
    console.log('Se intentará eliminar un id que no existe:')
    await Productos.deleteProduct(999);
}

env();