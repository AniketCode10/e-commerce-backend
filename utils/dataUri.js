import DataURIParser from "datauri/parser.js";
import path from 'path'
import { Buffer } from "buffer";

export const getDataUri = (file)=>{
    // let a = new Buffer()
    const parser = new DataURIParser()
    const extName = path.extname(file.originalname).toString()
    // console.log(parser.format(extName,file));
    // return extName
    return parser.format(extName,file.buffer)
}