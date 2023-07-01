import express from 'express';
import { createOrderCtrl, getAllordersCtrl,getOrderStatsCtrl, getSingleOrderCtrl, updateOrderCtrl } from '../controller/orderCtrl.js';
import { isLoggedIn } from '../middlerwares/isLoggedIn.js';

export const orderRouter = express.Router();

orderRouter.post('/',isLoggedIn,createOrderCtrl)
orderRouter.get("/", isLoggedIn, getAllordersCtrl);
orderRouter.put("/update/:id", isLoggedIn, updateOrderCtrl);
orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
orderRouter.get("/sales/stats", isLoggedIn, getOrderStatsCtrl);