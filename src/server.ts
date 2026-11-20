import { createServer, IncomingMessage } from "http";
import routeHandler from "./routes/route";
import config from "./config";

const server = createServer((req: IncomingMessage,res)=>{
    //console.log("Request : ",req); "GET","POST"
    //console.log("Response : ",res);
    // console.log(req.url);
    // console.log(req.method);
    routeHandler(req,res);
},
);

server.listen(config.port,() =>{
    console.log(`Server is running on the port ${config.port}`)
})