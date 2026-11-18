import { createServer, IncomingMessage } from "http";
import routeHandler from "./routes/route";

const server = createServer((req: IncomingMessage,res)=>{
    //console.log("Request : ",req); "GET","POST"
    //console.log("Response : ",res);
    // console.log(req.url);
    // console.log(req.method);
    routeHandler(req,res);
},
);

server.listen(5000,() =>{
    console.log("Server is running!!")
})