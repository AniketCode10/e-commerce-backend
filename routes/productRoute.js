import express from 'express';
import { createProductCtrl, deleteProductCtrl, getProductCtrl, getProductsCtrl, updateProductCtrl } from '../controller/productsCtrl.js';
import { isLoggedIn } from '../middlerwares/isLoggedIn.js';

import {isAdmin} from '../middlerwares/isAdmin.js';
import { upload } from '../utils/multer.js';
// import { upload } from '../config/fileUpload.js';

export const productRouter = express.Router();

// productRouter.post('/',isLoggedIn,upload.single("file"),createProductCtrl)
productRouter.post('/',isLoggedIn,
// isAdmin,
 upload.array("images", 3),createProductCtrl)
productRouter.get('/',getProductsCtrl)
productRouter.get("/:id", getProductCtrl);
productRouter.put("/:id", isLoggedIn, isAdmin,updateProductCtrl);
productRouter.delete("/:id/delete", isLoggedIn, isAdmin,deleteProductCtrl);