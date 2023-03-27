import fs from 'fs';

async function readProdsFile(path) {
    if (fs.existsSync(path)){
        const products = await fs.promises.readFile(path, 'utf-8');
        const parsedProducts = JSON.parse(products);
        return parsedProducts;
    } else{
        console.log('No se encontró el archivo de productos')
        return [];
    } 
}

async function writeProdsFile(prodsList) {
    try {
        await fs.promises.writeFile(this.path, JSON.stringify(prodsList, null, '\t'))
    }
    catch {console.log('Error al escribir el archivo de productos')}
}

export default class ProductManager {

    constructor (path){
        this.product = [];
        this.path=path;
    }

    async addProduct(title,description, price, thumbnail, code, stock) {

        const productsList = await readProdsFile(this.path);

        //Agregar validación para que id tome el id del último producto y le sume uno, que no tome el product.length

        let id = productsList.length + 1;

        let product = {
            title: title,
            description: description,
            price: parseInt(price),
            thumbnail: thumbnail,
            code: code,
            stock: parseInt(stock),
            id: id,
        }

        function validData () {

            let validate = true;
            let objValues = Object.values(product);

            //Validación de campos vacíos.
            objValues.forEach((value) => {
                    if (value == undefined || value === '') 
                        {
                            console.log('Validación de campos vacios falló')
                            validate = false;
                        };
                })

            //Validación de campos de tipo numérico.
            if (isNaN(objValues[2]) || isNaN(objValues[5])) {
                validate = false;
                console.log('Validación de campo de tipo numérico falló')
            };

            return validate;
        }

        //Agregar validación para que no se repita el código
        if (validData() && !this.codeExists(code)) 
            {
                productsList.push(product);
                writeProdsFile(productsList);
                return productsList
            } 
        else {
            console.log('Validación de código de producto repetido falló');
        }
    }
    
    async codeExists(code) {
        const productsList = await readProdsFile(this.path);
        let found = productsList.find((prod)=> prod.code === code);
        if (found) {
            return true;
        } else
            return false;
    }

    async getProducts(){
        const productsList = await readProdsFile(this.path);
        return productsList;
    }

    async getProductById(prodId){
        const productsList = await readProdsFile(this.path);
        let found = productsList.find(prod => parseInt(prod.id) === parseInt(prodId))
        if (found) return found
        else {
            console.log("Not found");
            return null;
        } 
    }

    //updateProduct(prodId){};
    //Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo,
    //como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID
    
    //deleteProduct(prodId){}
    //Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.
}

const product = new ProductManager('./productos.json');
