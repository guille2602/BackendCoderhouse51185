import MongoCartManager from "../dao/mongoManagers/dbCartManager.js";
import MongoProductManager from "../dao/mongoManagers/dbProductManager.js";
const productManager = new MongoProductManager();
const cartManager = new MongoCartManager();

class WebViews {

    async renderCart(req, res) {
        const { payload } = await cartManager.readCart(req.params.cid);
        res.render("cart", {
            css: "../../css/home.css",
            payload: payload.products,
        });
    }

    async renderRealTimeProducts (req, res) {
        try {
            const prodsList = await productManager.readProducts();
                res.render("realTimeProducts", {
                css: "home.css",
                prodsList,
            });
        } catch (error) {
            console.log("Error al leer la base de datos de MongoDB", +error);
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
        } = await productManager.paginateContent(limit, sort, page, query);

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
}

export default new WebViews();
