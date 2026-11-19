import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../service/product.service";
import type { IProduct } from "../types/product";
import { bodyParser } from "../utils/parseBody";


const productController = async (req: IncomingMessage,res:ServerResponse)=>{
    // /product -> GET,POST,PUT

    const url = req.url;
    const method = req.method
    //console.log(url);

    const urlParams = url?.split("/");
    //console.log(urlParams)["","products","1"]
    const id = urlParams && urlParams[1] === "products" && urlParams[2] ? Number(urlParams[2]) : null;
    console.log(id);

    //Get all Product
    if(url === "/products" && method === "GET"){
        // const products = [
        //     {
        //         "id": 1,
        //         "name": "Product-1",
        //         "price": 20
        //     },
        //     {
        //         "id": 2,
        //         "name": "Product-2",
        //         "price": 30
        //     }
        // ];

        const products = productService();

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(
            JSON.stringify({
                message: "Products retrieved successfully!!",
                data: products,
            })
        );
    }
    else if(method === "GET" && id !== null){
        const products = productService();
        const product = products.find((p: IProduct) => p.id === id);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(
            JSON.stringify({
                message: "Products retrieved successfully!!",
                data: product,
            })
        );
    }
    else if(method === "POST" && url === "/products"){
        const body = await bodyParser(req);
        //console.log(body);
        const newProduct = {
            id : Date.now(),
            ...body,
        };
        //console.log(newProduct);

        const products = productService();
        products.push(newProduct);

        createProduct(products)

        res.writeHead(201, {"Content-Type" : "application/json"});
        res.end(
            JSON.stringify({
                message: "Product created Successfully",
                data: newProduct,
            }),
        );
    }
}

export default productController;