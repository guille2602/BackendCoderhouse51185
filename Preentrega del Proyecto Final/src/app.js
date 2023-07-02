//General imports
import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from "passport";
import handlebars from "express-handlebars";

//Custom imports
import cartsRouter from "./routes/carts.routes.js";
import productsRouter from "./routes/products.routes.js";
import chatRouter from "./routes/chat.routes.js";
import viewsRouter from "./routes/views.routes.js";
import __dirname from "./utils.js";
import productsModel from "./dao/models/products.model.js";
import messageModel from "./dao/models/messages.model.js";
import sessionRouter from './routes/sessions.routes.js'
import initializePassport from "./config/passport.config.js";
import config from './config/config.js';

//Server vars
const MONGOOSE = config.mongoUrl;
const PORT = config.port;

//Server connection
mongoose.connect(MONGOOSE);
export const app = express();

//Handlebars config
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Server settings
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto: ${PORT}`);
});

//Sessions config with Mongo.
app.use(session({
    store: new MongoStore({
        mongoUrl: MONGOOSE,
        mongoOptions:{useNewUrlParser:true},
        ttl: 1500
    }),
    secret:config.secret,
    resave: false,
    saveUninitialized: false
}))

//Passport config.
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Socket config.

export const io = new Server(server);
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("addproduct", async (data) => {
        const { title, description, code, price, stock, category, thumbnail } =
            data;
        try {
            const sucess = await productsModel.create({
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category,
                thumbnail,
            });
            if (sucess) {
                const updatedList = await productsModel.find();
                let parsedUpdatedList = updatedList.map((item) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    code: item.code,
                    price: item.price,
                    status: item.status,
                    stock: item.stock,
                    category: item.category,
                }));

                io.emit("updatelist", parsedUpdatedList);
            }
        } catch (error) {
            console.log("Error al agregar un producto en MongoDB" + error);
        }
    });

    socket.on("delete", async (id) => {
        try {
            const deleted = await productsModel.deleteOne({ _id: id });
            if (deleted) {
                const updatedList = await productsModel.find();
                let parsedUpdatedList = updatedList.map((item) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    code: item.code,
                    price: item.price,
                    status: item.status,
                    stock: item.stock,
                    category: item.category,
                }));
                io.emit("updatelist", parsedUpdatedList);
            }
        } catch (error) {
            console.log("Error al conectar con MongoDB" + error);
        }
    });

    socket.on("submitedMessage", async (data) => {
        // socket.on => messages
        const { user, message } = data;
        try {
            const newMessage = await messageModel.create({
                user,
                message,
            });
            if (newMessage) {
                const chatLog = await messageModel.find();
                let parsedchatLog = chatLog.map((item) => ({
                    user: item.user,
                    message: item.message,
                }));
                io.emit("updateChat", parsedchatLog); //emit => messageLogs
            }
        } catch (error) {
            console.log("Error al agregar un producto en MongoDB" + error);
        }
    });

    socket.on("authenticated", async (data) => {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (emailRegex.test(data)) {
            const chatLog = await messageModel.find();
            let parsedchatLog = chatLog.map((item) => ({
                user: item.user,
                message: item.message,
            }));
            io.emit("updateChat", parsedchatLog);
        } else {
            io.emit("failedLogin");
            console.log('Login failed')
        }
    }); 
});

//Routes config.
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/chat", chatRouter);
app.use("/api/sessions/", sessionRouter)