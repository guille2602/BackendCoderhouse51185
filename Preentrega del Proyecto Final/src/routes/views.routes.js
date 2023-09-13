import { Router } from "express";
import webViews from '../controllers/web.controller.js';
import { publicAccess, privateAccess, checkRole } from '../middlewares/autorization.js';

const router = Router();

router.get( "/carts/:cid", webViews.renderCart);
router.get( "/realtimeproducts", webViews.renderRealTimeProducts );
router.get( "/", webViews.renderHome );
router.get( "/products", webViews.renderProductsPage );
router.get( "/login", publicAccess, webViews.renderLogin )
router.get( "/register", webViews.renderRegister )
router.get( "/profile", privateAccess, webViews.renderProfile )
router.get( "/mockingproducts", webViews.renderMockingProducts )
router.get( "/forgot-password", webViews.renderForgotPassword )
router.get( "/reset-password", webViews.renderChangePassword )
router.get("/users-panel", checkRole(["admin"]), webViews.renderUsersPanel)

export default router;
