import type { IncomingMessage, ServerResponse } from "http";
import productController from "../controllers/product.controller";

const routeHandler = (req : IncomingMessage, res:ServerResponse) => {
    const url = req.url
    const method = req.method

    if(url === "/" && method === "GET"){
        //console.log("This is root route")
        res.writeHead(200,{"Content-Type": "application/json"});
        res.end(JSON.stringify({messege: "This is root route!!"}));
    }else if(url?.startsWith("/products")){
        productController(req,res);
    }
    else{
        //console.log("This is route is not define")
        res.writeHead(404,{"Content-Type": "application/json"});
        res.end(JSON.stringify({messege: "This route is not defined!!"}));
    }
};

export default routeHandler;