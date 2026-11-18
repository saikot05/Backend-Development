import { createServer, IncomingMessage } from "http";

const server = createServer((req: IncomingMessage,res)=>{
    //console.log("Request : ",req); "GET","POST"
    //console.log("Response : ",res);
    // console.log(req.url);
    // console.log(req.method);
    const url = req.url
    const method = req.method

    if(url === "/" && method === "GET"){
        console.log("This is root route")
    }else{
        console.log("This is route is not define")
    }
})

server.listen(5000,() =>{
    console.log("Server is running!!")
})