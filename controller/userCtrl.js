import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import { generateToken } from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifiedToken } from "../utils/verifyToken.js";

export const registerUserCtrl = asyncHandler(
    async(req,res)=>{
        const {fullname,email,password} = req.body;
    
        // check user
    const userExists = await User.findOne({email});
    if(userExists){
    throw new Error('User Exists')
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)
    //create user
    const user  = await User.create({
        fullname,email,password:hashedPassword
    })
        res.json({
            msg:'Registered Success',
            status:'Success',
            user
        })
    }
)

export const loginUserCtrl = asyncHandler(
    async(req,res)=>{
        const {email,password} = req.body;
    
        // find user
        const userFound = await User.findOne({email})
        if(userFound && await bcrypt.compare(password,userFound?.password)){
            res.json({
                msg:' Login success',
                Token:generateToken(userFound?._id)
            }) 
        }else{
         throw new Error('Invalid Login')
        }
    }
)

export const getUserProfileCtrl = asyncHandler(
    async(req,res)=>{
const user = await User.findById(req.userAuthId)
      res.json({
        msg:'Welcome to Your Profile',user
      })

    }
)

// @desc    Update user shipping address
// @route   PUT /api/v1/users/update/shipping
// @access  Private

export const updateShippingAddresctrl = asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      address,
      city,
      postalCode,

      phone,
      country,
    } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userAuthId,
      {
        shippingAddress: {
          firstName,
          lastName,
          address,
          city,
          postalCode,
   
          phone,
          country,
        },
        hasShippingAddress: true,
      },
      {
        new: true,
      }
    );
    //send response
    res.json({
      status: "success",
      message: "User shipping address updated successfully",
      user,
    });
  });