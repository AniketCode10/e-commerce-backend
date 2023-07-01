import express from 'express';
import dotenv from 'dotenv'
import { dbConnect } from '../config/dbConnect.js';
import { userRoutes } from '../routes/userRoute.js';
import { globalErrHandler, notFound } from '../middlerwares/globalErrHandler.js';
import { productRouter } from '../routes/productRoute.js';
import { categoriesRouter } from '../routes/categoriesRoute.js';
import brandsRouter from '../routes/brandRoute.js';
import colorRouter from '../routes/colorRoute.js';
import reviewRouter from '../routes/reviewRoute.js';
import { orderRouter } from '../routes/orderRouter.js';
import Stripe from 'stripe';
import Order from '../models/Orders.js';
import couponsRouter from '../routes/couponRouter.js';

dotenv.config()
dbConnect()

export const app = express()



///stripe

const stripe = new Stripe(process.env.STRIPE_KEY)

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_0f028eeed728369df3d01f742845c2ac1d1173ac37847fc0aefac79289e2a089";

app.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    // console.log(event);
  } catch (err) {
    console.log(err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if(event.type==='payment_intent.succeeded'){
//update
const session = event.data.object;
const orderId = session.metadata.orderId
const paymentStatus = session.status
const paymentMethod = session.payment_method_types[0]
const totalAmount = session.amount_received;
const currency = session.currency
// let oid = JSON.parse(orderId)
// console.log({
//   oid,paymentMethod,paymentStatus,totalAmount,currency
// });
// console.log('event found');
const order = await Order.findByIdAndUpdate(
  JSON.parse(orderId),
  {
    totalPrice: totalAmount / 100,
    currency,
    paymentMethod,
    paymentStatus,
  },
  {
    new: true,
  }
);
console.log(order);
  }else{
    console.log('event not found');
    return 
  }

//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       // const paymentIntentSucceeded = event.data.object;
//       const session = event.data.object;
// const {orderId} = session.metadata
// const paymentStatus = session.payment_status
// const paymentMethod = session.payment_method_types[0]
// const totalAmount = session.amount_total;
// const currency = session.currency
// console.log({
//   orderId,paymentMethod,paymentStatus,totalAmount,currency
// });
// console.log('event found');
//       // Then define and call a function to handle the event payment_intent.succeeded
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
  response.send().end();
});


app.use(express.json())
app.use(express.urlencoded({extended:true}))
//routes
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/products',productRouter)
app.use('/api/v1/categories',categoriesRouter)
app.use('/api/v1/brands',brandsRouter)
app.use("/api/v1/colors", colorRouter);
app.use("/api/v1/reviews/", reviewRouter);
app.use("/api/v1/orders",orderRouter);
app.use("/api/v1/coupons/", couponsRouter);

// middleware
app.use(notFound)
app.use(globalErrHandler)