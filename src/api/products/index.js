import express from "express";
import createHttpError from "http-errors";
import { findProductById, findProductByIdAndDelete, findProductByIdAndUpdate, findProducts, saveNewProduct } from "../../lib/db/tools.js";
import { getProducts } from "../../lib/fs/tools.js";

const productsRouter = express.Router();

//1. Post a product
productsRouter.post("/", async (req, res,next) => {
    try {
        const id = await saveNewProduct(req.body)
        res.status(201).send({message: `Product with id: ${id} uploaded successfully`})
    } catch (error) {
        next(error);
    };
});

//2. Returns a list of products
productsRouter.get("/", async (req, res,next) => {
    try {
        const products = await findProducts();
        res.send(products)
    } catch (error) {
        next(error);
    };
});

//3. Returns a single product
productsRouter.get("/:productId", async (req, res,next) => {
    try {
        const product = await findProductById(req.params.productId)
        if (product) {
            res.send(product)
        } else {
            next(createHttpError(`Product with id: ${req.params.productId} not found!`))
        }
    } catch (error) {
        next(error);
    };
});

//4. Edit a single product with a given id
productsRouter.put("/:productId", async (req, res,next) => {
    try {
        const updatedProduct = await findProductByIdAndUpdate(req.params.productId, req.body);

        if (updatedProduct) {
            res.send(updatedProduct)
        } else {
            next(createHttpError(`Product with id: ${req.params.productId} not found!`))
        }
    } catch (error) {
        next(error);
    };
});

//5. Delete a single product with a given id
productsRouter.delete("/:productId", async (req, res,next) => {
    try {
        const updatedProduct = await findProductByIdAndDelete(req.params.productId);

        if (updatedProduct !== null) {
            res.status(204).send(`Product with id: ${req.params.productId} deleted`)
        } else {
            next(createHttpError(`Product with id: ${req.params.productId} not found!`))
        }
    } catch (error) {
        next(error);
    };
});

export default productsRouter;