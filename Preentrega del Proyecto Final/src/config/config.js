import dotenv from 'dotenv';
import __dirname from '../utils.js'
import path from "path";
import { Command } from "commander"
import swaggerJsDoc from "swagger-jsdoc"

const program = new Command();
program.option("-mode <modo>", "Modo de inicio", "dev")
program.parse();
export const environment = program.opts();

const pathEnvironment = environment.Mode === "prod" ? path.join(__dirname,"../.env.prod") : path.join(__dirname,"../.env.dev")

dotenv.config({path: pathEnvironment});

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminMail: process.env.ADMIN_MAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    secret: process.env.SECRET,
    gmail: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
        token: process.env.SECRET_TOKEN
    },
    github: {
        clientId: process.env.GITHUB_CLIENTID,
        clientSecret: process.env.GITHUB_CLIENTSECRET,
        clientcallback: process.env.GITHUB_CLIENTCALLBACKURL
    },
    envMode: process.env.ENV_MODE,
}

const swaggerOptions = {
    definition: {
        openapi:"3.0.1",
        info: {
            title: "Documentación de ecommerce",
            version: "1.0.0",
            description: "Definición de endpoints de la api"
        },
    },
    apis:[`${path.join(__dirname,"/docs/**/*.yaml")}`]
}

export const swaggerSpecs = swaggerJsDoc(swaggerOptions);