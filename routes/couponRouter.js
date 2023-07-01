import express from "express";
import {
  createCouponCtrl,
  getAllCouponsCtrl,
  getCouponCtrl,
  updateCouponCtrl,
  deleteCouponCtrl,
} from "../controller/couponCtrl.js";
// import isAdmin from "../middlerwares/isAdmin.js";
import { isLoggedIn } from "../middlerwares/isLoggedIn.js";
import { isAdmin } from "../middlerwares/isAdmin.js";

const couponsRouter = express.Router();

couponsRouter.post("/", isLoggedIn, isAdmin,createCouponCtrl);

couponsRouter.get("/", getAllCouponsCtrl);
couponsRouter.put("/update/:id", isLoggedIn, 
isAdmin,
 updateCouponCtrl);
couponsRouter.delete("/delete/:id", isLoggedIn,
 isAdmin,
  deleteCouponCtrl);
couponsRouter.get("/single", getCouponCtrl);
export default couponsRouter;