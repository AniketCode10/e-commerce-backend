import express from 'express';
import { createCategoryCtrl, deleteCategoryCtrl, getAllCategoriesCtrl, getSingleCategoryCtrl, updateCategoryCtrl } from '../controller/categoryCtrl.js';
import { isLoggedIn } from '../middlerwares/isLoggedIn.js';
import { isAdmin } from '../middlerwares/isAdmin.js';
import { upload } from '../utils/multer.js';

export const categoriesRouter = express.Router();

categoriesRouter.post('/',isLoggedIn,isAdmin,upload.single("image"),createCategoryCtrl)
categoriesRouter.get("/:id", getSingleCategoryCtrl);
categoriesRouter.get("/", getAllCategoriesCtrl);
categoriesRouter.delete("/:id", isLoggedIn,isAdmin,deleteCategoryCtrl);
categoriesRouter.put("/:id",isLoggedIn,isAdmin, updateCategoryCtrl);