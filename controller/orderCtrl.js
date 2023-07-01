import Order from "../models/Orders.js";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Products.js";
import Stripe from "stripe";
import dotenv from 'dotenv'
import Coupon from "../models/Coupon.js";

dotenv.config()

// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY)
export const createOrderCtrl = asyncHandler(
    async(req,res)=>{

      // get coupan
      const {coupon}= req?.query;
      const couponFound = await Coupon.findOne({
        code:coupon?.toUpperCase()
      })
      
      if(couponFound?.isExpired){
       throw new Error('Coupon has expired')
      }

      if(!couponFound){
        throw new Error('Coupon not found')
       }
// get Discount
const discount = couponFound?.discount / 100
      
           //get the payload(customer,ordreitems,shipping Address,total prics)

           const { orderItems, shippingAddress,totalPrice } = req.body;
        //find the user
        const user = await User.findById(req.userAuthId);
        //check if order is empty
        if (!user?.hasShippingAddress) {
            throw new Error("Please provide shipping address");
          }
          if (orderItems?.length <= 0) {
            throw new Error("No Order Items");
          }
        //place/create order = save in Database
        const order = await Order.create({
            user: req.userAuthId,
            orderItems,
            shippingAddress,
            totalPrice:couponFound ? totalPrice-totalPrice*discount : totalPrice,
          });
        

        // update the product qty

 orderItems.map(async (order) => {
   
   const product = await Product.findById(order._id)
  if(product){
    product.totalSold += order.qty;
    await product.save()
  }
;
 });

 user.orders?.push(order?._id);
 await user.save();       

   //make payment (stripe)
  //convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    payment_intent_data: {
            metadata: {
              orderId: JSON.stringify(order?._id), 
            },
          },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  console.log(order);
  res.send({ url: session.url });
});

//@desc get all orders
//@route GET /api/v1/orders
//@access private

export const getAllordersCtrl = asyncHandler(async (req, res) => {
  //find all orders
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

//@desc get single order
//@route GET /api/v1/orders/:id
//@access private/admin

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  const order = await Order.findById(id);
  //send response
  res.status(200).json({
    success: true,
    message: "Single order",
    order,
  });
});

//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin

export const updateOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});


//@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  //get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);
//get the date

const date = new Date()
const today = new Date(date.getFullYear(),date.getMonth(),date.getDate())
const saleToday = await Order.aggregate([

  // filter out todays order
  {
    $match:{
      createdAt:{
        $gte:today
      }
    }
  },

  // total price from filter out order
  {
    $group:{
      _id:null,
      totalSales:{
        $sum:'totalPrice'
      }
    }
  }
])
  //send response
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    today,
    saleToday,
  });
});