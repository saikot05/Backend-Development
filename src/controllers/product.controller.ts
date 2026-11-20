import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../service/product.service";
import type { IProduct } from "../types/product";
import { bodyParser } from "../utils/parseBody";
import { sendResponse } from "../utils/sendResponse";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;

    const urlParams = url?.split("/");
    const id = urlParams && urlParams[1] === "products" && urlParams[2] ? Number(urlParams[2]) : null;

    // Get all products
    if (url === "/products" && method === "GET") {
        try {
            const products = productService();
            sendResponse(res, true, 200, "Products retrieved successfully", products);
        } catch (error) {
            console.error(error);
            sendResponse(res, false, 500, "Internal server error");
        }
    }

    // Get single product
    else if (method === "GET" && id !== null) {
        try {
            const products = productService();
            const product = products.find((p: IProduct) => p.id === id);

            if (!product) {
                sendResponse(res, false, 404, "Product not found");
            } else {
                sendResponse(res, true, 200, "Product retrieved successfully", product);
            }
        } catch (error) {
            console.error(error);
            sendResponse(res, false, 500, "Internal server error");
        }
    }

    // Create product
    else if (method === "POST" && url === "/products") {
        try {
            const body = await bodyParser(req);

            const newProduct = { id: Date.now(), ...body };

            const products = productService();
            products.push(newProduct);
            createProduct(products);

            sendResponse(res, true, 201, "Product created successfully", newProduct);
        } catch (error) {
            if (error instanceof SyntaxError) {
                // invalid/empty JSON body -> client's fault
                sendResponse(res, false, 400, "Invalid JSON body");
            } else {
                console.error(error);
                sendResponse(res, false, 500, "Internal server error");
            }
        }
    }

    // PUT = full replace
    else if (method === "PUT" && id !== null) {
        try {
            const body = await bodyParser(req);
            const products = productService();
            const index = products.findIndex((p: IProduct) => p.id === id);

            if (index < 0) {
                sendResponse(res, false, 404, "Product not found");
            } else {
                products[index] = { id, name: body.name, price: body.price };
                createProduct(products);

                sendResponse(res, true, 200, "Product updated successfully", products[index]);
            }
        } catch (error) {
            if (error instanceof SyntaxError) {
                sendResponse(res, false, 400, "Invalid JSON body");
            } else {
                console.error(error);
                sendResponse(res, false, 500, "Internal server error");
            }
        }
    }

    // PATCH = partial update
    else if (method === "PATCH" && id !== null) {
        try {
            const body = await bodyParser(req);
            const products = productService();
            const index = products.findIndex((p: IProduct) => p.id === id);

            if (index < 0) {
                sendResponse(res, false, 404, "Product not found");
            } else {
                products[index] = {
                    ...products[index],
                    ...(body.name !== undefined && { name: body.name }),
                    ...(body.price !== undefined && { price: body.price }),
                };
                createProduct(products);

                sendResponse(res, true, 200, "Product updated successfully", products[index]);
            }
        } catch (error) {
            if (error instanceof SyntaxError) {
                sendResponse(res, false, 400, "Invalid JSON body");
            } else {
                console.error(error);
                sendResponse(res, false, 500, "Internal server error");
            }
        }
    }

    // Delete product
    else if (method === "DELETE" && id !== null) {
        try {
            const products = productService();
            const index = products.findIndex((p: IProduct) => p.id === id);

            if (index < 0) {
                sendResponse(res, false, 404, "Product not found");
            } else {
                const [deletedProduct] = products.splice(index, 1);
                createProduct(products);

                sendResponse(res, true, 200, "Product deleted successfully", deletedProduct);
            }
        } catch (error) {
            console.error(error);
            sendResponse(res, false, 500, "Internal server error");
        }
    }

    // No route matched
    else {
        sendResponse(res, false, 404, "Route not found");
    }
};

export default productController;