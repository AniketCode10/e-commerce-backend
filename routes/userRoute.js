import express from 'express';
import { getUserProfileCtrl, loginUserCtrl, registerUserCtrl, updateShippingAddresctrl } from '../controller/userCtrl.js';
import { isLoggedIn } from '../middlerwares/isLoggedIn.js';

export const userRoutes = express.Router();

userRoutes.post('/register',registerUserCtrl)
userRoutes.post('/login',loginUserCtrl)
userRoutes.get('/profile',isLoggedIn,getUserProfileCtrl)
userRoutes.put("/update/shipping", isLoggedIn, updateShippingAddresctrl);