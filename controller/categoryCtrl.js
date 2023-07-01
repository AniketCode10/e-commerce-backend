import Category from '../models/Category.js'
import asyncHandler from "express-async-handler"
import cloudinary from 'cloudinary'
// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private/Admin

export const createCategoryCtrl = asyncHandler(

    async(req,res)=>{


        const {name}= req.body;
        const categoryFound = await Category.findOne({name});
        if(categoryFound){
            throw new Error('Category Exists')
        }

// connect multer with cloudinary

cloudinary.v2.uploader.upload(req.file.path,{folder:"E-commerce"},
        
async function(error, result) {
    console.log(result);
    
// create categories
const category = await Category.create({
  name:name.toLowerCase(),
  user:req.userAuthId,
  image : result.secure_url
})

res.status(201).json({
  status:'success',
  msg:'Category created successfully',
  data:category
})

 });


  
    }
)

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public

export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json({
      status: "success",
      message: "Categories fetched successfully",
      categories,
    });
  });
  
  // @desc    Get single category
  // @route   GET /api/categories/:id
  // @access  Public
  export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.json({
      status: "success",
      message: "Category fetched successfully",
      category,
    });
  });
  
  // @desc    Update category
  // @route   PUT /api/categories/:id
  // @access  Private/Admin
  export const updateCategoryCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;
  
    //update
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      message: "category updated successfully",
      category,
    });
  });
  
  // @desc    delete category
  // @route   DELETE /api/categories/:id
  // @access  Private/Admin
  export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      message: "Category deleted successfully",
    });
  });