class ProductManager {

    constructor (){
        this.product = [];
    }

    addProduct(title,description, price, thumbnail, code, stock) {
        //Validar que no se repita "code" y que todos los campos sean obligatorios, al agregar debe tener id autoincrementable
        let id = this.product.length + 1;

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

            // if (this.codeExists(code)) validate = false;
            return validate;
        }

        //Agregar validación de q no se repita el código
        if (validData() && !this.codeExists(code)) 
            {
                this.product.push(product);
                return product
            } 
        else {
            console.log('Validación de código de producto repetido falló');
        }
    }

    codeExists(code) {
        let found = this.product.find((prod)=> prod.code === code);
        if (found) {
            return true;
        } else
            return false;
    }

    getProducts(){
        return this.product;
    }

    getProductById(prodId){
        //Debe buscar en el arreglo el producto que coincida con el id, En caso de no coincidir ningún id, mostrar en consola un error “Not found”
        let found = this.product.find((prod) => parseInt(prod.id) === parseInt(prodId))
        if (found) return found
        else {
            console.log("Not found");
            return null;
        } 
    }
    
}

const product = new ProductManager();

//Testing:

//Producto Ok
product.addProduct('Algo 1','Some random text',150,'#',199,99);
//Test de código repetido
product.addProduct('Algo 2','Some random text',99,'#',199,1);
//Producto Ok
product.addProduct('Algo 3','Some random text',99,'#',500,1);
//Test de campos vacíos
product.addProduct('Algo 4','Some random text',99,'',500,1);

console.log(product);