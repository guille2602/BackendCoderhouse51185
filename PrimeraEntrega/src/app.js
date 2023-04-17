import express from "express";
import handlebars from "express-handlebars";
import cartsRouter from './routes/carts.routes.js';
import productsRouter from './routes/products.routes.js';
import viewsRouter from './routes/views.routes.js';
import __dirname from "./utils.js";

const PORT = 8080;
const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views',__dirname + '/views');
app.set("view engine", 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto: ${PORT}`);
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);