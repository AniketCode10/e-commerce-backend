import express from "express";
import { createReviewCtrl } from "../controller/reviewsCtrl.js";
import { isLoggedIn } from "../middlerwares/isLoggedIn.js";

const reviewRouter = express.Router();

reviewRouter.post("/:productID", isLoggedIn, createReviewCtrl);

export default reviewRouter;