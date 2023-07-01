import {app} from './app/app.js'
import http from 'http';
import cloudinary from "cloudinary";
import dotenv from 'dotenv'

dotenv.config()

//configure cloudinary
// const cloudinary = cloudinaryPackage.v2;
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});



// create the server
const PORT  = process.env.PORT 
const server = http.createServer(app);

server.listen(PORT,console.log(`Server on ${PORT}`))