import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../service/product.service";
import type { IProduct } from "../types/product";
import { bodyParser } from "../utils/parseBody";
import { json } from "stream/consumers";


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
    }else if(method === "PUT" && id !== null){
        const body = await bodyParser(req);// raw node a req.body ready thakena bodyParser chunk joma kore Json banai
        const products = productService();// purono data load kore cause update korte hole existing list lagbe

        const index = products.findIndex((p:IProduct)=>p.id === id); //? repacle korer position khuje ber kora hocce findIndex diye 
        //console.log(index);
        if(index < 0){
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                    message: "Product not found",
                })
            )
        }
        //console.log(products[index]);
        products[index] = {id: products[index].id, ...body};

        createProduct(products)

        res.writeHead(200, {"Content-Type" : "application/json"});
        res.end(
            JSON.stringify({
                message: "Product updated successfully!",
                data: products[index],
            })
        )
    }else if(method === "PATCH" && id !== null){
        //PATCH = partial update , only the fields sent in the body are changed
        const body = await bodyParser(req);// collect and parse the Json body

        const products = productService();// load the current products

        const index = products.findIndex((p: IProduct)=> p.id === id);

        if(index < 0){
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                    message: "Product not found",
                })
            )
        }

        products[index] = {
            ...products[index],
            ...(body.name !== undefined && {name: body.name}),
            ...(body.price !== undefined && {price: body.price}),
        };
        createProduct(products);

        res.writeHead(200,{"Content-Type": "application/json"});
        res.end(
            JSON.stringify({
                message: "Product updated Succcessfully",
                data: products[index],
            })
        )

    }
    
}

export default productController;