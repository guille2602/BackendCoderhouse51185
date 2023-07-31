import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker/locale/es_MX';
import { v4 } from "uuid";
import winston from 'winston';
import path from 'path';
import { Command } from "commander"
import config from "./config/config.js"
import jwt from 'jsonwebtoken';

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
    const code = category.slice(0,3).concat("-",v4())
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        code,
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 1, max: 200}),
        category,
        status: true,
        thumbnail: [faker.image.url()]
    }
}

export const generateUser = () => {
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

//Winston logger

const program = new Command();
const envMode = program.opts().Mode;

const customLevelOps = {
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5 
    },
    colors: {
        fatal:'red',
        error:'magenta',
        warning:'yellow',
        info:'blue',
        http:'green',
        debug:'cyan',
    }
}

export const devLogger = winston.createLogger({
    levels: customLevelOps.levels,
    transports: [
        new winston.transports.Console({level:"debug"})
    ],
    format: winston.format.combine(
            winston.format.colorize( {colors : customLevelOps.colors}),
            winston.format.simple()
    )
})

export const productionLogger = winston.createLogger({
    levels: customLevelOps.levels,
    transports: [
        new winston.transports.Console({ level: "info"}),
        new winston.transports.File({ 
            filename: path.join(__dirname,'./errors.log'), level: "error" 
        })
    ],
    format: winston.format.combine(
        winston.format.colorize( {colors : customLevelOps.colors}),
        winston.format.simple()
)
})

//Middleware
export const addLogger = (req, res, next) => {
    if (envMode === "dev") {
        req.logger = devLogger;
    } else {
        req.logger = productionLogger;
    }
    next();
}

export const generateEmailToken = (email, expireTime) => {
    const token = jwt.sign({email}, config.gmail.token, {expiresIn:expireTime})
    return token
}

export const verifyEmailToken = ( token ) => {
    try {
        const info = jwt.verify(token, config.gmail.token);
        return info.email;
    } catch (error) {
        console.log(error)
        return null;
    }
}