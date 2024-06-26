import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import ProductController from "./app/controllers/ProductController";
import CategoryController from "./app/controllers/CategoryController";
import OrderController from "./app/controllers/OrderController";

import authMiddlewares from "./app/middlewares/auth";

const upload = multer(multerConfig);

const routes = new Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello to my first API" });
});

routes.post("/users", UserController.store);

routes.post("/sessions", SessionController.store);

// todas as rotas que estiverem abaixo desse comando vai passar pelo Middlewares
routes.use(authMiddlewares);
// verifa se o token expirou

routes.post("/products", upload.single("file"), ProductController.store); // ira fazer o upload da img do produto
routes.get("/products", ProductController.index);
routes.put("/products/:id", upload.single("file"), ProductController.update);

routes.post("/categories", upload.single("file"), CategoryController.store);
routes.get("/categories", CategoryController.index);
routes.put("/categories/:id", upload.single("file"), CategoryController.update);

routes.post("/orders", OrderController.store);
routes.get("/orders", OrderController.index);
routes.put("/orders/:id", OrderController.update);

export default routes;
