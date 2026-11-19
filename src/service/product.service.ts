import fs  from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(),"./src/database/db.json")

export const productService = () =>{
    //console.log(process.cwd());
    //console.log(filePath);
    const result = fs.readFileSync(filePath,"utf-8");
   // console.log(result.toString())
   return JSON.parse(result);
}