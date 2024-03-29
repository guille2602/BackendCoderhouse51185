import { cartsService } from "../repositories/index.js";
import { productService, userService } from "../repositories/index.js";
import { generateProduct } from "../utils.js";

class WebViews {

    async renderCart(req, res) {
        const { payload } = await cartsService.readCart(req.params.cid);
        let total = 0;
        payload.products.map(item => {
            item.subtotal = parseInt(item.product.price) * parseInt(item.quantity);
            total += item.subtotal;
        })

        res.render("cart", {
            user: req.session.user,
            css: "../../css/cart.css",
            payload: payload.products,
            total: total,
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
            css: "../css/productsList.css",
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

    async renderProductPage (req, res) {
        const pid = req.params.pid;
        const { product } = await productService.readProduct(pid);
        res.render("singleProduct", {
            css: "../../css/singleProduct.css",
            product: product,
            user: req.session.user
        })
    } 

    renderLogin(req, res) {
        const message = req.query.message || null
        res.render("login", {
            css: "home.css",
            message
        });
    }

    renderRegister(req, res) {
        res.render("register", {
            css: "home.css",
        });
    }

    async renderProfile(req, res) {
        const { avatar } =  await userService.getUser({email: req.session.user.email})
        res.render("profile", {
            css: "profile.css",
            user: req.session.user,
            admin: req.session.admin,
            avatar,
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

    async renderUsersPanel ( req, res ){
        const users = await userService.getAllUsers();
        const filteredUsers = users.filter(user => user.role !== "admin")
        res.render("usersPanel", {
            css: "../css/usersPanel.css",
            users: filteredUsers,
        });
    }

}

export default new WebViews();
