import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { v4 } from "uuid";

//Absolut path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

//bcrypt
export const createHash = ( password ) => bcrypt.hashSync( password , bcrypt.genSaltSync(10) );
export const validatePassword = ( user , password ) => bcrypt.compareSync( password , user.password );

//Faker
faker.location = 'es';

export const generateProduct = () => {
    const category = faker.commerce.department();
    const code = concat(category.slice(0,3), v4())
    return {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        code,
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 1, max: 200}),
        category,
        thumbnail: [faker.image.url()]
    }
}

export const generateUsers = () => {
    let productsList = [];
    const cantProducts = Math.floor(Math.random()*10)
    for ( i = 1; i <= cantProducts; i++){
        productsList.push(generateProduct())
    }
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: "",
        age: faker.number.int({ min: 18, max: 99}),
        password: "",
        cart: productsList,
        role: faker.datatype.boolean ? 'user' : 'admin'
    }

}