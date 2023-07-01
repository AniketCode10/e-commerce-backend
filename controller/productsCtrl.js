import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
// import Color from "../models/Color.js";
import Product from "../models/Products.js";
import asyncHandler from 'express-async-handler';
import cloudinary from 'cloudinary'
import { upload } from '../utils/multer.js';

export const createProductCtrl = asyncHandler(
    async(req,res)=>{


 const {name,description,category,sizes,colors,price,totalQty,brand} = req.body
//product exist
const productExist = await Product.findOne({name})
if(productExist){
    throw new Error('Product in Store Already')
}

//find category
const categoryFound = await Category.findOne({name:category.toLowerCase()})
if (!categoryFound) {
    throw new Error(
      "Category not found, please create category first or check category name"
    );
  }

//find the brand
const brandFound = await Brand.findOne({
    name: brand.toLowerCase(),
    
  });

  if (!brandFound) {
    throw new Error(
      "Brand not found, please create brand first or check brand name"
    );
  }

    //create //--product
    const product = await Product.create({
      name,
      description,
      category:category.toLowerCase(),
      sizes,
      colors,
      user:req.userAuthId,
      price,
      totalQty,
  
      brand:brand.toLowerCase()
  })
  //push the product into category
  categoryFound.products.push(product._id)
  await categoryFound.save()
  
    //push the product into brand
    brandFound.products.push(product._id);
    //resave
    await brandFound.save();

//images upload

//step two
let myCloud = async (imgFiles) => {
      
  await cloudinary.v2.uploader.upload(imgFiles,{folder:"myAniketPics"}, async function(error, result) {
let a = result.secure_url.toString()
console.log(a);
//     console.log(typeof(a));
const user = await Product.findById(product._id)
user.images.push(a)
await user.save()

//  find the product by _id 
//  then push through loop
 });

}
//step one
let files= req.files
for(let i=0;i<files.length;i++){
  // console.log(files[i].path);
  myCloud( files[i].path )
} 

  // res.status(201).json({
  //     status:'success',
  //     msg:'Product created successfully',
  //     data:product
  // })

 });

    
export const getProductsCtrl = asyncHandler(
    async(req,res)=>{
        //query
        let productQuery = Product.find()


//by name
if(req.query.name){

    productQuery=productQuery.find({
        name:{$regex:req.query.name,$options:"i"}
    })
}

// filter by brand

if(req.query.brand){
    productQuery=productQuery.find({
        brand:{$regex:req.query.brand,$options:"i"}
    })
}

// filter by color

if(req.query.colors){
    productQuery=productQuery.find({
        colors:{$regex:req.query.colors,$options:"i"}
    })
}

// filter by category

if(req.query.category){
    productQuery=productQuery.find({
        category:{$regex:req.query.category,$options:"i"}
    })
}

// filter by size

if(req.query.sizes){
    productQuery=productQuery.find({
        sizes:{$regex:req.query.sizes,$options:"i"}
    })
}

// filter by price
// 400-900=[400,900]= gte->400  lte=900
if(req.query.price){
    const priceRange = req.query.price.split('-')
productQuery=productQuery.find({
    price:{$gte:priceRange[0],$lte:priceRange[1]}
})
}

// pagination
//page
const page = parseInt(req.query.page) ? parseInt(req.query.page) : null
//limit
const limit =  parseInt(req.query.limit) ? parseInt(req.query.limit) : null
//startINDEX
const startIndex = (page - 1) * limit;
//endIndex
const endIndex = page*limit
//total
const total = await Product.countDocuments()

productQuery = productQuery.skip(startIndex).limit(limit)

//pgination results
const pagination = {}
if(endIndex<total){
    pagination.next={
        page:page+1,limit:limit
    }
}
if(startIndex>0){
    pagination.prev={
        page:page-1,limit
    }
}


const products = await productQuery.populate('reviews')

        res.status(201).json({
            total,
            status:'success',
            msg:'Products Fetched',
            data:products.length,
            pagination,
            products
        })


    }
)

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public

export const getProductCtrl = asyncHandler(async (req, res) => {
    const product = await Product
    .findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "fullname",
      },
    });
    if (!product) {
      throw new Error("Prouduct not found");
    }
    res.json({
      status: "success",
      message: "Product fetched successfully",
      product,
    });
  });
  
  // @desc    update  product
  // @route   PUT /api/products/:id/update
  // @access  Private/Admin
  
  export const updateProductCtrl = asyncHandler(async (req, res) => {
    const {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
      brand,
    } = req.body;
    //validation
  
    //update
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        sizes,
        colors,
        user,
        price,
        totalQty,
        brand,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json({
      status: "success",
      message: "Product updated successfully",
      product,
    });
  });
  
  // @desc    delete  product
  // @route   DELETE /api/products/:id/delete
  // @access  Private/Admin
  export const deleteProductCtrl = asyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      message: "Product deleted successfully",
    });
  });