import { createServer, IncomingMessage } from "http";

const server = createServer((req: IncomingMessage,res)=>{
    //console.log("Request : ",req); "GET","POST"
    //console.log("Response : ",res);
    // console.log(req.url);
    // console.log(req.method);
    const url = req.url
    const method = req.method

    if(url === "/" && method === "GET"){
        //console.log("This is root route")
        res.writeHead(200,{"Content-Type": "application/json"});
        res.end(JSON.stringify({messege: "This is root route!!"}));
    }else if(url?.startsWith){

    }
    else{
        //console.log("This is route is not define")
        res.writeHead(404,{"Content-Type": "application/json"});
        res.end(JSON.stringify({messege: "This route is not defined!!"}));
    }
})

server.listen(5000,() =>{
    console.log("Server is running!!")
})