import { cartsService } from "../repositories/index.js";
import { productService } from "../repositories/index.js";
import { generateProduct } from "../utils.js";

class WebViews {

    async renderCart(req, res) {
        const { payload } = await cartsService.readCart(req.params.cid);
        res.render("cart", {
            css: "../../css/home.css",
            payload: payload.products,
        });
    }

    async renderRealTimeProducts (req, res) {
        try {
            const prodsList = await productService.readProducts();
                res.render("realTimeProducts", {
                admin: req.session.admin,
                css: "home.css",
                prodsList,
            });
        } catch (error) {
            req.logger.error(`Error al leer la base de datos de MongoDB: ${error}`);
        }
    }

    async renderHome(req, res) {
        if (!req.session.user) {
            res.render("login", {
                css: "home.css",
            });
        } else {
            res.redirect("/profile");
        }
    }

    async renderProductsPage(req, res) {
        const { limit = 10, sort = null, page = 1, query = null } = req.query;
        const {
            code,
            status,
            payload,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        } = await productService.paginateContent(limit, sort, page, query);

        res.render("products", {
            user: req.session.user,
            admin: req.session.admin,
            css: "../css/products.css",
            code,
            status,
            payload,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        });
    }

    renderLogin(req, res) {
        res.render("login", {
            css: "home.css",
        });
    }

    renderRegister(req, res) {
        res.render("register", {
            css: "home.css",
        });
    }

    renderProfile(req, res) {
        res.render("profile", {
            css: "home.css",
            user: req.session.user,
            admin: req.session.admin,
        });
    }

    renderForgotPassword(req, res) {
        res.render("forgotpass", {
            css: "home.css",
        });
    }

    renderChangePassword(req, res) {
        res.render("changepass", {
            token: req.query.token,
            css: "home.css",
        });
    }

    async renderMockingProducts ( req, res ){
        const quantity = req.query.quantity || 100;
        const products = [];
        for ( let i = 1; i <= parseInt(quantity); i++){
            const newProduct = await generateProduct();
            products.push(newProduct);
        }
        res.render("mocking", {
            prodsList: products,
            css: "../css/products.css"
        });
    }
}

export default new WebViews();
